import { createHmac, timingSafeEqual } from 'crypto'

const LEMONSQUEEZY_CHECKOUT_URL =
  'https://creator-os-o.lemonsqueezy.com/checkout/buy/8712615a-134d-43e1-9af5-9572c671c865'

export function buildCheckoutUrl(orderId: string): string {
  const params = new URLSearchParams()
  params.set('checkout[custom][order_id]', orderId)
  return `${LEMONSQUEEZY_CHECKOUT_URL}?${params.toString()}`
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = createHmac('sha256', secret)
    hmac.update(rawBody, 'utf8')
    const digest = hmac.digest('hex')
    const digestBuffer = Buffer.from(digest, 'hex')
    const signatureBuffer = Buffer.from(signature, 'hex')
    if (digestBuffer.length !== signatureBuffer.length) return false
    return timingSafeEqual(digestBuffer, signatureBuffer)
  } catch {
    return false
  }
}