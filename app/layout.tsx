import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const geistSans = Geist({ subsets: ['latin', 'vietnamese'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin', 'vietnamese'], variable: '--font-geist-mono' })

const SITE_URL = 'https://noithatdaiphat.vn'
const TITLE = 'Nội thất Văn phòng & Trường học Thanh Hóa | Đại Phát'
const DESCRIPTION = 'Đại Phát thiết kế và thi công nội thất văn phòng, trường học tại Thanh Hóa. Vật liệu chuẩn E1, hỗ trợ hồ sơ đấu thầu, thi công ngoài giờ / dịp hè, xưởng sản xuất riêng 3.000 m².'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: 'Nội thất Đại Phát',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/images/xuong-thuc-te/xuong-co-khi.png', width: 1200, height: 630, alt: 'Nội thất Đại Phát' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/xuong-thuc-te/xuong-co-khi.png'],
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f7f3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className="bg-background"><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
