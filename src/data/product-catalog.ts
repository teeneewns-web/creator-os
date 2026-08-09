export type CreatorProductId = "weekly-plan";

export type CreatorProductKind = "weekly-plan";
export type CreatorProductFlowId = "weekly-v1";

export type CreatorProductDefinition = {
  id: CreatorProductId;
  kind: CreatorProductKind;
  flowId: CreatorProductFlowId;
  startHref: string;
  checkoutHref: string;
  name: string;
  shortName: string;
  amount: number;
  active: boolean;
};

export const DEFAULT_CREATOR_PRODUCT_ID: CreatorProductId =
  "weekly-plan";

export const CREATOR_PRODUCT_CATALOG: Record<
  CreatorProductId,
  CreatorProductDefinition
> = {
  "weekly-plan": {
    id: "weekly-plan",
    kind: "weekly-plan",
    flowId: "weekly-v1",
    startHref: "/start",
    checkoutHref: "/checkout",
    name: "Creator OS — แผนคอนเทนต์ 7 วัน",
    shortName: "แผน 7 วัน",
    amount: 149,
    active: true,
  },
};

// Product isolation rule:
// Existing flowId values are immutable after launch. A future one-off product
// should receive its own product id + flow module/routes instead of branching
// inside the weekly-v1 generator. This keeps launched products stable.
export function getCreatorProduct(
  productId: string | null | undefined
): CreatorProductDefinition | null {
  if (!productId) {
    return CREATOR_PRODUCT_CATALOG[
      DEFAULT_CREATOR_PRODUCT_ID
    ];
  }

  return (
    CREATOR_PRODUCT_CATALOG[
      productId as CreatorProductId
    ] || null
  );
}
