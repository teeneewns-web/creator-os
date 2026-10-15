import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
})

export type ReportType =
  | 'plan_wrong'
  | 'email_missing'
  | 'payment_issue'
  | 'quality_issue'
  | 'other'

export type Report = {
  id: string
  order_id: string
  email: string
  type: ReportType
  message: string
  created_at: string
}

function generateReportId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'RPT-'
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

const REPORT_KEY = (id: string) => `creator-os:report:${id}`
const REPORT_INDEX = 'creator-os:reports'

export async function createReport(data: {
  order_id: string
  email: string
  type: ReportType
  message: string
}): Promise<Report> {
  const id = generateReportId()
  const report: Report = {
    id,
    ...data,
    created_at: new Date().toISOString(),
  }

  await redis.set(REPORT_KEY(id), JSON.stringify(report))
  await redis.lpush(REPORT_INDEX, id)
  await redis.ltrim(REPORT_INDEX, 0, 999)

  return report
}

export async function getReport(id: string): Promise<Report | null> {
  const raw = await redis.get(REPORT_KEY(id))
  if (!raw) return null
  return JSON.parse(raw) as Report
}