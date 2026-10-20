import { Resend } from 'resend'
import type { Order } from '@/types/order'
import type { Plan } from '@/types/plan'

const FROM = 'Creator OS <onboarding@resend.dev>'

function cleanTag(tag: string): string {
  return tag.replace(/^#+/, '').trim()
}

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
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://creator-os-beta-navy.vercel.app'
  const html = buildEmailHtml(order, plan, appUrl)
  const text = buildEmailText(order, plan, appUrl)

  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your 7-day plan is ready: ${plan.title}`,
      html,
      text,
    })
  } catch (error) {
    console.error('Email send failed:', error)
  }
}

function buildEmailText(order: Order, plan: Plan, appUrl: string): string {
  const daysText = plan.days
    .map((d) => {
      const tags = d.hashtags.map((h) => `#${cleanTag(h)}`).join(' ')
      return [
        `====================================`,
        `DAY ${String(d.day).padStart(2, '0')} - ${d.type || ''}`,
        `====================================`,
        `HOOK:`,
        d.hook,
        ``,
        `SCRIPT:`,
        d.script,
        ``,
        `CAPTION:`,
        d.caption,
        ``,
        `HASHTAGS: ${tags}`,
        ``,
        `VISUAL:`,
        d.visual,
        ``,
        `POST AT: ${d.posting_time}`,
        d.posting_tip ? `\nFILMING TIP:\n${d.posting_tip}` : '',
        d.sound_suggestion ? `\nSOUND:\n${d.sound_suggestion}` : '',
        d.text_overlay ? `\nTEXT OVERLAY: "${d.text_overlay}"` : '',
        ``,
      ].join('\n')
    })
    .join('')

  return [
    `Your 7-day plan is ready`,
    ``,
    plan.title,
    plan.summary,
    ``,
    `View the full plan and track progress on the web: ${appUrl}/order/${order.id}`,
    ``,
    daysText,
    `------------------------------------`,
    `Need help? Reply to this email - we answer within 24 hours.`,
    `Creator OS`,
  ].join('\n')
}

function buildEmailHtml(order: Order, plan: Plan, appUrl: string): string {
  const orderUrl = `${appUrl}/order/${order.id}`

  const daysHtml = plan.days
    .map((d) => {
      const tagsHtml = d.hashtags
        .map(
          (h) =>
            `<span style="display:inline-block; background:#FAF7F2; border:1px solid #E8E1D6; color:#6B6259; padding:4px 10px; border-radius:12px; font-family:monospace; font-size:12px; margin:0 4px 4px 0;">#${cleanTag(h)}</span>`
        )
        .join('')

      const tipsHtml = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px; background:#FBF0E9/40; border-radius:10px; padding:16px;">
          <tr>
            <td style="padding: 10px;">
              <div style="font-size:11px; text-transform:uppercase; color:#D97757; font-weight:600; margin-bottom:12px; letter-spacing:0.05em;">Execution Tips</div>
              <div style="margin-bottom:10px;">
                <strong style="font-size:12px; color:#1A1614;">Filming:</strong>
                <span style="font-size:13px; color:#3F3A35;">${escapeHtml(d.posting_tip || 'N/A')}</span>
              </div>
              <div style="margin-bottom:10px;">
                <strong style="font-size:12px; color:#1A1614;">Sound:</strong>
                <span style="font-size:13px; color:#3F3A35;">${escapeHtml(d.sound_suggestion || 'N/A')}</span>
              </div>
              <div>
                <strong style="font-size:12px; color:#1A1614;">Text Overlay:</strong>
                <span style="font-size:13px; color:#3F3A35;">&ldquo;${escapeHtml(d.text_overlay || 'N/A')}&rdquo;</span>
              </div>
            </td>
          </tr>
        </table>
      `

      return `
        <tr>
          <td style="padding: 40px 0; border-bottom: 1px solid #E8E1D6;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:20px;">
              <div style="display:inline-block; padding: 4px 10px; background:#FBF0E9; border:1px solid #E8E1D6; border-radius:20px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#D97757; font-weight:600;">
                Day ${String(d.day).padStart(2, '0')}
              </div>
              <div style="display:inline-block; font-size:13px; color:#A39B8F;">
                ${escapeHtml(d.type || '')}
              </div>
            </div>

            <div style="font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#A39B8F; margin-bottom:8px;">Hook</div>
            <div style="font-family: Georgia, serif; font-size: 20px; line-height: 1.4; color: #1A1614; margin-bottom: 24px;">
              ${escapeHtml(d.hook)}
            </div>

            <div style="font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#A39B8F; margin-bottom:8px;">Script</div>
            <div style="font-size: 14px; line-height: 1.7; color: #3F3A35; white-space: pre-wrap; margin-bottom: 24px;">
              ${escapeHtml(d.script)}
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:16px;">
              <tr>
                <td width="50%" style="padding-right:8px; vertical-align:top;">
                  <div style="background:#FAF7F2; border:1px solid #E8E1D6; border-radius:10px; padding:12px;">
                    <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:#A39B8F; margin-bottom:4px;">Caption</div>
                    <div style="font-size:13px; color:#3F3A35; line-height:1.5;">${escapeHtml(d.caption)}</div>
                  </div>
                </td>
                <td width="50%" style="padding-left:8px; vertical-align:top;">
                  <div style="background:#FAF7F2; border:1px solid #E8E1D6; border-radius:10px; padding:12px;">
                    <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:#A39B8F; margin-bottom:4px;">Post at</div>
                    <div style="font-size:13px; color:#3F3A35; line-height:1.5;">${escapeHtml(d.posting_time)}</div>
                  </div>
                </td>
              </tr>
            </table>

            <div style="background:#FAF7F2; border:1px solid #E8E1D6; border-radius:10px; padding:12px; margin-bottom:16px;">
              <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:#A39B8F; margin-bottom:4px;">Visual Direction</div>
              <div style="font-size:13px; color:#3F3A35; line-height:1.5;">${escapeHtml(d.visual)}</div>
            </div>

            <div>
              <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:#A39B8F; margin-bottom:8px;">Hashtags</div>
              <div>${tagsHtml}</div>
            </div>

            ${tipsHtml}
          </td>
        </tr>
      `
    })
    .join('')

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
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background:#FFFFFF; border:1px solid #E8E1D6; border-radius:16px;">
          <tr>
            <td style="padding: 40px 40px 32px;">
              <div style="display:inline-block; padding:4px 10px; border:1px solid #E8E1D6; border-radius:20px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#D97757; margin-bottom:20px; font-weight:600;">
                Plan ready
              </div>

              <h1 style="font-family: Georgia, serif; font-size: 28px; line-height: 1.3; color: #1A1614; margin: 0 0 12px; font-weight: 400;">
                ${escapeHtml(plan.title)}
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #6B6259; margin: 0 0 28px;">
                ${escapeHtml(plan.summary)}
              </p>

              <a href="${orderUrl}" style="display:inline-block; background:#D97757; color:#FFFFFF; text-decoration:none; padding:14px 24px; border-radius:10px; font-size:14px; font-weight:600;">
                View plan & track progress &rarr;
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
              <p style="font-size:12px; color:#A39B8F; margin:0 0 8px;">
                Order ${order.id}
              </p>
              <p style="font-size:12px; color:#A39B8F; margin:0; line-height:1.6;">
                Need help? Reply to this email &mdash; we answer within 24 hours (Mon&ndash;Fri).
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}