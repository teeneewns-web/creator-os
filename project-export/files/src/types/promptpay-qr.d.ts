declare module "promptpay-qr" {
  type PromptPayOptions = {
    amount?: number;
  };

  export default function generatePayload(
    target: string,
    options?: PromptPayOptions
  ): string;
}