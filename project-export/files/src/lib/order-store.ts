import "server-only";

import { createHash } from "node:crypto";
import { once } from "events";
import { connect, type TLSSocket } from "tls";

import type {
  CreatorOrder,
  CreatorOrderStatus,
  CreatorPaymentProof,
  CreatorPlanSnapshot,
  CreatorRevisionKind,
} from "../types/creator-order";
import {
  createContentClusterKey,
  createDirectionDiversityPoolKey,
  createPlanSnapshot,
} from "./plan-history";
import {
  auditPlanQuality,
  CURRENT_PLAN_QUALITY_VERSION,
} from "./plan-quality";
import { auditRepeatNovelty } from "./plan-novelty";
import type { WeeklyContentPlan } from "../types/weekly-content-plan";
import type { PlanRequest } from "../types/plan-request";

const ORDER_KEY_PREFIX = "creator-os:order:";
const ORDER_INDEX_KEY = "creator-os:orders";
const PLAN_FINGERPRINT_KEY_PREFIX =
  "creator-os:plan-fingerprint:";
const CUSTOMER_ROUND_KEY_PREFIX =
  "creator-os:customer-round:";
const CUSTOMER_LAST_ORDER_KEY_PREFIX =
  "creator-os:customer-last-order:";
const CONTENT_VARIATION_KEY_PREFIX =
  "creator-os:content-variation:";

const MAX_PLAN_GENERATION_ATTEMPTS = 24;

type RespValue =
  | string
  | number
  | null
  | RespValue[];

type ParseResult = {
  value: RespValue;
  nextOffset: number;
};

class RedisResponseError extends Error {}

function getRedisUrl() {
  const url = process.env.REDIS_URL || process.env.KV_URL;

  if (!url) {
    throw new Error(
      "Missing REDIS_URL or KV_URL environment variable"
    );
  }

  return url;
}

function encodeCommand(parts: string[]) {
  const chunks = [`*${parts.length}\r\n`];

  for (const part of parts) {
    const byteLength = Buffer.byteLength(part, "utf8");
    chunks.push(`$${byteLength}\r\n${part}\r\n`);
  }

  return Buffer.from(chunks.join(""), "utf8");
}

function findLineEnd(buffer: Buffer, offset: number) {
  return buffer.indexOf("\r\n", offset, "utf8");
}

function parseResponse(
  buffer: Buffer,
  offset = 0
): ParseResult | null {
  if (offset >= buffer.length) return null;

  const prefix = String.fromCharCode(buffer[offset]);
  const lineEnd = findLineEnd(buffer, offset + 1);

  if (lineEnd < 0) return null;

  const line = buffer
    .subarray(offset + 1, lineEnd)
    .toString("utf8");

  if (prefix === "+") {
    return {
      value: line,
      nextOffset: lineEnd + 2,
    };
  }

  if (prefix === "-") {
    throw new RedisResponseError(line);
  }

  if (prefix === ":") {
    return {
      value: Number(line),
      nextOffset: lineEnd + 2,
    };
  }

  if (prefix === "$") {
    const length = Number(line);

    if (length === -1) {
      return {
        value: null,
        nextOffset: lineEnd + 2,
      };
    }

    const dataStart = lineEnd + 2;
    const dataEnd = dataStart + length;

    if (buffer.length < dataEnd + 2) return null;

    return {
      value: buffer
        .subarray(dataStart, dataEnd)
        .toString("utf8"),
      nextOffset: dataEnd + 2,
    };
  }

  if (prefix === "*") {
    const itemCount = Number(line);

    if (itemCount === -1) {
      return {
        value: null,
        nextOffset: lineEnd + 2,
      };
    }

    const values: RespValue[] = [];
    let nextOffset = lineEnd + 2;

    for (let index = 0; index < itemCount; index += 1) {
      const item = parseResponse(buffer, nextOffset);

      if (!item) return null;

      values.push(item.value);
      nextOffset = item.nextOffset;
    }

    return {
      value: values,
      nextOffset,
    };
  }

  throw new Error(`Unsupported Redis response: ${prefix}`);
}

class RedisConnection {
  private buffer = Buffer.alloc(0);
  private waiters: Array<() => void> = [];
  private socketError: Error | null = null;

  constructor(private socket: TLSSocket) {
    socket.on("data", (chunk: Buffer) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.notifyWaiters();
    });

    socket.on("error", (error: Error) => {
      this.socketError = error;
      this.notifyWaiters();
    });

    socket.on("close", () => {
      if (!this.socketError) {
        this.socketError = new Error(
          "Redis connection closed unexpectedly"
        );
      }

      this.notifyWaiters();
    });
  }

  private notifyWaiters() {
    const waiters = this.waiters.splice(0);
    waiters.forEach((resolve) => resolve());
  }

  private async waitForData() {
    if (this.socketError) throw this.socketError;

    await new Promise<void>((resolve) => {
      this.waiters.push(resolve);
    });

    if (this.socketError) throw this.socketError;
  }

  async command(parts: string[]): Promise<RespValue> {
    this.socket.write(encodeCommand(parts));

    while (true) {
      const parsed = parseResponse(this.buffer);

      if (parsed) {
        this.buffer = this.buffer.subarray(
          parsed.nextOffset
        );
        return parsed.value;
      }

      await this.waitForData();
    }
  }

  close() {
    this.socket.end();
  }
}

async function openRedisConnection() {
  const redisUrl = new URL(getRedisUrl());
  const host = redisUrl.hostname;
  const port = Number(redisUrl.port || 6379);
  const username = decodeURIComponent(
    redisUrl.username || "default"
  );
  const password = decodeURIComponent(redisUrl.password);

  if (!host || !password) {
    throw new Error("Invalid REDIS_URL or KV_URL");
  }

  const socket = connect({
    host,
    port,
    servername: host,
    rejectUnauthorized: true,
  });

  await Promise.race([
    once(socket, "secureConnect"),
    once(socket, "error").then(([error]) => {
      throw error;
    }),
  ]);

  const client = new RedisConnection(socket);
  await client.command(["AUTH", username, password]);

  return client;
}

async function withRedis<T>(
  operation: (client: RedisConnection) => Promise<T>
): Promise<T> {
  const client = await openRedisConnection();

  try {
    return await operation(client);
  } finally {
    client.close();
  }
}

function getOrderKey(orderId: string) {
  return `${ORDER_KEY_PREFIX}${orderId}`;
}


function getPlanFingerprintKey(fingerprint: string) {
  return `${PLAN_FINGERPRINT_KEY_PREFIX}${fingerprint}`;
}

function hashIdentity(value: string) {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

function getCustomerRoundKey(
  customerKey: string,
  contentClusterKey: string
) {
  return (
    `${CUSTOMER_ROUND_KEY_PREFIX}` +
    `${hashIdentity(customerKey)}:${contentClusterKey}`
  );
}

function getCustomerLastOrderKey(
  customerKey: string,
  contentClusterKey: string
) {
  return (
    `${CUSTOMER_LAST_ORDER_KEY_PREFIX}` +
    `${hashIdentity(customerKey)}:${contentClusterKey}`
  );
}

function getContentVariationKey(
  diversityPoolKey: string
) {
  return `${CONTENT_VARIATION_KEY_PREFIX}${diversityPoolKey}`;
}

function toSafeCounter(value: RespValue, fallback: number) {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return fallback;
}

async function countRegisteredFingerprints(
  client: RedisConnection,
  fingerprints: string[]
) {
  let count = 0;

  for (const fingerprint of fingerprints) {
    const exists = await client.command([
      "EXISTS",
      getPlanFingerprintKey(fingerprint),
    ]);

    if (toSafeCounter(exists, 0) > 0) {
      count += 1;
    }
  }

  return count;
}

async function registerPlanFingerprints(
  client: RedisConnection,
  order: CreatorOrder
) {
  const snapshot = order.planSnapshot;

  if (!snapshot) return;

  for (const fingerprint of snapshot.contentFingerprints) {
    await client.command([
      "SET",
      getPlanFingerprintKey(fingerprint),
      JSON.stringify({
        orderId: order.orderId,
        round: snapshot.round,
        variationIndex:
          snapshot.variationIndex || 0,
        customerProfileKey:
          snapshot.customerProfileKey,
        contentClusterKey:
          snapshot.contentClusterKey || "",
        createdAt: snapshot.createdAt,
      }),
      "NX",
    ]);
  }
}

type AttachPlanSnapshotOptions = {
  forceRegenerate?: boolean;
  preserveRound?: number;
  variationStart?: number;
  trackCustomerHistory?: boolean;
};

async function readOrderById(
  client: RedisConnection,
  orderId: string
) {
  return parseOrder(
    await client.command([
      "GET",
      getOrderKey(orderId.trim().toUpperCase()),
    ])
  );
}

async function collectPreviousPlans(
  client: RedisConnection,
  startOrder: CreatorOrder | null,
  limit = 12
): Promise<WeeklyContentPlan[]> {
  const plans: WeeklyContentPlan[] = [];
  const visited = new Set<string>();
  let current = startOrder;

  while (
    current &&
    plans.length < limit &&
    !visited.has(current.orderId)
  ) {
    visited.add(current.orderId);

    if (current.planSnapshot?.plan) {
      plans.push(current.planSnapshot.plan);
    }

    if (!current.previousOrderId) break;
    current = await readOrderById(
      client,
      current.previousOrderId
    );
  }

  return plans;
}

async function attachPlanSnapshot(
  client: RedisConnection,
  order: CreatorOrder,
  options: AttachPlanSnapshotOptions = {}
): Promise<CreatorOrder> {
  if (order.planSnapshot && !options.forceRegenerate) {
    return order;
  }

  const contentClusterKey =
    createContentClusterKey(order.request);
  const diversityPoolKey =
    createDirectionDiversityPoolKey(order.request);
  const customerKey = order.customerKey?.trim() || "";

  let round = Math.max(
    1,
    Math.floor(options.preserveRound || 1)
  );
  let previousOrder: CreatorOrder | null = null;

  if (!options.preserveRound && order.previousOrderId) {
    previousOrder = await readOrderById(
      client,
      order.previousOrderId
    );

    if (previousOrder?.status === "approved") {
      round = Math.max(
        2,
        (previousOrder.planSnapshot?.round || 1) + 1
      );
    }
  }

  if (
    !previousOrder &&
    customerKey &&
    !options.preserveRound
  ) {
    const lastOrderKey = getCustomerLastOrderKey(
      customerKey,
      contentClusterKey
    );
    const previousOrderId = await client.command([
      "GET",
      lastOrderKey,
    ]);

    if (typeof previousOrderId === "string") {
      const storedPreviousOrder = await readOrderById(
        client,
        previousOrderId
      );

      previousOrder =
        storedPreviousOrder?.status === "approved"
          ? storedPreviousOrder
          : null;
    }

    if (options.trackCustomerHistory === false) {
      round = Math.max(
        1,
        (previousOrder?.planSnapshot?.round || 0) + 1
      );
    } else {
      round = toSafeCounter(
        await client.command([
          "INCR",
          getCustomerRoundKey(
            customerKey,
            contentClusterKey
          ),
        ]),
        1
      );

      round = Math.max(
        round,
        (previousOrder?.planSnapshot?.round || 0) + 1
      );
    }
  }

  const previousPlans = await collectPreviousPlans(
    client,
    previousOrder
  );

  const variationCounter = Math.max(
    0,
    toSafeCounter(
      await client.command([
        "INCR",
        getContentVariationKey(diversityPoolKey),
      ]),
      1
    ) - 1
  );
  const orderSeed =
    Number.parseInt(
      hashIdentity(order.orderId).slice(0, 8),
      16
    ) % 1009;
  const globalVariationIndex =
    variationCounter * 17 + orderSeed;
  const variationBase = Math.max(
    globalVariationIndex,
    Math.max(
      0,
      Math.floor(options.variationStart || 0)
    )
  );

  let duplicateFingerprintsAvoided = 0;
  let qualityRejectedPlans = 0;
  let repeatNoveltyRejectedPlans = 0;
  let selectedSnapshot: CreatorPlanSnapshot | undefined;

  for (
    let attempt = 0;
    attempt < MAX_PLAN_GENERATION_ATTEMPTS;
    attempt += 1
  ) {
    const variationIndex = variationBase + attempt;
    const candidate = createPlanSnapshot(
      order.orderId,
      order.request,
      {
        round,
        variationIndex,
        uniquenessAttempt: attempt,
        duplicateFingerprintsAvoided,
        qualityRejectedPlans,
        regenerationAttempts: attempt,
      }
    );
    const duplicateCount =
      await countRegisteredFingerprints(
        client,
        candidate.contentFingerprints
      );
    const qualityPassed =
      candidate.qualityReport?.passed === true;
    const repeatNoveltyReport = auditRepeatNovelty(
      candidate.plan,
      previousPlans
    );

    if (duplicateCount > 0) {
      duplicateFingerprintsAvoided += duplicateCount;
    }

    if (!qualityPassed) {
      qualityRejectedPlans += 1;
    }

    if (!repeatNoveltyReport.passed) {
      repeatNoveltyRejectedPlans += 1;
    }

    const auditedCandidate: CreatorPlanSnapshot = {
      ...candidate,
      duplicateFingerprintsAvoided,
      qualityRejectedPlans,
      repeatNoveltyRejectedPlans,
      repeatNoveltyReport,
      qualityReport: candidate.qualityReport
        ? {
            ...candidate.qualityReport,
            regenerationAttempts: attempt,
          }
        : undefined,
    };

    if (
      duplicateCount === 0 &&
      qualityPassed &&
      repeatNoveltyReport.passed
    ) {
      selectedSnapshot = auditedCandidate;
      break;
    }
  }

  if (
    !selectedSnapshot ||
    !selectedSnapshot.qualityReport?.passed ||
    !selectedSnapshot.repeatNoveltyReport?.passed
  ) {
    throw new Error("PLAN_QUALITY_GATE_FAILED");
  }

  const updated: CreatorOrder = {
    ...order,
    previousOrderId:
      previousOrder?.orderId ||
      order.previousOrderId,
    rootOrderId:
      previousOrder?.rootOrderId ||
      previousOrder?.orderId ||
      order.rootOrderId ||
      order.orderId,
    planSnapshot: selectedSnapshot,
  };

  if (
    customerKey &&
    options.trackCustomerHistory !== false
  ) {
    await client.command([
      "SET",
      getCustomerLastOrderKey(
        customerKey,
        contentClusterKey
      ),
      order.orderId,
    ]);
  }

  return updated;
}

function parseOrder(value: RespValue) {
  if (typeof value !== "string") return null;

  try {
    return JSON.parse(value) as CreatorOrder;
  } catch {
    return null;
  }
}

export async function createOrder(
  order: CreatorOrder
): Promise<CreatorOrder> {
  return withRedis(async (client) => {
    const key = getOrderKey(order.orderId);
    const existing = parseOrder(
      await client.command(["GET", key])
    );

    if (existing) {
      if (existing.accessKey !== order.accessKey) {
        throw new Error("ORDER_ID_CONFLICT");
      }

      return existing;
    }

    const created = await client.command([
      "SET",
      key,
      JSON.stringify(order),
      "NX",
    ]);

    if (created !== "OK") {
      const concurrentOrder = parseOrder(
        await client.command(["GET", key])
      );

      if (
        concurrentOrder &&
        concurrentOrder.accessKey === order.accessKey
      ) {
        return concurrentOrder;
      }

      throw new Error("ORDER_ID_CONFLICT");
    }

    await client.command([
      "LPUSH",
      ORDER_INDEX_KEY,
      order.orderId,
    ]);
    await client.command([
      "LTRIM",
      ORDER_INDEX_KEY,
      "0",
      "499",
    ]);

    return order;
  });
}

export async function getOrder(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    return parseOrder(
      await client.command([
        "GET",
        getOrderKey(orderId),
      ])
    );
  });
}

export async function listOrders(
  limit = 100
): Promise<CreatorOrder[]> {
  return withRedis(async (client) => {
    const response = await client.command([
      "LRANGE",
      ORDER_INDEX_KEY,
      "0",
      String(Math.max(0, limit - 1)),
    ]);

    const ids = Array.isArray(response)
      ? response.filter(
          (value): value is string =>
            typeof value === "string"
        )
      : [];

    if (ids.length === 0) return [];

    const values = await client.command([
      "MGET",
      ...ids.map((id) => getOrderKey(id)),
    ]);

    if (!Array.isArray(values)) return [];

    return values
      .map((value) => parseOrder(value))
      .filter((order): order is CreatorOrder => Boolean(order));
  });
}

export async function submitPaymentProof(
  orderId: string,
  accessKey: string,
  proof: Omit<CreatorPaymentProof, "submittedAt" | "verifiedAt">
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;

    if (order.accessKey !== accessKey) {
      throw new Error("INVALID_ORDER_ACCESS");
    }

    if (
      order.status === "review-ready" ||
      order.status === "approved"
    ) {
      return order;
    }

    const updated: CreatorOrder = {
      ...order,
      status: "payment-submitted",
      paymentProof: {
        imageDataUrl: proof.imageDataUrl,
        originalFileName: proof.originalFileName,
        transferName: proof.transferName,
        submittedAt: new Date().toISOString(),
      },
    };

    await client.command([
      "SET",
      key,
      JSON.stringify(updated),
    ]);

    return updated;
  });
}


function appendRevisionText(
  current: string,
  addition: string
) {
  const next = addition.trim();
  if (!next) return current;
  if (!current.trim()) return next;
  return `${current.trim()}\n${next}`;
}

function getEasierDailyTime(
  current: PlanRequest["dailyTime"]
): PlanRequest["dailyTime"] {
  if (current === "90-plus") return "60-90";
  if (current === "60-90") return "30-45";
  return "10-20";
}

function buildRevisionRequest(
  request: PlanRequest,
  kind: CreatorRevisionKind,
  note: string
): PlanRequest {
  const revisionNote = note.trim();
  const next: PlanRequest = {
    ...request,
    supportNeeds: [...request.supportNeeds],
    capabilities: [...request.capabilities],
  };

  if (kind === "easier") {
    next.dailyTime = getEasierDailyTime(request.dailyTime);
    next.creatorChallenge = appendRevisionText(
      request.creatorChallenge,
      `Revision: ทำให้งานง่ายขึ้น ใช้ทรัพยากรน้อยลง และทำได้จริงภายในเวลาที่มี${
        revisionNote ? ` — ${revisionNote}` : ""
      }`
    );
  } else if (kind === "sales") {
    next.tone = "direct";
    next.creatorChallenge = appendRevisionText(
      request.creatorChallenge,
      `Revision: ทำให้ CTA และลำดับเนื้อหาพาคนดูไปสู่การกระทำหลักเดิมให้ชัดขึ้น โดยไม่เปลี่ยนเป้าหมายหลักของออเดอร์${
        revisionNote ? ` — ${revisionNote}` : ""
      }`
    );
  } else if (kind === "natural") {
    next.tone = "friendly";
    next.creatorChallenge = appendRevisionText(
      request.creatorChallenge,
      `Revision: ทำภาษาและจังหวะให้เป็นธรรมชาติ ลดความเป็นข้อความสำเร็จรูป${
        revisionNote ? ` — ${revisionNote}` : ""
      }`
    );
  } else if (kind === "constraints") {
    next.prohibitedClaims = appendRevisionText(
      request.prohibitedClaims,
      revisionNote ||
        "Revision: ต้องเคารพข้อจำกัดเดิมอย่างเคร่งครัด และตัดส่วนที่ทำจริงไม่ได้"
    );
  }

  // new-angle deliberately keeps factual inputs unchanged. The global
  // variation pool + fresh variation index produces a genuinely different
  // execution while preserving the customer's original facts.
  return next;
}

export async function verifyPaymentAndPrepareOrder(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;

    if (
      order.status === "review-ready" ||
      order.status === "approved"
    ) {
      return order;
    }

    if (
      order.status !== "payment-submitted" ||
      !order.paymentProof?.imageDataUrl
    ) {
      throw new Error("PAYMENT_PROOF_REQUIRED");
    }

    const verifiedAt = new Date().toISOString();
    const prepared = await attachPlanSnapshot(
      client,
      {
        ...order,
        status: "review-ready",
        reviewReadyAt: verifiedAt,
        paymentProof: {
          originalFileName:
            order.paymentProof.originalFileName,
          transferName: order.paymentProof.transferName,
          submittedAt: order.paymentProof.submittedAt,
          verifiedAt,
        },
      },
      { trackCustomerHistory: false }
    );

    await client.command([
      "SET",
      key,
      JSON.stringify(prepared),
    ]);
    await registerPlanFingerprints(client, prepared);

    return prepared;
  });
}

export async function regenerateReviewReadyOrder(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;
    if (order.status !== "review-ready") {
      throw new Error("ORDER_NOT_REVIEW_READY");
    }

    const currentVariation =
      order.planSnapshot?.variationIndex || 0;
    const regenerated = await attachPlanSnapshot(
      client,
      order,
      {
        forceRegenerate: true,
        preserveRound: order.planSnapshot?.round || 1,
        variationStart: currentVariation + 7,
        trackCustomerHistory: false,
      }
    );

    if (!regenerated.planSnapshot?.qualityReport?.passed) {
      throw new Error("PLAN_QUALITY_GATE_FAILED");
    }

    await client.command([
      "SET",
      key,
      JSON.stringify(regenerated),
    ]);
    await registerPlanFingerprints(client, regenerated);

    return regenerated;
  });
}

export async function deliverReviewedOrder(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;
    if (order.status === "approved") return order;

    if (order.status !== "review-ready") {
      throw new Error("ORDER_NOT_REVIEW_READY");
    }

    if (!order.planSnapshot?.qualityReport?.passed) {
      throw new Error("PLAN_QUALITY_GATE_FAILED");
    }

    const deliveredAt = new Date().toISOString();
    const delivered: CreatorOrder = {
      ...order,
      status: "approved",
      approvedAt: order.approvedAt || deliveredAt,
      deliveredAt,
    };

    await client.command([
      "SET",
      key,
      JSON.stringify(delivered),
    ]);

    const customerKey = delivered.customerKey?.trim() || "";
    const snapshot = delivered.planSnapshot;

    if (customerKey && snapshot) {
      const contentClusterKey =
        snapshot.contentClusterKey ||
        createContentClusterKey(delivered.request);

      await client.command([
        "SET",
        getCustomerLastOrderKey(
          customerKey,
          contentClusterKey
        ),
        delivered.orderId,
      ]);
      await client.command([
        "SET",
        getCustomerRoundKey(
          customerKey,
          contentClusterKey
        ),
        String(snapshot.round),
      ]);
    }

    return delivered;
  });
}

export async function submitRevisionRequest(
  orderId: string,
  accessKey: string,
  kind: CreatorRevisionKind,
  note: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;
    if (order.accessKey !== accessKey) {
      throw new Error("INVALID_ORDER_ACCESS");
    }
    if (order.status !== "approved") {
      throw new Error("ORDER_NOT_DELIVERED");
    }
    if (order.revisionUsedAt) {
      throw new Error("REVISION_ALREADY_USED");
    }
    if (
      order.revisionRequest &&
      order.revisionRequest.status !== "delivered"
    ) {
      throw new Error("REVISION_ALREADY_PENDING");
    }

    const requestedAt = new Date().toISOString();
    const updated: CreatorOrder = {
      ...order,
      revisionRequest: {
        kind,
        note: note.trim(),
        status: "requested",
        requestedAt,
      },
      pendingRevisionSnapshot: undefined,
      pendingRevisionRequest: undefined,
    };

    await client.command([
      "SET",
      key,
      JSON.stringify(updated),
    ]);

    return updated;
  });
}

export async function generateOrderRevision(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;
    if (order.status !== "approved") {
      throw new Error("ORDER_NOT_DELIVERED");
    }
    if (order.revisionUsedAt) {
      throw new Error("REVISION_ALREADY_USED");
    }
    if (!order.revisionRequest) {
      throw new Error("REVISION_NOT_REQUESTED");
    }

    const adjustedRequest = buildRevisionRequest(
      order.request,
      order.revisionRequest.kind,
      order.revisionRequest.note
    );
    const currentVariation = Math.max(
      order.planSnapshot?.variationIndex || 0,
      order.pendingRevisionSnapshot?.variationIndex || 0
    );
    const currentPlan = order.planSnapshot?.plan;
    let selectedRevision: CreatorPlanSnapshot | undefined;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const generated = await attachPlanSnapshot(
        client,
        {
          ...order,
          request: adjustedRequest,
        },
        {
          forceRegenerate: true,
          preserveRound: order.planSnapshot?.round || 1,
          variationStart:
            currentVariation + 7 + attempt * 5,
        }
      );

      const snapshot = generated.planSnapshot;
      if (!snapshot?.qualityReport?.passed) continue;

      const revisionNovelty = currentPlan
        ? auditRepeatNovelty(snapshot.plan, [currentPlan])
        : snapshot.repeatNoveltyReport;

      if (revisionNovelty && !revisionNovelty.passed) {
        continue;
      }

      selectedRevision = {
        ...snapshot,
        repeatNoveltyReport:
          revisionNovelty || snapshot.repeatNoveltyReport,
      };
      break;
    }

    if (!selectedRevision?.qualityReport?.passed) {
      throw new Error("PLAN_QUALITY_GATE_FAILED");
    }

    const generatedAt = new Date().toISOString();
    const updated: CreatorOrder = {
      ...order,
      revisionRequest: {
        ...order.revisionRequest,
        status: "generated",
        generatedAt,
      },
      pendingRevisionSnapshot: selectedRevision,
      pendingRevisionRequest: adjustedRequest,
    };

    await client.command([
      "SET",
      key,
      JSON.stringify(updated),
    ]);
    await registerPlanFingerprints(client, {
      ...updated,
      planSnapshot: selectedRevision,
    });

    return updated;
  });
}

export async function deliverOrderRevision(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;
    if (order.status !== "approved") {
      throw new Error("ORDER_NOT_DELIVERED");
    }
    if (order.revisionUsedAt) {
      throw new Error("REVISION_ALREADY_USED");
    }
    if (
      order.revisionRequest?.status !== "generated" ||
      !order.pendingRevisionSnapshot ||
      !order.pendingRevisionRequest
    ) {
      throw new Error("REVISION_NOT_READY");
    }

    const deliveredAt = new Date().toISOString();
    const updated: CreatorOrder = {
      ...order,
      request: order.pendingRevisionRequest,
      planSnapshot: order.pendingRevisionSnapshot,
      revisionUsedAt: deliveredAt,
      revisionRequest: {
        ...order.revisionRequest,
        status: "delivered",
        deliveredAt,
      },
      pendingRevisionSnapshot: undefined,
      pendingRevisionRequest: undefined,
    };

    await client.command([
      "SET",
      key,
      JSON.stringify(updated),
    ]);

    return updated;
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: CreatorOrderStatus
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;

    const approvedAt =
      status === "approved"
        ? order.approvedAt || new Date().toISOString()
        : undefined;

    const statusUpdated: CreatorOrder = {
      ...order,
      status,
      approvedAt,
      paymentProof:
        status === "approved" && order.paymentProof
          ? {
              originalFileName:
                order.paymentProof.originalFileName,
              transferName:
                order.paymentProof.transferName,
              submittedAt:
                order.paymentProof.submittedAt,
              verifiedAt: approvedAt,
            }
          : order.paymentProof,
    };

    const updated =
      status === "approved"
        ? await attachPlanSnapshot(
            client,
            statusUpdated
          )
        : statusUpdated;

    await client.command([
      "SET",
      key,
      JSON.stringify(updated),
    ]);

    if (status === "approved") {
      await registerPlanFingerprints(client, updated);
    }

    return updated;
  });
}

export async function ensureOrderPlan(
  orderId: string
): Promise<CreatorOrder | null> {
  return withRedis(async (client) => {
    const key = getOrderKey(orderId);
    const order = parseOrder(
      await client.command(["GET", key])
    );

    if (!order) return null;

    if (order.status !== "approved") {
      return order;
    }

    if (order.planSnapshot) {
      const storedReport =
        order.planSnapshot.qualityReport;

      if (
        storedReport?.version ===
          CURRENT_PLAN_QUALITY_VERSION &&
        storedReport.passed
      ) {
        return order;
      }

      const auditedReport = auditPlanQuality(
        order.planSnapshot.plan,
        order.request,
        {
          regenerationAttempts:
            storedReport?.regenerationAttempts || 0,
        }
      );

      if (auditedReport.passed) {
        const auditedOrder: CreatorOrder = {
          ...order,
          planSnapshot: {
            ...order.planSnapshot,
            qualityReport: auditedReport,
          },
        };

        await client.command([
          "SET",
          key,
          JSON.stringify(auditedOrder),
        ]);
        await registerPlanFingerprints(
          client,
          auditedOrder
        );

        return auditedOrder;
      }

      const repairedOrder =
        await attachPlanSnapshot(client, order, {
          forceRegenerate: true,
          preserveRound:
            order.planSnapshot.round,
          variationStart:
            (order.planSnapshot.variationIndex || 0) + 1,
        });

      await client.command([
        "SET",
        key,
        JSON.stringify(repairedOrder),
      ]);
      await registerPlanFingerprints(
        client,
        repairedOrder
      );

      return repairedOrder;
    }

    const updated = await attachPlanSnapshot(
      client,
      order
    );

    await client.command([
      "SET",
      key,
      JSON.stringify(updated),
    ]);

    await registerPlanFingerprints(client, updated);

    return updated;
  });
}

