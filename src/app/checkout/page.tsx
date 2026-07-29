import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import CheckoutClient from "./CheckoutClient";

const PACKAGE_PRICE = 149;
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
      packagePrice={PACKAGE_PRICE}
      qrDataUrl={qrDataUrl}
      accountName={ACCOUNT_NAME}
      bankName={BANK_NAME}
    />
  );
}