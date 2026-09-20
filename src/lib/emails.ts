import { Resend } from 'resend'
import type { Order } from '@/types/order'
import type { Plan } from '@/types/plan'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Creator OS <onboarding@resend.dev>'

export async function sendPlanEmail(
  order: Order,
  plan: Plan
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing, skipping email')
    return
  }

  const html = buildEmailHtml(order, plan)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your 7-day plan is ready`,
      html,
      text: buildEmailText(order, plan, appUrl),
    })
  } catch (error) {
    console.error('Email send failed:', error)
    // ไม่ throw — เพราะ email failure ไม่ควรทำให้ order failed
  }
}

function buildEmailText(
  order: Order,
  plan: Plan,
  appUrl: string
): string {
  const lines = [
    `Your 7-day plan is ready`,
    ``,
    `${plan.title}`,
    `${plan.summary}`,
    ``,
    `View the full plan: ${appUrl}/order/${order.id}`,
    ``,
    `—`,
    `Creator OS`,
  ]
  return lines.join('\n')
}

function buildEmailHtml(order: Order, plan: Plan): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const orderUrl = `${appUrl}/order/${order.id}`

  const daysHtml = plan.days
    .map(
      (d) => `
    <tr>
      <td style="padding: 24px 0; border-bottom: 1px solid #E8E1D6;">
        <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #D97757; margin-bottom: 8px;">
          Day ${String(d.day).padStart(2, '0')}
        </div>
        <div style="font-family: Georgia, serif; font-size: 20px; line-height: 1.3; color: #1A1614; margin-bottom: 12px;">
          ${escapeHtml(d.hook)}
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #3F3A35; white-space: pre-wrap;">
          ${escapeHtml(d.script)}
        </div>
      </td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your 7-day plan is ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF7F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E8E1D6; border-radius: 16px;">
          <tr>
            <td style="padding: 40px 40px 32px;">
              <div style="display: inline-block; padding: 4px 10px; border: 1px solid #E8E1D6; border-radius: 20px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #D97757; margin-bottom: 24px;">
                Plan ready
              </div>

              <h1 style="font-family: Georgia, serif; font-size: 28px; line-height: 1.2; color: #1A1614; margin: 0 0 12px; font-weight: 400;">
                ${escapeHtml(plan.title)}
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #6B6259; margin: 0 0 32px;">
                ${escapeHtml(plan.summary)}
              </p>

              <a href="${orderUrl}" style="display: inline-block; background-color: #1A1614; color: #FFFFFF; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-size: 14px; font-weight: 500;">
                Open my plan →
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${daysHtml}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 40px 40px;">
              <p style="font-size: 12px; color: #A39B8F; margin: 0;">
                Order ${order.id}
              </p>
            </td>
          </tr>
        </table>

        <p style="font-size: 11px; color: #A39B8F; margin: 24px 0 0;">
          © ${new Date().getFullYear()} Creator OS
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}