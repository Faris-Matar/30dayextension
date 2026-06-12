import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, RoundedBox, Text3D } from '@react-three/drei'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Expand,
  Facebook,
  Hammer,
  Home,
  Instagram,
  Layers,
  Mail,
  MapPin,
  Menu,
  PencilRuler,
  Phone,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FONT_URL = 'https://unpkg.com/three@0.169.0/examples/fonts/helvetiker_bold.typeface.json'

// Shared Lenis instance so nav anchors can drive smooth scroll
let lenisInstance = null

function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -72 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/* ============================================================
   LOGO — roof-line mark + wordmark + slogan, recreated in SVG
   ============================================================ */
function Logo({ onNavigate, dark = false }) {
  const text = dark ? 'text-navy' : 'text-cream'
  const pane = dark ? '#0D1B2A' : '#F7F5F0'
  return (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault()
        onNavigate?.('home')
      }}
      className="flex items-center gap-3"
      aria-label="30 Day Extensions Ltd — home"
    >
      <svg viewBox="0 0 64 50" className="h-10 w-auto shrink-0" aria-hidden="true">
        <path
          d="M4 30 L32 6 L60 30"
          fill="none"
          stroke="#E8A020"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="24" y="26" width="16" height="15" fill="none" stroke={pane} strokeWidth="2.5" />
        <line x1="32" y1="26" x2="32" y2="41" stroke={pane} strokeWidth="2.5" />
        <line x1="24" y1="33.5" x2="40" y2="33.5" stroke={pane} strokeWidth="2.5" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-xl font-semibold tracking-wide ${text}`}>
          30 Day Extensions <span className="text-amber">Ltd</span>
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest2 text-amber">
          Time is Money
        </span>
      </span>
    </a>
  )
}

/* ============================================================
   NAV — transparent over hero, shrinks to solid navy on scroll
   ============================================================ */
const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'areas', label: 'Where We Build' },
  { id: 'projects', label: 'Projects' },
  { id: 'process', label: 'Process' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = useCallback((id) => {
    setOpen(false)
    scrollToSection(id)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
        scrolled
          ? 'bg-navy/95 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Logo onNavigate={go} />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                go(item.id)
              }}
              className="text-sm font-medium text-cream/80 transition-colors hover:text-amber"
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:07923123058"
            className="flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-amber-light"
          >
            <Phone size={15} aria-hidden="true" /> 07923 123058
          </a>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-cream lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-cream/10 bg-navy-deep/95 px-6 py-6 backdrop-blur lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(item.id)
                  }}
                  className="font-display text-2xl text-cream transition-colors hover:text-amber"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="tel:07923123058"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-amber px-5 py-3 font-bold text-navy"
              >
                <Phone size={16} aria-hidden="true" /> Call 07923 123058
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ============================================================
   HERO — pinned cinematic opening with 3D "30"
   ============================================================ */
function ThirtyMark({ mouse, reduced }) {
  const group = useRef()
  useFrame((state) => {
    const g = group.current
    if (!g) return
    if (!reduced) {
      g.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.18
      g.rotation.y += (mouse.current.x * 0.35 - g.rotation.y) * 0.04
      g.rotation.x += (-mouse.current.y * 0.18 - g.rotation.x) * 0.04
    }
  })
  return (
    <group ref={group}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={3.2}
          height={0.85}
          bevelEnabled
          bevelSize={0.05}
          bevelThickness={0.08}
          curveSegments={10}
        >
          30
          {/* Concrete-and-steel material */}
          <meshStandardMaterial color="#9BA6B2" metalness={0.5} roughness={0.45} />
        </Text3D>
      </Center>
    </group>
  )
}

function HeroCanvas({ reduced }) {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      className="pointer-events-none"
      camera={{ position: [0, 0, 8.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#FFFFFF" />
      <pointLight position={[-5, -3, 4]} intensity={2.2} color="#E8A020" />
      <Suspense fallback={null}>
        <ThirtyMark mouse={mouse} reduced={reduced} />
      </Suspense>
    </Canvas>
  )
}

const HERO_WORDS = "London's Most Trusted Home Extension Specialists".split(' ')

function Hero({ isDesktop, reduced }) {
  const sectionRef = useRef(null)
  const innerRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    if (!isDesktop || reduced) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=70%',
            scrub: 0.6,
            pin: true,
          },
        })
        .to(innerRef.current, { scale: 0.94, opacity: 0, y: -70, ease: 'power2.out' }, 0)
        .to(bgRef.current, { yPercent: 10, scale: 1.06, ease: 'none' }, 0)
    }, sectionRef)
    return () => ctx.revert()
  }, [isDesktop, reduced])

  return (
    <section id="home" ref={sectionRef} className="relative h-screen min-h-[640px] overflow-hidden">
      {/* TODO: REPLACE WITH ACTUAL PROJECT PHOTO */}
      <img
        ref={bgRef}
        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=85"
        alt="Construction crew building a rear home extension in South London"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/70 to-navy" />

      <div ref={innerRef} className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 md:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl pt-20 lg:pt-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 text-xs font-bold uppercase tracking-widest2 text-amber"
            >
              Home Extensions · London &amp; Surrey
            </motion.p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-cream md:text-6xl lg:text-7xl">
              {HERO_WORDS.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="mr-[0.28em] inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75"
            >
              Watertight shell in 30 days. Transparent pricing. 200+ homes transformed across South
              London.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="group flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-bold text-navy transition-all hover:bg-amber-light"
              >
                Get Your Free Quote
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:border-amber hover:text-amber"
              >
                See Our Projects
              </button>
            </motion.div>
          </div>

          <div className="hidden h-[420px] lg:block" aria-hidden="true">
            {!reduced && <HeroCanvas reduced={reduced} />}
            {reduced && (
              <div className="flex h-full items-center justify-center font-display text-[14rem] font-bold leading-none text-cream/15">
                30
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest2 text-cream/50"
      >
        Scroll
      </motion.div>
    </section>
  )
}

/* ============================================================
   TRUST BAR — marquee
   ============================================================ */
const TRUST_ITEMS = [
  '200+ Projects Completed',
  'FMB Accredited',
  'Master Builders',
  'Shell Watertight in 30 Days',
  'On Site at 8am Every Day',
  '£20k–£1M+ Projects',
  'QS + 15% Transparent Pricing',
  'FREE Architects',
  'South London & Surrey',
  'Time is Money',
]

function TrustBar() {
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS]
  return (
    <section className="overflow-hidden border-y border-amber/20 bg-navy-deep py-5" aria-label="Accreditations and guarantees">
      <div className="marquee-track flex w-max items-center">
        {items.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-amber">{item}</span>
            <span className="mx-6 text-amber/40" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   PROBLEM / PROMISE — pinned scroll-driven film sequence
   ============================================================ */
function ProblemPromise({ isDesktop, reduced }) {
  const wrapRef = useRef(null)
  const bgRef = useRef(null)
  const beat1 = useRef(null)
  const beat2 = useRef(null)
  const beat3 = useRef(null)
  const big30 = useRef(null)
  const counter = useRef(null)
  const pinned = isDesktop && !reduced

  useEffect(() => {
    if (!pinned) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.8,
          pin: true,
        },
      })
      tl.fromTo(beat1.current, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to(bgRef.current, { backgroundColor: '#070F18', duration: 1 }, '<')
        .to(beat1.current, { opacity: 0, y: -70, duration: 0.8, ease: 'power2.out' }, '+=0.7')
        .fromTo(beat2.current, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to(
          { val: 1 },
          {
            val: 30,
            duration: 2.2,
            ease: 'none',
            onUpdate: function () {
              if (counter.current) counter.current.textContent = Math.round(this.targets()[0].val)
            },
          },
          '<+=0.2',
        )
        .to(beat2.current, { opacity: 0, y: -70, duration: 0.8, ease: 'power2.out' }, '+=0.7')
        .fromTo(
          big30.current,
          { scale: 7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.3, ease: 'power2.out' },
        )
        .fromTo(beat3.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to([big30.current, beat3.current], { opacity: 0, duration: 0.9, ease: 'power2.out' }, '+=1')
    }, wrapRef)
    return () => ctx.revert()
  }, [pinned])

  if (!pinned) {
    // Static fallback: stacked beats with simple reveals
    return (
      <section className="bg-navy-deep px-5 py-24 text-center md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-medium leading-tight text-cream/90 md:text-5xl"
          >
            Most builders give you a start date and an excuse.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-medium leading-tight text-cream md:text-5xl"
          >
            Our crews are on site at 8am. <span className="text-amber">Every single day.</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-[7rem] font-bold leading-none text-amber">30</p>
            <p className="mt-4 font-display text-3xl text-cream md:text-4xl">
              Shell watertight. 30 days. Guaranteed.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section ref={wrapRef} className="relative h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 bg-navy" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <h2 ref={beat1} className="absolute max-w-4xl font-display text-5xl font-medium leading-tight text-cream/90 md:text-7xl">
          Most builders give you a start date <em className="text-cream/60">and an excuse.</em>
        </h2>

        <div ref={beat2} className="absolute max-w-4xl opacity-0">
          <p className="font-display text-5xl font-medium leading-tight text-cream md:text-7xl">
            Our crews are on site at 8am.
            <br />
            <span className="text-amber">Every single day.</span>
          </p>
          <p className="mt-10 text-sm font-bold uppercase tracking-widest2 text-cream/50">Day</p>
          <p className="font-display text-8xl font-bold text-amber md:text-9xl">
            <span ref={counter}>1</span>
            <span className="text-cream/30"> / 30</span>
          </p>
        </div>

        <div className="absolute flex flex-col items-center">
          <p
            ref={big30}
            className="font-display text-[30vw] font-bold leading-none text-amber opacity-0 md:text-[24vw]"
            aria-hidden="true"
          >
            30
          </p>
          <p ref={beat3} className="font-display text-3xl text-cream opacity-0 md:text-5xl">
            Shell watertight. 30 days. <span className="text-amber">Guaranteed.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   STATS ROW — count-up
   ============================================================ */
const STATS = [
  { prefix: '', value: 200, suffix: '+', label: 'Projects Completed', line: 'Probably in your road. Definitely in your postcode.' },
  { prefix: '£', value: 1, suffix: 'M+', label: 'Largest Project', line: 'From a single rear extension to a full home transformation.' },
  { prefix: '', value: 30, suffix: '', label: 'Days to Shell', line: 'Not an estimate. A commitment backed by 200+ completions.' },
  { prefix: '', value: 40, suffix: '+', label: 'Years Experience', line: 'Peter Snelson has been building extensions since before most agencies existed.' },
]

function StatsRow({ reduced }) {
  const ref = useRef(null)

  useEffect(() => {
    const nodes = ref.current?.querySelectorAll('[data-count]')
    if (!nodes?.length) return
    if (reduced) {
      nodes.forEach((n) => (n.textContent = n.dataset.count))
      return
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          nodes.forEach((n) => {
            const target = Number(n.dataset.count)
            gsap.fromTo(
              n,
              { textContent: 0 },
              {
                textContent: target,
                duration: 1.8,
                ease: 'power2.out',
                snap: { textContent: 1 },
              },
            )
          })
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={ref} className="border-y border-cream/10 bg-navy px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="border-l-2 border-amber pl-6">
            <p className="font-display text-6xl font-semibold text-cream">
              {stat.prefix}
              <span data-count={stat.value}>0</span>
              {stat.suffix}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest2 text-amber">{stat.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">{stat.line}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ============================================================
   FMB BADGE — placeholder rendering of accreditation
   TODO: REPLACE WITH OFFICIAL FMB / MASTER BUILDERS LOGO ASSETS
   ============================================================ */
function FmbBadge({ dark = false }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-lg border px-4 py-3 ${
        dark ? 'border-navy/20 bg-navy/5 text-navy' : 'border-cream/15 bg-cream/5 text-cream'
      }`}
    >
      <ShieldCheck size={28} className="text-amber" aria-hidden="true" />
      <div className="leading-tight">
        <p className="text-sm font-bold">FMB Accredited</p>
        <p className={`text-xs ${dark ? 'text-navy/60' : 'text-cream/60'}`}>Federation of Master Builders</p>
      </div>
    </div>
  )
}

/* ============================================================
   THE 30 DAY PROMISE — pricing transparency
   ============================================================ */
function Promise30() {
  return (
    <section className="overflow-hidden bg-cream px-5 py-24 text-navy md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest2 text-amber-dark">
            The 30 Day Promise
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            The home extension specialists who show you the builder's numbers.
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-navy/80">
            Most builders pad their quotes because they can. We don't, because we don't need to.
            Our Quantity Surveyor prices every job at true cost.{' '}
            <strong className="text-navy">We show you the builder's cost. We add 15%. That's it.</strong>{' '}
            No hidden margins, no inflated quotes, no surprises on day 28.
          </p>
          <p className="mt-5 leading-relaxed text-navy/70">
            That discipline comes from the top. Peter Snelson has been building across London and
            Surrey for over 40 years — long enough to know that the fastest way to lose a
            reputation is to surprise a client with a bill.
          </p>

          <div className="mt-8 rounded-xl border border-amber/40 bg-amber/10 p-6">
            <p className="font-display text-2xl font-semibold text-navy">
              FREE Architects. Really.
            </p>
            <p className="mt-2 leading-relaxed text-navy/75">
              Drawings, planning applications and structural calculations are handled in-house by
              30 Day Architecture Ltd — free with your build. Or walk into one of our high-street
              shops and talk it through in person.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <FmbBadge dark />
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="group flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-amber-dark"
            >
              Understand How Our Pricing Works
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[420px] overflow-hidden rounded-2xl lg:h-[640px]"
        >
          {/* TODO: REPLACE WITH ACTUAL PROJECT PHOTO */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85"
            alt="Completed rear extension with open-plan kitchen, South London home"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-5 left-5 rounded-lg bg-navy/90 px-5 py-4 backdrop-blur">
            <p className="font-display text-3xl font-semibold text-amber">QS + 15%</p>
            <p className="text-xs font-semibold uppercase tracking-widest2 text-cream/70">
              Transparent pricing, every job
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   SERVICES — 3D tilt card grid (R3F canvas per card)
   ============================================================ */
const SERVICES = [
  {
    icon: Home,
    title: 'Rear Extensions',
    line: 'Open your ground floor. Add 30% more living space without moving house.',
  },
  {
    icon: Layers,
    title: 'Loft Conversions',
    line: 'A full bedroom and en-suite. Built above your head. Shell done in 30 days.',
  },
  {
    icon: Expand,
    title: 'Wraparound Extensions',
    line: 'The single most transformative thing you can do to a Victorian terrace.',
  },
  {
    icon: Building2,
    title: 'New Builds',
    line: 'Full plot development. Planning to handover. One team.',
  },
  {
    icon: PencilRuler,
    title: 'Architecture & Planning',
    line: 'In-house drawings, planning applications, structural calcs. FREE with your build.',
  },
  {
    icon: Hammer,
    title: 'Internal Refurbishments',
    line: 'Shell and fit-out under one contractor. No gaps. No excuses.',
  },
]

function TiltSlab({ hovered }) {
  const mesh = useRef()
  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const targetX = hovered ? -state.pointer.y * 0.35 : 0
    const targetY = hovered ? state.pointer.x * 0.45 : 0
    m.rotation.x += (targetX - m.rotation.x) * 0.08
    m.rotation.y += (targetY - m.rotation.y) * 0.08
    m.position.z += ((hovered ? 0.35 : 0) - m.position.z) * 0.08
  })
  return (
    <RoundedBox ref={mesh} args={[3.6, 2.3, 0.22]} radius={0.08} smoothness={3}>
      <meshStandardMaterial color="#13263B" metalness={0.35} roughness={0.55} />
    </RoundedBox>
  )
}

function ServiceCard({ service, index, enable3d }) {
  const [el, setEl] = useState(null)
  const [hovered, setHovered] = useState(false)
  const Icon = service.icon

  return (
    <motion.div
      ref={setEl}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-cream/10 bg-navy-mid p-8 transition-colors duration-300 hover:border-amber/50"
    >
      {enable3d && el && (
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <Canvas
            eventSource={el}
            eventPrefix="client"
            camera={{ position: [0, 0, 4], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 3, 4]} intensity={3} color="#E8A020" />
            <directionalLight position={[-3, 2, 5]} intensity={0.8} />
            <TiltSlab hovered={hovered} />
          </Canvas>
        </div>
      )}
      <div className="relative z-10">
        <div className="mb-6 inline-flex rounded-xl bg-amber/10 p-3.5 text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-navy">
          <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-cream">{service.title}</h3>
        <p className="mt-3 leading-relaxed text-cream/65">{service.line}</p>
      </div>
    </motion.div>
  )
}

function Services({ isDesktop, reduced }) {
  const enable3d = isDesktop && !reduced
  return (
    <section id="services" className="bg-navy px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest2 text-amber">What We Build</p>
        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
          Rear extensions, loft conversions &amp; wraparound builds across South London
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-cream/65">
          From £20k single-storey extensions to £1M+ full transformations — one team, one
          contract, one 30-day shell promise.
        </p>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} enable3d={enable3d} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   PROXIMITY MAP — their strongest USP
   ============================================================ */
const POSTCODES = [
  'SW2', 'SW4', 'SW11', 'SW12', 'SW15', 'SW16', 'SW17', 'SW18', 'SW19', 'SW20',
  'SE5', 'SE11', 'SE15', 'SE22', 'SE24', 'SE26', 'SE27',
  'KT1', 'KT2', 'KT3', 'KT5', 'KT6', 'KT10', 'KT12', 'KT13',
  'SM1', 'SM4', 'CR4', 'RH2', 'TW2',
]

function ProximityMap() {
  return (
    <section id="areas" className="bg-cream px-5 py-24 text-navy md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest2 text-amber-dark">
            Home Extension Specialists · South London &amp; Surrey
          </p>
          <h2 className="font-display text-5xl font-semibold leading-tight md:text-6xl">
            We've probably built in your road.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy/70">
            200+ completed projects across South London and Surrey. Click your postcode.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 overflow-hidden rounded-2xl border border-navy/10 shadow-[0_30px_80px_rgba(13,27,42,0.18)]"
        >
          <iframe
            src="https://www.google.com/maps/d/u/3/embed?mid=1S_1JVhkGjpHGfoHdTXu4D33o09KBJ3s&ehbc=2E312F&noprof=1"
            title="Map of 200+ completed 30 Day Extensions projects across South London and Surrey"
            className="h-[420px] w-full md:h-[560px]"
            loading="lazy"
            allowFullScreen
          />
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {POSTCODES.map((pc) => (
            <span
              key={pc}
              className="rounded-full border border-navy/15 bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-navy/80"
            >
              {pc}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm font-semibold text-navy/60">
          Every pin is a real address, a real family, a real build — delivered on time.
        </p>
      </div>
    </section>
  )
}

/* ============================================================
   PORTFOLIO — asymmetric grid with filters
   ============================================================ */
// TODO: CONFIRM PROJECT TYPES WITH CLIENT — types below are provisional
const PROJECTS = [
  // TODO: REPLACE WITH ACTUAL PROJECT PHOTO (all images below)
  { name: 'Victory Rd', postcode: 'SW19', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85', span: 'md:col-span-2 md:row-span-2' },
  { name: 'Ridgway Place', postcode: 'SW19', type: 'Wraparound', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=85', span: '' },
  { name: 'Falcon Grove', postcode: 'SW11', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=85', span: 'md:row-span-2' },
  { name: 'Church Meadow', postcode: 'KT6', type: 'New Builds', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1800&q=85', span: '' },
  { name: 'Milkwood Road', postcode: 'SE24', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1800&q=85', span: '' },
  { name: 'Wandsworth Common', postcode: 'SW18', type: 'Wraparound', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=85', span: 'md:col-span-2' },
  { name: 'Marian Road', postcode: 'SW16', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=85', span: '' },
  { name: 'Sudlow Road', postcode: 'SW18', type: 'Loft Conversions', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=85', span: 'md:row-span-2' },
  { name: 'Deepdene Road', postcode: 'SE5', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1800&q=85', span: '' },
  { name: 'Eversleigh Road', postcode: 'SW11', type: 'Loft Conversions', img: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1800&q=85', span: '' },
  { name: "St John's Hill", postcode: 'SW4', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=85', span: 'md:col-span-2' },
  { name: 'Kelso Place', postcode: 'W8', type: 'Wraparound', img: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1800&q=85', span: '' },
  { name: 'Walton-on-Thames', postcode: 'KT12', type: 'Rear Extensions', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1800&q=85', span: '' },
]

const FILTERS = ['All', 'Rear Extensions', 'Loft Conversions', 'Wraparound', 'New Builds']

function Portfolio() {
  const [filter, setFilter] = useState('All')
  const projects = useMemo(
    () => (filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.type === filter)),
    [filter],
  )

  return (
    <section id="projects" className="bg-navy-deep px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest2 text-amber">Recent Work</p>
        <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
          The projects that made us London's trusted extension builders
        </h2>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by type">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                filter === f
                  ? 'bg-amber text-navy'
                  : 'border border-cream/20 text-cream/70 hover:border-amber hover:text-amber'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[230px] md:grid-cols-4 md:[grid-auto-flow:dense]">
          <AnimatePresence mode="popLayout">
            {projects.map((project, i) => (
              <motion.figure
                layout
                key={`${project.name}-${project.postcode}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-xl ${project.span}`}
              >
                <img
                  src={project.img}
                  alt={`${project.type} project at ${project.name}, ${project.postcode}, by 30 Day Extensions`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-navy via-navy/90 to-transparent p-5 pt-12 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <p className="font-display text-xl font-semibold text-cream">{project.name}</p>
                  <p className="text-sm font-bold text-amber">
                    {project.postcode} · {project.type}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-lg text-cream/70">
            200+ completed projects across South London and Surrey.{' '}
            <strong className="text-cream">Every one delivered on time.</strong>
          </p>
          <button
            type="button"
            onClick={() => scrollToSection('areas')}
            className="group flex items-center gap-2 text-sm font-bold text-amber transition-colors hover:text-amber-light"
          >
            View All Projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   VIDEO — real proof content
   ============================================================ */
function VideoSection() {
  return (
    <section className="bg-navy px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest2 text-amber">Watch the Proof</p>
        <h2 className="font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
          See the 30-Day Build in Action
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/65">
          This is our biggest house extension of 2024. Watch the full build from groundworks to
          handover.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 overflow-hidden rounded-2xl border border-cream/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/OUvMj-t4Ol8"
              title="30 Day Extensions Biggest House Extension 2024"
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   PROCESS — horizontal scroll timeline
   ============================================================ */
const STAGES = [
  {
    num: '01',
    title: 'Free Consultation',
    copy: 'No obligation. No hard sell. We assess your home and give you a real number.',
  },
  {
    num: '02',
    title: 'Architecture & Planning',
    copy: 'Our in-house architects handle drawings and planning permission. FREE.',
  },
  {
    num: '03',
    title: 'The 30-Day Build',
    copy: "Crews on site at 8am every day. Shell watertight in 30 days. You'll see it happen.",
  },
  {
    num: '04',
    title: 'Handover & Finish',
    copy: 'Full fit-out to a standard that makes the before photos look like a different property.',
  },
]

function Process({ isDesktop, reduced }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const horizontal = isDesktop && !reduced

  useEffect(() => {
    if (!horizontal) return
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const amount = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -amount(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${amount()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length))
            setActive(idx)
          },
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [horizontal])

  return (
    <section id="process" ref={sectionRef} className="overflow-hidden bg-navy-deep">
      <div className={horizontal ? 'flex h-screen flex-col justify-center' : 'px-5 py-24 md:px-8'}>
        <div className={`mx-auto w-full max-w-7xl ${horizontal ? 'px-8' : ''}`}>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest2 text-amber">How It Works</p>
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
            Four stages. Zero surprises.
          </h2>
        </div>

        <div
          ref={trackRef}
          className={
            horizontal
              ? 'mt-14 flex w-max gap-8 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-[40vw]'
              : 'mx-auto mt-12 flex max-w-7xl flex-col gap-6 md:flex-row md:flex-wrap'
          }
        >
          {STAGES.map((stage, i) => (
            <motion.article
              key={stage.num}
              initial={horizontal ? false : { opacity: 0, y: 30 }}
              whileInView={horizontal ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl border p-9 transition-colors duration-500 ${
                horizontal ? 'w-[34rem] max-w-[80vw] shrink-0' : 'md:flex-1 md:min-w-[260px]'
              } ${
                horizontal && active === i
                  ? 'border-amber bg-navy-mid'
                  : 'border-cream/10 bg-navy'
              }`}
            >
              <p
                className={`font-display text-7xl font-bold transition-colors duration-500 ${
                  horizontal && active === i ? 'text-amber' : 'text-cream/15'
                }`}
              >
                {stage.num}
              </p>
              <h3 className="mt-5 font-display text-3xl font-semibold text-cream">{stage.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-cream/65">{stage.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   TESTIMONIALS — paraphrased from real MyBuilder reviews
   ============================================================ */
// Paraphrased from genuine MyBuilder reviews of 30 Day Extensions Ltd.
// TODO: REPLACE NAMES/POSTCODES WITH VERIFIED DETAILS FROM MYBUILDER PROFILE
const TESTIMONIALS = [
  {
    name: 'Sarah',
    project: 'Side Return Extension',
    area: 'SW11',
    quote:
      'They really do build to shell in 30 working days. Far quicker than anyone else who quoted — and the site was left tidy every single evening.',
  },
  {
    name: 'James',
    project: 'Rear Extension',
    area: 'SE24',
    quote:
      'Delivered on time and pretty much on budget, despite complications nobody could have predicted. The team worked like trojans — professional and respectful throughout.',
  },
  {
    name: 'Helen',
    project: 'Loft Conversion',
    area: 'KT12',
    quote:
      'Efficient, resourceful and always available. They started when they said they would, six days a week, and finished exactly when promised.',
  },
]

function Testimonials({ reduced }) {
  return (
    <section id="reviews" className="bg-navy px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" aria-hidden="true" />
              ))}
              <span className="ml-1 text-xs font-bold uppercase tracking-widest2">
                Rated Excellent on MyBuilder
              </span>
            </div>
            <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
              Why South London &amp; Surrey homeowners trust us
            </h2>
          </div>
          <FmbBadge />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-cream/10 bg-navy-mid p-8"
            >
              <motion.div
                animate={reduced ? undefined : { y: [0, -7, 0] }}
                transition={
                  reduced
                    ? undefined
                    : { duration: 5.5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }
                }
              >
                <p className="text-lg leading-relaxed text-cream/85">"{t.quote}"</p>
                <footer className="mt-6 border-t border-cream/10 pt-5">
                  <p className="font-bold text-cream">{t.name}</p>
                  <p className="text-sm text-amber">
                    {t.project} · {t.area}
                  </p>
                </footer>
              </motion.div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FINAL CTA — conversion
   ============================================================ */
function FinalCta() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
      {/* TODO: REPLACE WITH ACTUAL PROJECT PHOTO */}
      <img
        src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1800&q=85"
        alt="South London terraced street at dusk, home extension territory"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-navy/90" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl font-display text-4xl font-semibold leading-tight text-cream md:text-6xl"
        >
          Your neighbours are already extending.{' '}
          <span className="text-amber">Don't get left behind.</span>
        </motion.h2>
        <p className="mt-5 max-w-xl text-lg text-cream/70">
          Probably already built in your road. Definitely can build in your home.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <a href="tel:07923123058" className="group flex items-center gap-4 text-cream transition-colors hover:text-amber">
              <span className="rounded-full bg-amber/10 p-3.5 text-amber transition-colors group-hover:bg-amber group-hover:text-navy">
                <Phone size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest2 text-cream/50">Call us</span>
                <span className="text-xl font-bold">07923 123058</span>
              </span>
            </a>
            <a href="mailto:info@30day.build" className="group flex items-center gap-4 text-cream transition-colors hover:text-amber">
              <span className="rounded-full bg-amber/10 p-3.5 text-amber transition-colors group-hover:bg-amber group-hover:text-navy">
                <Mail size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest2 text-cream/50">Email us</span>
                <span className="text-xl font-bold">info@30day.build</span>
              </span>
            </a>
            <a
              href="https://maps.google.com/?q=142+Merton+Road,+London,+SW19+1EH"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-cream transition-colors hover:text-amber"
            >
              <span className="rounded-full bg-amber/10 p-3.5 text-amber transition-colors group-hover:bg-amber group-hover:text-navy">
                <MapPin size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest2 text-cream/50">Visit the shop</span>
                <span className="text-xl font-bold">142 Merton Road, London SW19 1EH</span>
              </span>
            </a>
            <a
              href="https://wa.me/447999914552"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-cream transition-colors hover:text-amber"
            >
              <span className="rounded-full bg-amber/10 p-3.5 text-amber transition-colors group-hover:bg-amber group-hover:text-navy">
                <WhatsAppIcon size={22} />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest2 text-cream/50">WhatsApp us</span>
                <span className="text-xl font-bold">Message the team directly</span>
              </span>
            </a>

            <div className="mt-4">
              <FmbBadge />
            </div>
          </div>

          <div className="rounded-2xl border border-cream/15 bg-navy-deep/80 p-8 backdrop-blur md:p-10">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={52} className="text-amber" aria-hidden="true" />
                <p className="mt-6 font-display text-3xl font-semibold text-cream">Got it.</p>
                <p className="mt-3 max-w-sm text-cream/70">
                  We'll call you back within one working day with a real number — no obligation, no
                  hard sell.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="flex flex-col gap-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-bold text-cream/80">
                    Name
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      className="rounded-lg border border-cream/20 bg-navy px-4 py-3 font-normal text-cream placeholder-cream/30 outline-none transition-colors focus:border-amber"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-bold text-cream/80">
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      className="rounded-lg border border-cream/20 bg-navy px-4 py-3 font-normal text-cream placeholder-cream/30 outline-none transition-colors focus:border-amber"
                      placeholder="07xxx xxxxxx"
                    />
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-bold text-cream/80">
                    Postcode
                    <input
                      type="text"
                      name="postcode"
                      required
                      autoComplete="postal-code"
                      className="rounded-lg border border-cream/20 bg-navy px-4 py-3 font-normal text-cream placeholder-cream/30 outline-none transition-colors focus:border-amber"
                      placeholder="e.g. SW19"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-bold text-cream/80">
                    Project Type
                    <select
                      name="projectType"
                      required
                      defaultValue=""
                      className="rounded-lg border border-cream/20 bg-navy px-4 py-3 font-normal text-cream outline-none transition-colors focus:border-amber"
                    >
                      <option value="" disabled>
                        Select a project type
                      </option>
                      <option>Rear Extension</option>
                      <option>Loft Conversion</option>
                      <option>Wraparound Extension</option>
                      <option>New Build</option>
                      <option>Architecture &amp; Planning</option>
                      <option>Internal Refurbishment</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm font-bold text-cream/80">
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    className="rounded-lg border border-cream/20 bg-navy px-4 py-3 font-normal text-cream placeholder-cream/30 outline-none transition-colors focus:border-amber"
                    placeholder="Tell us about your home and what you want to do with it"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 rounded-full bg-amber px-7 py-4 text-sm font-bold text-navy transition-colors hover:bg-amber-light"
                >
                  Request Your Free Quote
                </button>
                <p className="text-center text-sm text-cream/55">
                  No obligation. No hard sell. We'll call you back within one working day.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FOOTER
   ============================================================ */
const FOOTER_AREAS =
  'Clapham SW11 · Battersea SW11 · Wimbledon SW19 · Merton SW19 · Streatham SW16 · Balham SW12 · Tooting SW17 · Kingston KT1 · Surbiton KT6 · Dulwich SE22 · Forest Hill SE23 · Sutton SM1'

function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-navy-deep px-5 pb-28 pt-16 md:px-8 md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo onNavigate={scrollToSection} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">
            A watertight shell finish completed in 30 days. Our teams are on site and ready to
            start at 8am.
          </p>
          <div className="mt-6">
            <FmbBadge />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest2 text-amber">Contact</h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-cream/70">
            <li>
              <a href="tel:07923123058" className="transition-colors hover:text-amber">
                07923 123058
              </a>
            </li>
            <li>
              <a href="mailto:info@30day.build" className="transition-colors hover:text-amber">
                info@30day.build
              </a>
            </li>
            <li className="leading-relaxed">
              30 Day Extensions Ltd
              <br />
              142 Merton Road
              <br />
              London, SW19 1EH
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="30 Day Extensions on Instagram"
              className="rounded-full border border-cream/20 p-2.5 text-cream/70 transition-colors hover:border-amber hover:text-amber"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="30 Day Extensions on Facebook"
              className="rounded-full border border-cream/20 p-2.5 text-cream/70 transition-colors hover:border-amber hover:text-amber"
            >
              <Facebook size={18} aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/447999914552"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message 30 Day Extensions on WhatsApp"
              className="rounded-full border border-cream/20 p-2.5 text-cream/70 transition-colors hover:border-amber hover:text-amber"
            >
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest2 text-amber">The 30 Day Group</h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-cream/70">
            <li>30 Day Extensions Ltd</li>
            <li>20 Day Lofts</li>
            <li>House Extension Shop</li>
            <li>30 Day Architecture Ltd</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest2 text-amber">Areas We Cover</h3>
          <p className="mt-5 text-sm leading-relaxed text-cream/55">{FOOTER_AREAS}</p>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-cream/10 pt-7 text-xs text-cream/40 md:flex-row md:items-center">
        <p>© 2025 30 Day Extensions Ltd. Registered in England &amp; Wales.</p>
        <p className="font-semibold uppercase tracking-widest2 text-amber/70">Time is Money</p>
      </div>
    </footer>
  )
}

/* ============================================================
   STICKY ELEMENTS
   ============================================================ */
function WhatsAppIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function StickyElements() {
  return (
    <>
      {/* WhatsApp — their highest-converting asset, always visible */}
      <a
        href="https://wa.me/447999914552"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp 30 Day Extensions"
        className="fixed bottom-20 left-4 z-[95] flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 md:bottom-6 md:left-6"
      >
        <WhatsAppIcon size={26} />
      </a>

      {/* Mobile call bar */}
      <a
        href="tel:07923123058"
        className="fixed inset-x-0 bottom-0 z-[90] flex items-center justify-center gap-2 bg-amber py-3.5 text-sm font-bold text-navy md:hidden"
      >
        <Phone size={16} aria-hidden="true" /> Call Now — 07923 123058
      </a>

      {/* InteliSite demo watermark */}
      <a
        href="https://intelisite.space"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 right-3 z-[100] rounded-full bg-navy/50 px-3.5 py-1.5 font-body text-[11px] text-white/55 backdrop-blur transition-colors hover:text-white/90 md:bottom-3"
      >
        Demo built by InteliSite — intelisite.space
      </a>
    </>
  )
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const isDesktop = useMedia('(min-width: 768px)')
  const reducedMq = useMedia('(prefers-reduced-motion: reduce)')
  const reducedFm = useReducedMotion()
  const reduced = reducedMq || !!reducedFm

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [reduced])

  return (
    <div className="min-h-screen bg-navy font-body text-cream">
      <Nav />
      <main>
        <Hero isDesktop={isDesktop} reduced={reduced} />
        <TrustBar />
        <ProblemPromise isDesktop={isDesktop} reduced={reduced} />
        <StatsRow reduced={reduced} />
        <Promise30 />
        <Services isDesktop={isDesktop} reduced={reduced} />
        <ProximityMap />
        <Portfolio />
        <VideoSection />
        <Process isDesktop={isDesktop} reduced={reduced} />
        <Testimonials reduced={reduced} />
        <FinalCta />
      </main>
      <Footer />
      <StickyElements />
    </div>
  )
}
