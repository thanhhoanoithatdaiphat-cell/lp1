import { NextResponse } from 'next/server'

// Đơn giản chống spam: giới hạn số lượt gửi theo IP trong bộ nhớ tiến trình.
// Với traffic lớn hơn nên thay bằng Redis/Upstash hoặc dịch vụ chống spam riêng.
const submissions = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000 // 10 phút
const MAX_PER_WINDOW = 5

function isRateLimited(ip: string) {
  const now = Date.now()
  const timestamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  timestamps.push(now)
  submissions.set(ip, timestamps)
  return timestamps.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, error: 'too_many_requests' }, { status: 429 })
    }

    const body = await request.json()
    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').trim()
    const area = String(body.area || '').trim()
    const size = String(body.size || '').trim()
    const need = String(body.need || '').trim()

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
    }
    // Số điện thoại VN: 9-11 số, có thể có +84 ở đầu
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 9 || phoneDigits.length > 11) {
      return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
    }

    const lead = { name, phone, area, size, need, ip, receivedAt: new Date().toISOString() }

    // TODO: Cắm nơi nhận lead thật ở đây, ví dụ:
    // 1) Gửi email qua Resend/SendGrid tới hộp thư kinh doanh
    // 2) Đẩy sang Google Sheet qua Apps Script webhook
    // 3) Gửi tin nhắn vào nhóm Zalo OA / Telegram qua webhook nội bộ
    // Hiện tại chỉ log lại để không mất dữ liệu trong lúc chưa cấu hình kênh nhận.
    console.log('[lead:new]', lead)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead:error]', err)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
