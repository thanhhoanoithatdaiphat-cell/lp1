'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { track } from '@vercel/analytics'
import { ArrowDown, ArrowRight, Award, Badge, Check, ChevronDown, Clock3, Factory, FileCheck2, Menu, Paintbrush, Phone, ShieldCheck, Sparkles, Wrench, X } from 'lucide-react'

// ===== Dữ liệu thật lấy từ noithatdaiphat.vn/dich-vu/noi-that-van-phong, /noi-that-truong-hoc, /cong-trinh, /thu-vien =====

const officeReasons = [
  { icon: Paintbrush, title: 'Đồng Bộ Thương Hiệu', desc: 'Thiết kế theo bộ nhận diện thương hiệu — từ màu sắc đến vật liệu, nhất quán hoàn toàn.' },
  { icon: Clock3, title: 'Thi Công Ngoài Giờ Hành Chính', desc: 'Có thể thi công buổi tối hoặc cuối tuần để không ảnh hưởng hoạt động kinh doanh.' },
  { icon: Factory, title: 'Xưởng Riêng 3.000m²', desc: 'Sản xuất hàng loạt đồng đều — phù hợp văn phòng nhiều phòng ban cần nội thất đồng bộ.' },
  { icon: Sparkles, title: 'Giá Tận Xưởng', desc: 'Không qua trung gian. Ngân sách doanh nghiệp được tối ưu mà chất lượng không đổi.' },
  { icon: FileCheck2, title: 'Hỗ Trợ Hồ Sơ Đấu Thầu', desc: 'Có kinh nghiệm cung cấp hồ sơ năng lực, báo giá theo yêu cầu đấu thầu của doanh nghiệp.' },
  { icon: Wrench, title: 'Bảo Trì Dài Hạn', desc: 'Hợp đồng bảo trì định kỳ — văn phòng luôn trong tình trạng tốt nhất, không cần lo lắng.' },
]

const schoolReasons = [
  { icon: ShieldCheck, title: 'Vật Liệu An Toàn Chuẩn E1', desc: 'Không formaldehyde, không chất độc hại. An toàn cho trẻ em. Cung cấp chứng nhận đi kèm.' },
  { icon: Award, title: 'Bền Bỉ Với Cường Độ Cao', desc: 'Chịu va đập, chịu tải sử dụng liên tục của hàng trăm học sinh mỗi ngày.' },
  { icon: Factory, title: 'Sản Xuất Hàng Loạt Đồng Đều', desc: 'Xưởng 3.000m² đảm bảo 500 bộ bàn ghế cùng lô có chất lượng hoàn toàn đồng đều.' },
  { icon: Clock3, title: 'Thi Công Trong Dịp Hè', desc: 'Hoàn thiện toàn bộ trong 2 tháng hè. Khai giảng đúng ngày với không gian hoàn toàn mới.' },
  { icon: FileCheck2, title: 'Hỗ Trợ Hồ Sơ Đấu Thầu', desc: 'Kinh nghiệm cung cấp hồ sơ năng lực, báo giá theo yêu cầu đấu thầu công trình giáo dục.' },
  { icon: Sparkles, title: 'Giá Tận Xưởng', desc: 'Ngân sách giáo dục được tối ưu tối đa. Không qua trung gian — chất lượng đỉnh, chi phí hợp lý.' },
]

const officePricing = [
  { tier: 'Tiêu chuẩn', price: '2–4 triệu/m²', desc: 'Nội thất công năng cao, vật liệu bền bỉ phù hợp môi trường văn phòng. Thi công nhanh.', popular: false },
  { tier: 'Chuyên nghiệp', price: '4–7 triệu/m²', desc: 'Thiết kế đồng bộ thương hiệu, vật liệu cao cấp hơn, hệ thống chiếu sáng chuyên nghiệp.', popular: true },
  { tier: 'Premium', price: '7–12 triệu/m²', desc: 'Vật liệu nhập khẩu, thiết kế hoàn toàn độc bản, phù hợp văn phòng đại diện cao cấp.', popular: false },
]

const schoolPricing = [
  { tier: 'Tiêu chuẩn', price: '1,5–3 triệu/m²', desc: 'Vật liệu đạt chuẩn E1, bền bỉ, phù hợp ngân sách giáo dục công lập.', popular: false },
  { tier: 'Nâng cao', price: '3–5 triệu/m²', desc: 'Vật liệu cao cấp hơn, thiết kế đẹp mắt hơn, tăng trải nghiệm học tập.', popular: true },
  { tier: 'Quốc tế', price: '5–8 triệu/m²', desc: 'Chuẩn trường quốc tế, vật liệu nhập khẩu, thiết kế theo xu hướng giáo dục tiên tiến.', popular: false },
]

const officeFaqs = [
  ['Thi công văn phòng có làm ngoài giờ được không?', 'Có. Đại Phát có đội thi công ca tối và cuối tuần. Chi phí phụ trội sẽ được báo giá rõ ràng trước khi ký hợp đồng.'],
  ['Đại Phát có kinh nghiệm với văn phòng lớn không?', 'Có. Dự án văn phòng lớn nhất của Đại Phát là 450 m² tại Bỉm Sơn. Với văn phòng lớn, đội ngũ phân công project manager riêng và báo cáo tiến độ hàng tuần.'],
  ['Có thể thiết kế theo nhận diện thương hiệu của công ty không?', 'Đây là điểm mạnh của Đại Phát với văn phòng. Cần bộ brand guideline của bạn để tích hợp hoàn toàn vào thiết kế nội thất.'],
  ['Bảo hành và bảo trì văn phòng như thế nào?', 'Bảo hành 2 năm cho toàn bộ hạng mục. Có gói bảo trì định kỳ theo quý hoặc năm — phù hợp cho doanh nghiệp muốn outsource việc bảo trì nội thất.'],
]

const schoolFaqs = [
  ['Thi công trường học có kịp trước ngày khai giảng không?', 'Đại Phát chuyên thi công trường học trong dịp hè. Với kế hoạch bắt đầu từ tháng 6, Đại Phát cam kết bàn giao trước ngày khai giảng 5 tháng 9.'],
  ['Vật liệu có đảm bảo an toàn cho học sinh không?', '100% vật liệu đạt chuẩn E1 — tiêu chuẩn phát thải formaldehyde an toàn nhất. Có chứng nhận kiểm định kèm theo hợp đồng.'],
  ['Đại Phát có kinh nghiệm đấu thầu công trình giáo dục không?', 'Có. Đại Phát đã tham gia nhiều gói thầu nội thất trường học tại Thanh Hóa, có thể hỗ trợ chuẩn bị hồ sơ năng lực và báo giá theo yêu cầu đấu thầu.'],
  ['Bàn ghế học sinh cần ergonomic như thế nào?', 'Đại Phát thiết kế bàn ghế theo chuẩn ergonomic WHO cho từng độ tuổi — chiều cao bàn, góc nghiêng lưng, khoảng cách mắt đến mặt bàn đều được tính toán khoa học.'],
]

// Công trình / mẫu văn phòng thật, có thật (cong-trinh + thu-vien).
const officeProjects = [
  {
    name: 'Trung Tâm Thương Mại AEON_Hải Dương',
    loc: 'Hải Dương',
    style: 'Hiện đại · 2026',
    desc: 'Đại Phát đảm nhận thi công hệ thống kệ hàng, kệ tủ và quầy thu ngân cho AEON Hải Dương — không gian thương mại đòi hỏi độ bền và độ chính xác cao, hoàn thành đúng tiến độ mở cửa.',
    image: 'https://res.cloudinary.com/udho1ezd/image/upload/v1785208132/copy_of_thi-cong-noi-that-eaon-hai-duong_jn4mx3.jpg',
    href: 'https://www.noithatdaiphat.vn/cong-trinh/thi-cong-ke-hang-ke-tu-trung-tam-thuong-mai-aeon-hai-duong',
    tag: 'Công trình đã bàn giao',
  },
  {
    name: 'Phòng Làm Việc Chủ Tịch UBND Xã Đông Khê',
    loc: 'Đông Khê, Thanh Hóa',
    style: 'Tối giản · Trang trọng',
    desc: 'Không gian làm việc hành chính theo triết lý "tối giản nhưng đầy uy lực" — gỗ tự nhiên tông trầm, đường nét dứt khoát, do KTS Thanh Hà trực tiếp thiết kế.',
    image: 'https://res.cloudinary.com/udho1ezd/image/upload/v1784101402/1784087984638_9127702785045128783_g9028237735175193513_809fd0bb100e0fca6a3d3f71e2a341c6_ggzs5v.jpg',
    href: 'https://www.noithatdaiphat.vn/thu-vien/thiet-ke-noi-that-phong-chu-tich-dong-khe',
    tag: 'Mẫu thiết kế thực tế',
  },
]

const WORKSHOP_MAIN_IMG = 'https://www.noithatdaiphat.vn/images/xuong-thuc-te/xuong-co-khi.png'
const WORKSHOP_MINI_IMGS = [
  { src: 'https://www.noithatdaiphat.vn/images/xuong-thuc-te/khu-lap-rap.png', alt: 'Khu vực lắp ráp tại xưởng Đại Phát' },
  { src: 'https://www.noithatdaiphat.vn/images/xuong-thuc-te/xuong-son-tinh-dien.png', alt: 'Buồng sơn tĩnh điện đạt chuẩn tại xưởng Đại Phát' },
]
const LOGO_URL = 'https://www.noithatdaiphat.vn/images/logo-dai-phat.png'
const HERO_IMG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85'

const CONTACT_PHONE = '0967156678'
const CONTACT_PHONE_DISPLAY = '0967 156 678'
const CONTACT_ZALO_URL = 'https://zalo.me/0967156678'
const CONTACT_EMAIL = 'noithatdaiphat8793@gmail.com'
const COMPANY_ADDRESS = 'Đa Sỹ, Đông Quang, Thanh Hóa'
const COMPANY_LEGAL = 'CÔNG TY TNHH SX VÀ TM NỘI THẤT ĐẠI PHÁT — MST/ĐKKD: 2802794939, cấp ngày 25/09/2019 tại Sở KH&ĐT tỉnh Thanh Hóa'

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <div className={`real-photo ${className}`}><img src={src} alt={alt} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} /></div>
}

function Button({ children, secondary = false, href = '#tu-van', onClick, target }: { children: React.ReactNode; secondary?: boolean; href?: string; onClick?: () => void; target?: string }) {
  return <a href={href} onClick={onClick} target={target} rel={target ? 'noopener noreferrer' : undefined} className={`button ${secondary ? 'button-secondary' : ''}`}>{children}<ArrowRight size={17} /></a>
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  '@id': 'https://noithatdaiphat.vn/#business',
  name: 'Nội thất Đại Phát',
  description: 'Thiết kế và thi công nội thất văn phòng, trường học tại Thanh Hóa, trực tiếp từ xưởng sản xuất riêng.',
  areaServed: ['Thanh Hóa', 'Sầm Sơn', 'Đông Sơn', 'Hoằng Hóa', 'Nghi Sơn'],
  knowsAbout: ['Thiết kế nội thất văn phòng Thanh Hóa', 'Thi công nội thất trường học Thanh Hóa', 'Nội thất mầm non chuẩn E1'],
  priceRange: '$$',
  telephone: '+840967156678',
  email: 'noithatdaiphat8793@gmail.com',
  foundingDate: '2019-09-25',
  address: { '@type': 'PostalAddress', streetAddress: 'Đa Sỹ, Đông Quang', addressLocality: 'Thanh Hóa', addressCountry: 'VN' },
  sameAs: ['https://www.facebook.com/noithatdaiphatthanhhoa', 'https://www.youtube.com/@noithatdaiphatthanhhoa'],
  url: 'https://noithatdaiphat.vn',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [...officeFaqs, ...schoolFaqs].map(([question, answer]) => ({
    '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

function ReasonGrid({ items }: { items: typeof officeReasons }) {
  return <div className="reason-grid">{items.map(r => <div className="reason-item" key={r.title}><r.icon size={22} /><h3>{r.title}</h3><p>{r.desc}</p></div>)}</div>
}

function PricingGrid({ items }: { items: typeof officePricing }) {
  return <div className="pricing-grid">{items.map(p => <div className={`pricing-card ${p.popular ? 'is-popular' : ''}`} key={p.tier}>{p.popular && <span className="pricing-badge">Phổ biến nhất</span>}<h3>{p.tier}</h3><strong>{p.price}</strong><p>{p.desc}</p><a href={CONTACT_ZALO_URL} target="_blank" rel="noopener noreferrer" className="text-link" onClick={() => track('click_pricing')}>Nhận báo giá chi tiết <ArrowRight size={14} /></a></div>)}</div>
}

function FaqBlock({ items, idPrefix, openFaq, setOpenFaq }: { items: string[][]; idPrefix: string; openFaq: string | null; setOpenFaq: (id: string | null) => void }) {
  return <div className="faq-list">{items.map(([q, a], i) => { const id = `${idPrefix}-${i}`; return <div className={`faq-item ${openFaq === id ? 'is-open' : ''}`} key={id}><button onClick={() => setOpenFaq(openFaq === id ? null : id)} aria-expanded={openFaq === id}><span>{q}</span><ChevronDown size={19} /></button><div className="faq-answer"><p>{a}</p></div></div> })}</div>
}

export default function Page() {
  const [menu, setMenu] = useState(false)
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formStarted, setFormStarted] = useState(false)
  useEffect(() => { track('page_view') }, [])
  const trackFormStart = () => { if (!formStarted) { setFormStarted(true); track('form_start') } }
  const submitLead = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setFormError(null)
    const data = new FormData(e.currentTarget)
    const payload = { name: data.get('name'), phone: data.get('phone'), area: data.get('org'), size: data.get('size'), need: data.get('need') }
    setSending(true)
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('request_failed')
      track('form_submit'); track('qualified_lead')
      setSent(true)
    } catch {
      setFormError('Gửi yêu cầu chưa thành công. Vui lòng thử lại hoặc gọi trực tiếp hotline.')
    } finally { setSending(false) }
  }

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand"><img src={LOGO_URL} alt="Logo Nội thất Đại Phát" className="brand-logo" /><span>NỘI THẤT <b>ĐẠI PHÁT</b><small>THANH HÓA · SINCE 2019</small></span></a>
        <nav className={menu ? 'mobile-open' : ''}>{[['Văn phòng', '#van-phong'], ['Trường học', '#truong-hoc'], ['Xưởng sản xuất', '#xuong'], ['Bảng giá', '#bang-gia'], ['FAQ', '#faq']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}<a className="nav-cta" href="#tu-van" onClick={() => setMenu(false)}>Nhận báo giá <ArrowRight size={15} /></a></nav>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Mở menu">{menu ? <X /> : <Menu />}</button>
      </div>
    </header>

    <section className="hero" id="top"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow"><span /> NỘI THẤT VĂN PHÒNG & TRƯỜNG HỌC · THANH HÓA</p><h1>NỘI THẤT CHO <em>VĂN PHÒNG & TRƯỜNG HỌC</em> CHUYÊN NGHIỆP</h1><p className="hero-lead">Đồng bộ thương hiệu cho doanh nghiệp — an toàn chuẩn E1 cho trường học. Cùng một xưởng sản xuất 3.000 m², một quy trình minh bạch.</p><p className="hero-body">Đại Phát hỗ trợ đầy đủ hồ sơ năng lực cho gói thầu, thi công ngoài giờ hành chính hoặc trong dịp hè để không ảnh hưởng vận hành của bạn.</p><div className="hero-actions"><Button>NHẬN BÁO GIÁ TRONG 24H</Button><Button secondary href="#van-phong">XEM NĂNG LỰC THỰC TẾ</Button></div><div className="hero-note"><Check size={16} /> Hỗ trợ hồ sơ đấu thầu · Bảo hành 2 năm toàn bộ hạng mục</div></div><div className="hero-visual"><Photo src={HERO_IMG} alt="Không gian văn phòng chuyên nghiệp" className="hero-photo" /><div className="hero-stamp"><strong>3.000+</strong><span>m² xưởng<br />sản xuất</span></div></div></div><a href="#van-phong" className="scroll-cue"><ArrowDown size={16} /> Khám phá năng lực</a></section>

    <section className="proof"><div className="container proof-grid">{[[Factory, '7+ năm kinh nghiệm', 'Xưởng sản xuất riêng 3.000 m²'], [FileCheck2, 'Hỗ trợ hồ sơ đấu thầu', 'Hồ sơ năng lực, báo giá theo yêu cầu'], [ShieldCheck, 'Bảo hành 2 năm', 'Toàn bộ hạng mục bàn giao'], [Badge, 'Vật liệu chuẩn E1', 'An toàn cho môi trường giáo dục']].map(([Icon, title, sub]) => <div className="proof-item" key={title as string}><Icon size={24} /><div><strong>{title as string}</strong><span>{sub as string}</span></div></div>)}</div></section>

    <section className="section segment-nav"><div className="container"><div className="segment-grid"><a className="segment-card" href="#van-phong"><span className="segment-label">Doanh nghiệp</span><h3>Nội Thất Văn Phòng</h3><p>Đồng bộ thương hiệu · Thi công ngoài giờ · Giá 2–12 triệu/m²</p><span className="text-link">Xem chi tiết <ArrowRight size={14} /></span></a><a className="segment-card" href="#truong-hoc"><span className="segment-label">Giáo dục</span><h3>Nội Thất Trường Học</h3><p>Chuẩn an toàn E1 · Thi công trong hè · Giá 1,5–8 triệu/m²</p><span className="text-link">Xem chi tiết <ArrowRight size={14} /></span></a></div></div></section>

    <section className="section segment" id="van-phong"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span /> THỊ TRƯỜNG MẠNH CỦA ĐẠI PHÁT</p><h2>NỘI THẤT <em>VĂN PHÒNG</em> THANH HÓA</h2></div><p>Không gian làm việc chuyên nghiệp, đồng bộ thương hiệu. Thi công ngoài giờ — không ảnh hưởng hoạt động kinh doanh.</p></div>
      <ReasonGrid items={officeReasons} />
      <div className="real-project-grid">{officeProjects.map(p => <a className="real-project-card" key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" onClick={() => track('view_project')}><Photo src={p.image} alt={p.name} className="real-project-photo" /><div className="real-project-body"><span className="real-project-tag">{p.tag}</span><h3>{p.name}</h3><p className="real-project-meta">{p.loc} <span>·</span> {p.style}</p><p className="real-project-desc">{p.desc}</p><span className="real-project-link">Xem chi tiết <ArrowRight size={14} /></span></div></a>)}</div>
      <div id="bang-gia" className="pricing-heading"><span className="sample-label">BÁO GIÁ THAM KHẢO</span><h3>Minh bạch từ đầu — Văn phòng</h3></div>
      <PricingGrid items={officePricing} />
      <div className="faq-inline"><h3>Câu hỏi thường gặp — Văn phòng</h3><FaqBlock items={officeFaqs} idPrefix="office" openFaq={openFaq} setOpenFaq={setOpenFaq} /></div>
    </div></section>

    <section className="section segment segment-alt" id="truong-hoc"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span /> THỊ TRƯỜNG MẠNH CỦA ĐẠI PHÁT</p><h2>NỘI THẤT <em>TRƯỜNG HỌC</em> THANH HÓA</h2></div><p>An toàn — bền bỉ — truyền cảm hứng học tập. Thi công trong dịp hè, khai giảng đúng ngày.</p></div>
      <ReasonGrid items={schoolReasons} />
      <div className="sample-heading" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}><div><span className="sample-label">NĂNG LỰC THỰC TẾ</span><h3>Đang cập nhật ảnh công trình trường học</h3></div><p>Đại Phát đã tham gia nhiều gói thầu giáo dục tại Thanh Hóa. Ảnh công trình cụ thể sẽ được bổ sung khi có tư liệu — trong lúc chờ, bạn có thể xem trực tiếp năng lực sản xuất tại xưởng.</p></div>
      <div className="center-action" style={{ marginTop: 18 }}><Button secondary href="#xuong">XEM XƯỞNG SẢN XUẤT</Button></div>
      <div id="bang-gia-th" className="pricing-heading"><span className="sample-label">BÁO GIÁ THAM KHẢO</span><h3>Minh bạch từ đầu — Trường học</h3></div>
      <PricingGrid items={schoolPricing} />
      <div className="faq-inline"><h3>Câu hỏi thường gặp — Trường học</h3><FaqBlock items={schoolFaqs} idPrefix="school" openFaq={openFaq} setOpenFaq={setOpenFaq} /></div>
    </div></section>

    <section className="section workshop" id="xuong"><div className="container workshop-grid"><div className="workshop-photos"><Photo src={WORKSHOP_MAIN_IMG} alt="Xưởng cơ khí Đại Phát" className="workshop-main" /><div className="mini-photos">{WORKSHOP_MINI_IMGS.map(img => <Photo key={img.src} src={img.src} alt={img.alt} />)}</div></div><div className="workshop-copy"><p className="eyebrow"><span /> NĂNG LỰC SẢN XUẤT</p><h2>SẢN XUẤT <em>HÀNG LOẠT</em><br />ĐỒNG ĐỀU CHO TỔ CHỨC LỚN</h2><p>Xưởng riêng giúp Đại Phát sản xuất số lượng lớn mà vẫn giữ chất lượng đồng đều tuyệt đối giữa các sản phẩm cùng lô — điều rất quan trọng khi trang bị đồng loạt cho nhiều phòng ban hoặc nhiều lớp học.</p><div className="capabilities"><div><strong>3.000+</strong><span>m² diện tích xưởng</span></div><div><strong>500+</strong><span>bộ bàn ghế/lô đồng đều</span></div><div><strong>12+</strong><span>máy CNC & cắt gỗ</span></div></div><ul><li><Check size={16} /> Chủ động kiểm tra chất lượng tại xưởng</li><li><Check size={16} /> Vật liệu chuẩn E1 có chứng nhận kiểm định</li><li><Check size={16} /> Hỗ trợ hồ sơ năng lực cho gói thầu</li><li><Check size={16} /> Thi công ngoài giờ hành chính / trong dịp hè</li></ul><a href="https://www.noithatdaiphat.vn/xuong-san-xuat" target="_blank" rel="noopener noreferrer" className="text-link">Xem toàn bộ xưởng sản xuất <ArrowRight size={16} /></a></div></div></section>

    <section className="section process-intro"><div className="container"><div className="section-heading centered"><p className="eyebrow"><span /> QUY TRÌNH LÀM VIỆC</p><h2>TỪ KHẢO SÁT ĐẾN <em>BÀN GIAO</em></h2><p>Quy trình rõ ràng, phù hợp cả doanh nghiệp lẫn đơn vị giáo dục cần hồ sơ đấu thầu.</p></div><div className="flow">{['Khảo sát', 'Hồ sơ năng lực', 'Thiết kế', 'Sản xuất', 'Thi công ngoài giờ/hè', 'Bàn giao & bảo hành'].map((x, i) => <div key={x}><span>{String(i + 1).padStart(2, '0')}</span><strong>{x}</strong>{i < 5 && <ArrowRight size={16} />}</div>)}</div></div></section>

    <section className="estimate" id="tu-van"><div className="container estimate-grid"><div><p className="eyebrow"><span /> BẮT ĐẦU DỰ ÁN CỦA BẠN</p><h2>NHẬN BÁO GIÁ<br /><em>TRONG 24H</em></h2><p>Để lại thông tin, đội ngũ Đại Phát sẽ liên hệ tư vấn phương án và báo giá phù hợp.</p><div className="estimate-contact"><Phone size={20} /><span>Hotline tư vấn<br /><strong>{CONTACT_PHONE_DISPLAY}</strong></span></div></div>{sent ? <div className="form-success"><Check size={32} /><h3>Đã nhận yêu cầu của bạn</h3><p>Cảm ơn bạn. Đại Phát sẽ liên hệ tư vấn trong thời gian sớm nhất.</p></div> : <form onFocus={trackFormStart} onSubmit={submitLead}><label>Họ và tên<input required name="name" placeholder="Nhập họ và tên" /></label><label>Số điện thoại<input required type="tel" name="phone" placeholder="Nhập số điện thoại" pattern="[0-9+ ]{9,12}" /></label><label>Đơn vị / Trường<input name="org" placeholder="Tên công ty hoặc trường học" /></label><div className="form-row"><label>Diện tích / Quy mô<input name="size" placeholder="m² hoặc số nhân sự, học sinh" /></label><label>Loại hình<select name="need" defaultValue=""><option value="" disabled>Chọn loại hình</option><option>Nội thất văn phòng</option><option>Nội thất trường học / mầm non</option><option>Cần hồ sơ đấu thầu</option></select></label></div>{formError && <p className="form-error">{formError}</p>}<button className="button" type="submit" disabled={sending}>{sending ? 'ĐANG GỬI…' : <>GỬI YÊU CẦU TƯ VẤN <ArrowRight size={17} /></>}</button><small>Thông tin của bạn được sử dụng để tư vấn và không chia sẻ cho bên thứ ba.</small></form>}</div></section>

    <section className="section faq" id="faq"><div className="container"><div className="section-heading centered"><p className="eyebrow"><span /> GIẢI ĐÁP NHANH</p><h2>CÂU HỎI<br /><em>THƯỜNG GẶP</em></h2><p>Tổng hợp câu hỏi cho cả văn phòng và trường học. Cần tư vấn riêng cho trường hợp của bạn?</p><a className="text-link" href="#tu-van">Liên hệ Đại Phát <ArrowRight size={16} /></a></div><div className="faq-grid-full"><div><h3>Văn phòng</h3><FaqBlock items={officeFaqs} idPrefix="faq-office" openFaq={openFaq} setOpenFaq={setOpenFaq} /></div><div><h3>Trường học</h3><FaqBlock items={schoolFaqs} idPrefix="faq-school" openFaq={openFaq} setOpenFaq={setOpenFaq} /></div></div></div></section>

    <section className="final-cta"><div className="container"><p className="eyebrow"><span /> SẴN SÀNG BẮT ĐẦU?</p><h2>NÂNG TẦM VĂN PHÒNG<br /><em>HAY TRƯỜNG HỌC CỦA BẠN?</em></h2><p>Tư vấn miễn phí — khảo sát tận nơi — báo giá trong 24h.</p><Button>NHẬN BÁO GIÁ NGAY</Button></div></section>

    <footer className="site-footer"><div className="container footer-grid"><a href="#top" className="brand"><img src={LOGO_URL} alt="Logo Nội thất Đại Phát" className="brand-logo" /><span>NỘI THẤT <b>ĐẠI PHÁT</b><small>THANH HÓA · SINCE 2019</small></span></a><div><strong>LIÊN HỆ</strong><p>Hotline: {CONTACT_PHONE_DISPLAY}<br />Zalo: {CONTACT_PHONE_DISPLAY}<br />Email: {CONTACT_EMAIL}</p></div><div><strong>ĐỊA CHỈ XƯỞNG</strong><p>{COMPANY_ADDRESS}<br />{COMPANY_LEGAL}</p></div></div><div className="container footer-bottom"><span>© 2026 Nội thất Đại Phát.</span><span>Thiết kế &amp; thi công nội thất văn phòng, trường học</span></div></footer>
    <div className="mobile-bar"><a href={`tel:+84${CONTACT_PHONE}`} onClick={() => track('click_call')}><Phone size={17} /> Gọi tư vấn</a><a href={CONTACT_ZALO_URL} onClick={() => track('click_zalo')}><span className="zalo">Z</span> Zalo</a><a href="#tu-van">Báo giá <ArrowRight size={15} /></a></div>
  </main>
}
