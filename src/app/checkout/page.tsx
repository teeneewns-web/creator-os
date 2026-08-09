import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import CheckoutClient from "./CheckoutClient";
import {
  CREATOR_PRODUCT_CATALOG,
  DEFAULT_CREATOR_PRODUCT_ID,
} from "../../data/product-catalog";

const PRODUCT =
  CREATOR_PRODUCT_CATALOG[DEFAULT_CREATOR_PRODUCT_ID];
const PACKAGE_PRICE = PRODUCT.amount;
const ACCOUNT_NAME = "SAI YAR LEIN";
const BANK_NAME = "ธนาคารกสิกรไทย";

async function createPromptPayQr() {
  const promptPayId =
    process.env.PROMPTPAY_ID?.trim();

  if (!promptPayId) {
    return null;
  }

  const payload = generatePayload(promptPayId, {
    amount: PACKAGE_PRICE,
  });

  return QRCode.toDataURL(payload, {
    width: 420,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export default async function CheckoutPage() {
  const qrDataUrl = await createPromptPayQr();

  return (
    <CheckoutClient
      productId={PRODUCT.id}
      packagePrice={PACKAGE_PRICE}
      qrDataUrl={qrDataUrl}
      accountName={ACCOUNT_NAME}
      bankName={BANK_NAME}
    />
  );
}