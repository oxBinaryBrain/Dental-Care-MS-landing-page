import { useEffect, useRef, useState, useCallback } from 'react'
import { useMergeRefs, useLockBodyScroll } from './hooks'
import { rafDebounce } from './utils/rafDebounce'

// ---------------------------------------------------------------------------
// Image URLs
// ---------------------------------------------------------------------------
const HERO_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_113640_ccf3cf97-d447-425b-a134-d7b09fc743fc.png&w=1280&q=85'
const SECTION2_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114219_414dfe80-f15c-4e25-bf52-b13721f4bd88.png&w=1280&q=85'
const SECTION3_IMG1 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115253_c19ab167-8dd5-48b4-967d-b9f0d9d6e8fb.png&w=1280&q=85'
const SECTION3_IMG2 = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_115237_fc519057-6e87-4abf-999a-9610b8b085b4.png&w=1280&q=85'
const SECTION3_BG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260624_114355_752ba9e6-0942-4abb-9047-5d9bb16632e9.png&w=1280&q=85'

// ---------------------------------------------------------------------------
// Business data — update once, used everywhere (CTAs, contact, footer, SEO)
// ---------------------------------------------------------------------------
const BUSINESS = {
  name: 'Dental Health',
  tagline: 'quality healthcare',
  phone: '+12015550199',
  phoneLabel: '(201) 555-0199',
  email: 'info@dentalhealthwny.com',
  address: '123 Main Street, West New York, NJ 07093',
  hours: [
    { day: 'Mon – Fri', time: '9:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 3:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12138.4!2d-74.0254!3d40.7868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ3JzEyLjUiTiA3NMKwMDEnMzEuNCJX!5e0!3m2!1sen!2sus!4v1',
  lat: 40.7868,
  lng: -74.0254,
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const featureBars = ['Advanced Dentistry', 'High Quality Equipment', 'Friendly Staff']

interface ServiceInfo {
  name: string
  num: string | null
  details: string
}

const services: ServiceInfo[] = [
  { name: 'Dental\nVeneers', num: '01', details: 'Custom-made thin shells bonded to the front of teeth for a flawless, natural-looking smile. Perfect for chips, gaps, and discoloration. Typically completed in 2-3 visits.' },
  { name: 'Dental\nCrowns', num: '02', details: 'Full-coverage restorations that restore damaged or weakened teeth to full function and appearance. Made from durable porcelain or zirconia for a seamless look.' },
  { name: 'Teeth\nWhitening', num: '03', details: 'Professional-grade whitening treatments that safely brighten your smile by up to 8 shades in just one visit. We also offer take-home kits for gradual results.' },
  { name: 'Dental\nImplants', num: null, details: 'Permanent tooth replacements that look, feel, and function like natural teeth. A titanium post fuses with your jawbone for lifelong stability. Success rate over 95%.' },
]

const navLinks = ['Home', 'Smile Gallery', 'Implants', 'About', 'Reviews', 'FAQ', 'Contact']

// The scrollable sections, in order. Drives the scroll dots + active state.
const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'gallery', label: 'Smile Gallery' },
  { id: 'implants', label: 'Implants' },
  { id: 'about', label: 'About' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
]
const SECTION_IDS = SECTIONS.map((s) => s.id)

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
interface Testimonial {
  name: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  { name: 'Maria S.', text: 'I was terrified of dentists for years, but the team here made me feel completely at ease. My veneers look incredible — I can\'t stop smiling!', rating: 5 },
  { name: 'James T.', text: 'Got two implants done and the process was so smooth. They walked me through every step and the results are better than I expected.', rating: 5 },
  { name: 'Priya K.', text: 'The whole family comes here now. Friendly staff, modern equipment, and they actually take the time to explain everything.', rating: 5 },
  { name: 'Carlos R.', text: 'Emergency visit on a Saturday and they got me in right away. Fixed my cracked tooth the same day. Truly grateful!', rating: 5 },
]

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
interface FaqItem {
  q: string
  a: string
}

const faqs: FaqItem[] = [
  { q: 'Does getting dental implants hurt?', a: 'Most patients report minimal discomfort. We use local anesthesia during the procedure and provide clear aftercare instructions. Any post-procedure soreness is typically manageable with over-the-counter pain medication.' },
  { q: 'How long do dental implants last?', a: 'With proper care, dental implants can last a lifetime. The crown on top may need replacement after 10-15 years due to normal wear, but the titanium implant post itself is designed to be permanent.' },
  { q: 'Do you accept dental insurance?', a: 'Yes, we accept most major dental insurance plans. We also offer flexible payment plans and financing options to make quality dental care accessible to everyone.' },
  { q: 'How long does teeth whitening take?', a: 'Our in-office professional whitening takes about 60-90 minutes and can brighten your smile by up to 8 shades. We also offer take-home kits for gradual whitening at your own pace.' },
  { q: 'What should I do in a dental emergency?', a: `Call us immediately at ${BUSINESS.phoneLabel}. We offer same-day emergency appointments. For severe pain or trauma, don't wait — contact us right away. We're here to help.` },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
// ponytail: read the OS "reduce motion" pref.
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

interface MaskPosition {
  x: number
  y: number
  sw: number
  sh: number
}

function useMaskPositions(
  sectionRef: React.RefObject<HTMLElement>,
  cardRefs: React.MutableRefObject<(HTMLElement | null)[]>,
) {
  const [positions, setPositions] = useState<MaskPosition[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // ponytail: RAF debounce so resize doesn't fire O(N) every frame
    const compute = rafDebounce(() => {
      const sRect = section.getBoundingClientRect()
      const next: MaskPosition[] = cardRefs.current.map((card) => {
        if (!card) return { x: 0, y: 0, sw: sRect.width, sh: sRect.height }
        const cRect = card.getBoundingClientRect()
        return {
          x: cRect.left - sRect.left,
          y: cRect.top - sRect.top,
          sw: sRect.width,
          sh: sRect.height,
        }
      })
      setPositions(next)
    })

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(section)
    cardRefs.current.forEach((c) => c && ro.observe(c))
    return () => ro.disconnect()
  }, [sectionRef, cardRefs])

  return positions
}

function useImageWidth(src: string, sectionRef: React.RefObject<HTMLElement>) {
  const [imageWidth, setImageWidth] = useState(0)
  const naturalRef = useRef<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight }
      recompute()
    }
    img.src = src

    function recompute() {
      const section = sectionRef.current
      const nat = naturalRef.current
      if (!section || !nat) return
      const sectionHeight = section.getBoundingClientRect().height
      setImageWidth(nat.w * (sectionHeight / nat.h))
    }

    const section = sectionRef.current
    let ro: ResizeObserver | undefined
    if (section) {
      ro = new ResizeObserver(rafDebounce(recompute))
      ro.observe(section)
    }
    return () => ro?.disconnect()
  }, [src, sectionRef])

  return imageWidth
}

function useStaggeredReveal(_count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        })
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  const getAnimStyle = (index: number): React.CSSProperties => {
    if (reducedMotion()) return { opacity: 1 }
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
    }
  }

  return { containerRef, getAnimStyle }
}

// Tracks which section is centered in the viewport.
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { threshold: 0.5 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

// ---------------------------------------------------------------------------
// MaskedCard
// ---------------------------------------------------------------------------
interface MaskedCardProps {
  bgImage: string
  position?: MaskPosition
  imageWidth: number
  focalX: number
  className?: string
  children?: React.ReactNode
  cardRef?: (el: HTMLDivElement | null) => void
  style?: React.CSSProperties
}

function MaskedCard({
  bgImage,
  position,
  imageWidth,
  focalX,
  className,
  children,
  cardRef,
  style,
}: MaskedCardProps) {
  const pos = position ?? { x: 0, y: 0, sw: 0, sh: 0 }
  const overflow = imageWidth > pos.sw ? imageWidth - pos.sw : 0
  const focalOffset = overflow * focalX

  const bgStyle: React.CSSProperties = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: `auto ${pos.sh}px`,
    backgroundPosition: `-${pos.x + focalOffset}px -${pos.y}px`,
    backgroundRepeat: 'no-repeat',
    ...style,
  }

  return (
    <div ref={cardRef} className={className} style={bgStyle}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// OverlayCard (section 3 overlay cards — interactive)
// ---------------------------------------------------------------------------
interface OverlayCardProps {
  title: string
  variant: 'white' | 'glass'
  onClick: () => void
}

function OverlayCard({ title, variant, onClick }: OverlayCardProps) {
  const isGlass = variant === 'glass'
  return (
    <div
      className={`flex-1 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${
        isGlass ? 'bg-white/20 backdrop-blur-xl' : 'bg-white'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      aria-label={title}
    >
      <h4 className={`text-lg md:text-2xl font-bold leading-5 md:leading-7 ${isGlass ? 'text-white' : 'text-black'}`}>
        {title}
      </h4>
      <div className={`self-end w-9 h-9 md:w-12 md:h-12 rounded-full border flex items-center justify-center ${isGlass ? 'border-white' : 'border-black'}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`rotate-[-45deg] ${isGlass ? 'text-white' : 'text-black'}`}>
          <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DetailModal (reusable modal for service & implant details)
// ---------------------------------------------------------------------------
interface DetailModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function DetailModal({ open, onClose, title, children }: DetailModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-2xl p-6 md:p-10 max-w-lg w-full mx-4 relative max-h-[85vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors text-black text-sm font-bold"
          aria-label="Close"
        >
          ✕
        </button>
        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">{title}</h3>
        <div className="text-sm md:text-base text-neutral-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Splash screen
// ---------------------------------------------------------------------------
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (reducedMotion()) {
      setCount(100)
      const t = setTimeout(onComplete, 300)
      return () => clearTimeout(t)
    }
    let step = 0
    const interval = setInterval(() => {
      step += 1
      setCount(step)
      if (step >= 100) {
        clearInterval(interval)
        setTimeout(() => setExiting(true), 200)
        setTimeout(() => onComplete(), 900)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [onComplete])

  const skip = useCallback(() => {
    setExiting(true)
    setTimeout(onComplete, 600)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-all duration-700 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none text-black">
        {count}
      </span>
      <button
        onClick={skip}
        className="absolute top-6 right-6 text-sm font-medium text-neutral-400 hover:text-black transition-colors z-[101]"
        aria-label="Skip splash screen"
      >
        Skip
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)

  // ponytail: safe scroll lock — avoids iOS Safari bounce bugs
  useLockBodyScroll(mobileOpen || desktopMenuOpen)

  const jumpTo = (id: string) => {
    setMobileOpen(false)
    setDesktopMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    const html = document.documentElement
    html.style.scrollSnapType = 'none'
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
    setTimeout(() => html.style.removeProperty('scroll-snap-type'), 700)
  }

  const sectionMap: Record<string, string> = {
    Home: 'hero', 'Smile Gallery': 'gallery', Implants: 'implants',
    About: 'about', Reviews: 'reviews', FAQ: 'faq', Contact: 'contact',
  }

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[110] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-full focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md transition-colors duration-300">
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-black">Dental</span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2 text-black">Health</span>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2 text-black/60">{BUSINESS.tagline}</span>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDesktopMenuOpen(v => !v)}
              className="px-6 py-3 bg-white rounded-full border border-black/20 text-sm font-semibold hover:bg-black hover:text-white transition-colors duration-200 text-black"
            >
              Menu
            </button>
            {/* Dropdown */}
            {desktopMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-black/10 p-3 min-w-[200px] z-50">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => jumpTo(sectionMap[link] || 'hero')}
                    className="block w-full text-left py-2.5 px-4 text-sm font-semibold text-black hover:bg-black/5 rounded-xl transition-colors"
                  >
                    {link}
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-black/10">
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="block w-full text-center py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
            )}
          </div>

          <a href={`tel:${BUSINESS.phone}`} className="text-sm font-semibold text-black hover:underline">
            {BUSINESS.phoneLabel}
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="w-10 h-10 flex items-center justify-center relative"
          >
            <span className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
            <span className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
            <span className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={() => jumpTo(sectionMap[link] || 'hero')}
                className="text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(2rem)',
                  transitionDelay: `${mobileOpen ? 100 + i * 60 : 0}ms`,
                }}
              >
                {link}
              </a>
            ))}

            <div
              className="mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(2rem)',
                transitionDelay: `${mobileOpen ? 450 : 0}ms`,
              }}
            >
              <a href={`tel:${BUSINESS.phone}`} className="block text-sm font-semibold text-black mb-4 hover:underline">
                {BUSINESS.phoneLabel} — Dental Emergency
              </a>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="block w-full text-center px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// ScrollDots — desktop right-side + mobile bottom bar
// ---------------------------------------------------------------------------
function ScrollDots({ activeIndex }: { activeIndex: number }) {
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const html = document.documentElement
    html.style.scrollSnapType = 'none'
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
    setTimeout(() => html.style.removeProperty('scroll-snap-type'), 700)
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex fixed top-1/2 right-4 z-50 -translate-y-1/2 flex-col gap-3">
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={jump(s.id)}
            aria-label={`Go to ${s.label}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className={`rounded-full border border-black transition-all duration-300 ${
              i === activeIndex ? 'h-6 w-2.5 bg-black' : 'h-2.5 w-2.5 bg-transparent hover:bg-black/40'
            }`}
          />
        ))}
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-black/10">
        {SECTIONS.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={jump(s.id)}
            aria-label={`Go to ${s.label}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? 'h-2 w-5 bg-black' : 'h-2 w-2 bg-black/30'
            }`}
          />
        ))}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Star rating component
// ---------------------------------------------------------------------------
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, j) => (
        <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const isMobile = useIsMobile()

  // Interactive state
  const [activeService, setActiveService] = useState<number | null>(null)
  const [activeOverlay, setActiveOverlay] = useState<number | null>(null)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  // Section 1
  const section1Ref = useRef<HTMLElement>(null)
  const s1Cards = useRef<(HTMLElement | null)[]>([])
  const s1Positions = useMaskPositions(section1Ref, s1Cards)
  const s1ImgWidth = useImageWidth(HERO_IMAGE, section1Ref)
  const s1Reveal = useStaggeredReveal(4)
  const s1Focal = isMobile ? 0.7 : 0.8

  // Section 2
  const section2Ref = useRef<HTMLElement>(null)
  const s2Cards = useRef<(HTMLElement | null)[]>([])
  const s2Positions = useMaskPositions(section2Ref, s2Cards)
  const s2ImgWidth = useImageWidth(SECTION2_IMAGE, section2Ref)
  const s2Reveal = useStaggeredReveal(4)
  const s2Focal = isMobile ? 0.65 : 0.8

  // Sections 3-7
  const s3Reveal = useStaggeredReveal(4)
  const aboutReveal = useStaggeredReveal(4)
  const reviewsReveal = useStaggeredReveal(testimonials.length + 1)
  const faqReveal = useStaggeredReveal(3)
  const contactReveal = useStaggeredReveal(3)

  const activeIndex = useActiveSection(SECTION_IDS)

  // ponytail: useMergeRefs instead of fragile cast pattern
  const setSection1 = useMergeRefs(section1Ref, s1Reveal.containerRef)
  const setSection2 = useMergeRefs(section2Ref, s2Reveal.containerRef)

  const implantDetails = [
    {
      title: 'The Implant Process',
      content: (
        <>
          <p className="mb-3"><strong className="text-black">Step 1 — Consultation:</strong> We examine your mouth, take 3D scans, and create a personalized treatment plan.</p>
          <p className="mb-3"><strong className="text-black">Step 2 — Implant Placement:</strong> The titanium post is surgically placed into your jawbone under local anesthesia.</p>
          <p className="mb-3"><strong className="text-black">Step 3 — Healing:</strong> Over 3-6 months, the implant fuses with your bone (osseointegration).</p>
          <p><strong className="text-black">Step 4 — Crown:</strong> We attach a custom-made crown that looks and feels like your natural tooth.</p>
        </>
      ),
    },
    {
      title: 'Caring for Your Implants',
      content: (
        <>
          <p className="mb-3">Caring for dental implants is similar to caring for natural teeth:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Brush twice daily with a soft-bristle toothbrush</li>
            <li>Floss daily using implant-safe floss</li>
            <li>Use an antibacterial mouthwash</li>
            <li>Visit us every 6 months for checkups</li>
            <li>Avoid chewing hard items like ice or hard candy</li>
            <li>Don't smoke — it impairs healing and implant longevity</li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <div className="bg-white transition-colors duration-300">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Navbar />
      <ScrollDots activeIndex={activeIndex} />

      {/* ====================================================================== */}
      {/* SECTION 1 - HERO */}
      {/* ====================================================================== */}
      <section id="hero" ref={setSection1} className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2">
        {featureBars.map((bar, i) => (
          <MaskedCard
            key={bar}
            bgImage={HERO_IMAGE}
            position={s1Positions[i]}
            imageWidth={s1ImgWidth}
            focalX={s1Focal}
            cardRef={(el) => (s1Cards.current[i] = el)}
            className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative"
            style={s1Reveal.getAnimStyle(i)}
          >
            <span className="flex items-center justify-center h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
              {bar}
            </span>
          </MaskedCard>
        ))}

        <MaskedCard
          bgImage={HERO_IMAGE}
          position={s1Positions[3]}
          imageWidth={s1ImgWidth}
          focalX={s1Focal}
          cardRef={(el) => (s1Cards.current[3] = el)}
          className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
          style={s1Reveal.getAnimStyle(3)}
        >
          <div className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
            We wish to provide professional dental services
            <br />
            that match the current technologies
          </div>

          <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
            <span className="block text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
              Trusted Dentist in West New York
            </span>
            <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
              Dental<br />Care
            </h1>
          </div>

          <a
            href={`tel:${BUSINESS.phone}`}
            className="absolute bottom-6 right-4 md:bottom-10 md:right-8 text-white text-xs md:text-sm font-semibold z-10 hover:underline"
          >
            Free Consultation
          </a>
        </MaskedCard>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 2 - SMILE GALLERY (interactive services) */}
      {/* ====================================================================== */}
      <section id="gallery" ref={setSection2} className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2">
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[0]} imageWidth={s2ImgWidth} focalX={s2Focal}
            cardRef={(el) => (s2Cards.current[0] = el)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
            style={s2Reveal.getAnimStyle(0)}
          >
            <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-2xl md:text-3xl font-bold z-10">Smile Gallery</h2>
            <span className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">Our cosmetic dental work</span>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[1]} imageWidth={s2ImgWidth} focalX={s2Focal}
            cardRef={(el) => (s2Cards.current[1] = el)}
            className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
            style={s2Reveal.getAnimStyle(1)}
          >
            <div className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
              If you want a gorgeous smile,<br />call us to ask about a smile makeover.
            </div>
            <a href={`tel:${BUSINESS.phone}`} className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold z-10 hover:scale-105 transition-transform">
              Call Us
            </a>
          </MaskedCard>

          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[2]} imageWidth={s2ImgWidth} focalX={s2Focal}
            cardRef={(el) => (s2Cards.current[2] = el)}
            className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
            style={s2Reveal.getAnimStyle(2)}
          >
            <h2 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">Smile<br />makeover</h2>
          </MaskedCard>

          {/* Services strip — now interactive */}
          <MaskedCard
            bgImage={SECTION2_IMAGE} position={s2Positions[3]} imageWidth={s2ImgWidth} focalX={s2Focal}
            cardRef={(el) => (s2Cards.current[3] = el)}
            className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
            style={s2Reveal.getAnimStyle(3)}
          >
            <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
              {services.map((svc, i) => (
                <button
                  key={svc.name}
                  onClick={() => setActiveService(i)}
                  className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                    activeService === i ? 'bg-white/90 backdrop-blur-md' : 'bg-white/20 backdrop-blur-xl hover:bg-white/30'
                  }`}
                >
                  <h3 className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line ${activeService === i ? 'text-black' : 'text-white'}`}>
                    {svc.name}
                  </h3>
                  {svc.num && (
                    <div className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${
                      activeService === i ? 'border-black text-black' : 'border-white text-white'
                    }`}>
                      {svc.num}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </MaskedCard>
        </div>
      </section>

      {/* Service detail modal */}
      <DetailModal
        open={activeService !== null}
        onClose={() => setActiveService(null)}
        title={activeService !== null ? services[activeService].name.replace('\n', ' ') : ''}
      >
        {activeService !== null && (
          <>
            <p className="mb-6">{services[activeService].details}</p>
            <a href={`tel:${BUSINESS.phone}`} className="inline-block px-8 py-4 bg-black text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
              Book Consultation
            </a>
          </>
        )}
      </DetailModal>

      {/* ====================================================================== */}
      {/* SECTION 3 - IMPLANT DENTISTRY (interactive overlay cards) */}
      {/* ====================================================================== */}
      <section id="implants" ref={s3Reveal.containerRef as React.RefObject<HTMLElement>} className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2">
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0 transition-colors" style={s3Reveal.getAnimStyle(0)}>
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">Implant<br />Dentistry</h2>
              <p className="text-xs md:text-sm font-semibold text-black">Restore Missing Teeth</p>
            </div>

            <div className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0" style={s3Reveal.getAnimStyle(1)}>
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img src={SECTION3_IMG1} alt="Close-up of a dental implant crown" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
                <img src={SECTION3_IMG2} alt="Titanium dental implant screw in jaw" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0 transition-colors" style={s3Reveal.getAnimStyle(2)}>
              <div>
                <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">Consultation</p>
                <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">Dental<br />Restoration<br />Services</h3>
              </div>
              <a href={`tel:${BUSINESS.phone}`} className="px-5 py-3 md:px-8 md:py-5 bg-white rounded-full text-black text-base md:text-xl font-bold hover:scale-105 transition-transform">
                Book Online
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0" style={s3Reveal.getAnimStyle(3)}>
            <img src={SECTION3_BG} alt="Smiling patient after dental implant treatment" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
              <OverlayCard title="The Process of Installing Implants" variant="white" onClick={() => setActiveOverlay(activeOverlay === 0 ? null : 0)} />
              <OverlayCard title="Caring for Dental Implants" variant="glass" onClick={() => setActiveOverlay(activeOverlay === 1 ? null : 1)} />
            </div>
          </div>
        </div>
      </section>

      {/* Implant detail modal */}
      <DetailModal
        open={activeOverlay !== null}
        onClose={() => setActiveOverlay(null)}
        title={activeOverlay !== null ? implantDetails[activeOverlay].title : ''}
      >
        {activeOverlay !== null && implantDetails[activeOverlay].content}
      </DetailModal>

      {/* ====================================================================== */}
      {/* SECTION 4 - ABOUT */}
      {/* ====================================================================== */}
      <section id="about" ref={aboutReveal.containerRef as React.RefObject<HTMLElement>} className="min-h-screen w-full overflow-hidden flex flex-col pt-20 md:pt-24 px-3 md:px-5 pb-6 md:pb-8">
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full gap-6 md:gap-8">
          <div style={aboutReveal.getAnimStyle(0)}>
            <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] text-black">About<br />Our Practice</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8" style={aboutReveal.getAnimStyle(1)}>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              For over 15 years, Dental Health has been West New York's trusted dental practice. We combine cutting-edge technology with a warm, personal approach to deliver exceptional care for the whole family.
            </p>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              From routine cleanings to complex smile makeovers, our experienced team is committed to making every visit comfortable and stress-free. We believe everyone deserves a smile they're proud of.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4" style={aboutReveal.getAnimStyle(2)}>
            {[{ num: '15+', label: 'Years Experience' }, { num: '5,000+', label: 'Happy Patients' }, { num: '4.9★', label: 'Average Rating' }].map((stat) => (
              <div key={stat.label} className="bg-stone-50 rounded-xl p-4 md:p-6 text-center transition-colors">
                <div className="text-2xl md:text-4xl font-bold text-black">{stat.num}</div>
                <div className="text-xs md:text-sm text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 5 - TESTIMONIALS */}
      {/* ====================================================================== */}
      <section id="reviews" ref={reviewsReveal.containerRef as React.RefObject<HTMLElement>} className="min-h-screen w-full overflow-hidden flex flex-col pt-20 md:pt-24 px-3 md:px-5 pb-6 md:pb-8">
        <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full gap-6 md:gap-8">
          <div style={reviewsReveal.getAnimStyle(0)}>
            <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] text-black">What Our<br />Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <div key={t.name} className="bg-stone-50 rounded-xl md:rounded-2xl p-5 md:p-7 transition-colors" style={reviewsReveal.getAnimStyle(i + 1)}>
                <Stars count={t.rating} />
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-4 mt-3">"{t.text}"</p>
                <p className="text-sm font-bold text-black">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 6 - FAQ */}
      {/* ====================================================================== */}
      <section id="faq" ref={faqReveal.containerRef as React.RefObject<HTMLElement>} className="min-h-screen w-full overflow-hidden flex flex-col pt-20 md:pt-24 px-3 md:px-5 pb-6 md:pb-8">
        <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full gap-6 md:gap-8">
          <div style={faqReveal.getAnimStyle(0)}>
            <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[0.9] text-black">Frequently<br />Asked Questions</h2>
          </div>
          <div className="space-y-2" style={faqReveal.getAnimStyle(1)}>
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl md:rounded-2xl overflow-hidden bg-stone-50 transition-colors">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-4 md:p-6 flex items-center justify-between gap-4"
                  aria-expanded={activeFaq === i}
                >
                  <span className="text-sm md:text-base font-semibold text-black">{faq.q}</span>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`shrink-0 text-black transition-transform duration-300 ${activeFaq === i ? 'rotate-45' : ''}`}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-4 md:px-6 pb-4 md:pb-6 text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={faqReveal.getAnimStyle(2)}>
            <p className="text-sm text-neutral-500 mb-3">Still have questions?</p>
            <a href={`tel:${BUSINESS.phone}`} className="inline-block px-8 py-4 bg-black text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
              Call Us: {BUSINESS.phoneLabel}
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 7 - CONTACT + FOOTER */}
      {/* ====================================================================== */}
      <section id="contact" ref={contactReveal.containerRef as React.RefObject<HTMLElement>} className="min-h-screen w-full overflow-hidden flex flex-col pt-20 md:pt-24 px-3 md:px-5 pb-6 md:pb-8">
        <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full gap-6 md:gap-8">
          <div style={contactReveal.getAnimStyle(0)}>
            <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] text-black">Get In<br />Touch</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6" style={contactReveal.getAnimStyle(1)}>
            {/* Info card */}
            <div className="bg-stone-50 rounded-xl md:rounded-2xl p-5 md:p-7 transition-colors">
              <h3 className="text-lg font-bold text-black mb-4">Contact Information</h3>
              <div className="space-y-4 text-sm text-neutral-600">
                <div>
                  <p className="font-semibold text-black mb-1">Phone</p>
                  <a href={`tel:${BUSINESS.phone}`} className="hover:underline">{BUSINESS.phoneLabel}</a>
                </div>
                <div>
                  <p className="font-semibold text-black mb-1">Email</p>
                  <a href={`mailto:${BUSINESS.email}`} className="hover:underline">{BUSINESS.email}</a>
                </div>
                <div>
                  <p className="font-semibold text-black mb-1">Address</p>
                  <p>{BUSINESS.address}</p>
                </div>
                <div>
                  <p className="font-semibold text-black mb-1">Hours</p>
                  <div className="space-y-0.5">
                    {BUSINESS.hours.map((h) => (
                      <p key={h.day} className="flex justify-between max-w-[260px]">
                        <span>{h.day}</span><span>{h.time}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="block w-full text-center py-3 bg-black text-white rounded-full font-semibold hover:opacity-90 transition-opacity mt-2"
                >
                  Book Appointment
                </a>
              </div>
            </div>

            {/* Map card */}
            <div className="rounded-xl md:rounded-2xl overflow-hidden min-h-[250px] md:min-h-0">
              <iframe
                title={`${BUSINESS.name} location on Google Maps`}
                src={BUSINESS.mapEmbed}
                className="w-full h-full min-h-[250px] md:min-h-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-200" style={contactReveal.getAnimStyle(2)}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <p>&copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
