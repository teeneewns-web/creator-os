import { createHmac, timingSafeEqual } from 'crypto'

const LEMONSQUEEZY_CHECKOUT_URL =
  'https://creator-os-o.lemonsqueezy.com/checkout/buy/8712615a-134d-43e1-9af5-9572c671c865'

export function buildCheckoutUrl(orderId: string): string {
  const params = new URLSearchParams()
  params.set('checkout[custom][order_id]', orderId)
  
  // 🆕 บังคับสีพื้นหลังและปุ่มให้เป็น Light Mode ชัดเจน
  params.set('checkout[background_color]', '#FAF7F2') // สีพื้นหลังครีม
  params.set('checkout[button_color]', '#D97757')     // สีปุ่มส้ม
  params.set('checkout[button_text_color]', '#FFFFFF')
  params.set('checkout[text_color]', '#1A1614')
  
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