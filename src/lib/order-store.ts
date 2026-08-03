import "server-only";

import { createHash } from "node:crypto";
import { once } from "events";
import { connect, type TLSSocket } from "tls";

import type {
  CreatorOrder,
  CreatorOrderStatus,
  CreatorPlanSnapshot,
} from "../types/creator-order";
import {
  createContentClusterKey,
  createPlanSnapshot,
} from "./plan-history";
import {
  auditPlanQuality,
  CURRENT_PLAN_QUALITY_VERSION,
} from "./plan-quality";

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
  contentClusterKey: string
) {
  return `${CONTENT_VARIATION_KEY_PREFIX}${contentClusterKey}`;
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
};

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
  const customerKey = order.customerKey?.trim() || "";

  let round = Math.max(
    1,
    Math.floor(options.preserveRound || 1)
  );
  let previousOrder: CreatorOrder | null = null;

  if (customerKey && !options.preserveRound) {
    const lastOrderKey = getCustomerLastOrderKey(
      customerKey,
      contentClusterKey
    );
    const previousOrderId = await client.command([
      "GET",
      lastOrderKey,
    ]);

    if (typeof previousOrderId === "string") {
      previousOrder = parseOrder(
        await client.command([
          "GET",
          getOrderKey(previousOrderId),
        ])
      );
    }

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

  const variationCounter = Math.max(
    0,
    toSafeCounter(
      await client.command([
        "INCR",
        getContentVariationKey(contentClusterKey),
      ]),
      1
    ) - 1
  );
  const variationBase = Math.max(
    variationCounter,
    Math.max(
      0,
      Math.floor(options.variationStart || 0)
    )
  );

  let duplicateFingerprintsAvoided = 0;
  let qualityRejectedPlans = 0;
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

    if (duplicateCount > 0) {
      duplicateFingerprintsAvoided += duplicateCount;
    }

    if (!qualityPassed) {
      qualityRejectedPlans += 1;
    }

    const auditedCandidate = {
      ...candidate,
      duplicateFingerprintsAvoided,
      qualityRejectedPlans,
      qualityReport: candidate.qualityReport
        ? {
            ...candidate.qualityReport,
            regenerationAttempts: attempt,
          }
        : undefined,
    };

    if (duplicateCount === 0 && qualityPassed) {
      selectedSnapshot = auditedCandidate;
      break;
    }
  }

  if (
    !selectedSnapshot ||
    !selectedSnapshot.qualityReport?.passed
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

  if (customerKey) {
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

    const statusUpdated: CreatorOrder = {
      ...order,
      status,
      approvedAt:
        status === "approved"
          ? order.approvedAt || new Date().toISOString()
          : undefined,
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

