import { Resend } from 'resend'
import type { Order } from '@/types/order'
import type { Plan } from '@/types/plan'

const FROM = 'Creator OS <onboarding@resend.dev>'

export async function sendPlanEmail(
  order: Order,
  plan: Plan
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY missing, skipping email')
    return
  }

  const resend = new Resend(apiKey)
  // ใช้โดเมนใหม่เป็นค่าเริ่มต้น
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://getcreatoros.net'
  const html = buildEmailHtml(order, plan, appUrl)
  const text = buildEmailText(order, plan, appUrl)

  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your 7-Day Plan is Ready 🚀`,
      html,
      text,
    })
  } catch (error) {
    console.error('Email send failed:', error)
  }
}

function buildEmailText(order: Order, plan: Plan, appUrl: string): string {
  const orderUrl = `${appUrl}/order/${order.id}`
  return [
    `Thank you for your purchase!`,
    ``,
    `Your personalized 7-day content plan for "${order.quiz.niche}" is ready.`,
    ``,
    `We've prepared 7 unique hooks, scripts, and actionable filming tips tailored to your constraints.`,
    ``,
    `View your full plan and copy your scripts here:`,
    orderUrl,
    ``,
    `Tip: You can use the "Mark done" button on the web page to track your progress through the week.`,
    ``,
    `Need help? Reply to this email and we'll get back to you within 24 hours.`,
    ``,
    `- The Creator OS Team`,
    `Order ID: ${order.id}`,
  ].join('\n')
}

function buildEmailHtml(order: Order, plan: Plan, appUrl: string): string {
  const orderUrl = `${appUrl}/order/${order.id}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your 7-day plan is ready</title>
</head>
<body style="margin:0; padding:0; background:#FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#FAF7F2;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 500px; background:#FFFFFF; border:1px solid #E8E1D6; border-radius:16px; overflow:hidden;">
          
          <!-- Top accent bar -->
          <tr>
            <td style="height: 4px; background: #D97757;"></td>
          </tr>

          <tr>
            <td style="padding: 40px 40px 32px;">
              <div style="margin-bottom: 24px;">
                <div style="display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; background:#1A1614; border-radius:8px; color:#FAF7F2; font-weight:bold; font-size:16px;">C</div>
              </div>

              <h1 style="font-family: Georgia, serif; font-size: 26px; line-height: 1.3; color: #1A1614; margin: 0 0 16px; font-weight: 400;">
                Thank you for your purchase!
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #6B6259; margin: 0 0 12px;">
                Your personalized 7-day content plan for <strong style="color:#1A1614;">"${order.quiz.niche}"</strong> is ready.
              </p>
              
              <p style="font-size: 15px; line-height: 1.6; color: #6B6259; margin: 0 0 28px;">
                We've prepared 7 unique hooks, scripts, captions, and actionable filming tips tailored to your constraints.
              </p>

              <!-- Big CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${orderUrl}" style="display:inline-block; width:100%; box-sizing:border-box; background:#D97757; color:#FFFFFF; text-decoration:none; padding:16px 24px; border-radius:12px; font-size:16px; font-weight:600; text-align:center; box-shadow: 0 4px 12px rgba(217,119,87,0.25);">
                      View Your Plan & Copy Scripts &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding: 16px; background: #FBF0E9; border-radius: 12px; border: 1px solid #E8E1D6;">
                <p style="font-size: 13px; line-height: 1.5; color: #6B6259; margin: 0;">
                  <strong style="color:#1A1614;">💡 Pro Tip:</strong> Use the "Mark done" button on the web page to track your progress as you film each video.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: #FAF7F2; border-top: 1px solid #E8E1D6;">
              <p style="font-size:12px; color:#A39B8F; margin:0 0 8px; text-align:center;">
                Need help? Reply to this email and we'll get back to you within 24 hours.
              </p>
              <p style="font-size:11px; color:#A39B8F; margin:0; text-align:center; font-family: monospace;">
                Order ${order.id}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}