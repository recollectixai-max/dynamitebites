import { useId } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

/**
 * Single-product hero: oversized headline sits at the back, a tilted ribbon
 * runs across it, and ONE hero product breaks out in front of both.
 *
 * Usage:
 *   <Hero />                                         -> uses the built-in SVG donut
 *   <Hero productSrc="/hero-croissant.png" />        -> use your own transparent PNG/WebP cut-out
 *
 * Needs: react-router-dom, framer-motion, lucide-react, Tailwind.
 * Colours read the CSS variables from index.css (with fallbacks), fonts use `font-display`.
 */

const COPY = {
  line1: 'BOLD BITES',
  line2: 'BIG FLAVOUR',
  ribbon: ['Freshly made', 'Packed with flavour', 'Made to crave'],
  stamp: 'Big cravings deserve bold bites',
  blurb: 'From crispy favourites to flavour-packed creations, every bite brings a little extra excitement.',
  cta: 'Order now',
  ctaTo: '/#menu',
}

const C = {
  bg: 'var(--color-bg, #fff3e0)',
  ink: 'var(--color-text, #3a1d12)',
  pink: 'var(--color-primary, #f0577f)',
  yellow: 'var(--color-accent, #ffc24b)',
  mint: 'var(--color-mint, #bfe8d4)',
}

/* ---------- Built-in hero product: illustrated glazed donut (swap with productSrc) ---------- */

const CX = 200
function blob(base, waves, steps = 160) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = base + waves.reduce((s, [a, f, p]) => s + a * Math.sin(f * t + p), 0)
    d += `${i ? 'L' : 'M'}${(CX + r * Math.cos(t)).toFixed(1)} ${(CX + r * Math.sin(t)).toFixed(1)}`
  }
  return d + 'Z'
}

const DOUGH_PATH = blob(172, [[2, 5, 0]]) + blob(52, [[1.5, 4, 1]])
const GLAZE_PATH = blob(142, [[7, 9, 0], [4, 5, 1], [3, 13, 2]]) + blob(68, [[3, 6, 0]])

const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647
const rnd = seeded(42)
const SPRINKLE_COLORS = ['#fff3e0', '#ffc24b', '#bfe8d4', '#3a1d12', '#ffffff']
const SPRINKLES = Array.from({ length: 42 }, (_, i) => {
  const t = rnd() * Math.PI * 2
  const r = 84 + rnd() * 46
  return {
    x: CX + r * Math.cos(t),
    y: CX + r * Math.sin(t),
    rot: rnd() * 180,
    color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
  }
})

const HIGHLIGHT = (() => {
  const pt = (deg, r) => {
    const a = (deg * Math.PI) / 180
    return `${(CX + r * Math.cos(a)).toFixed(1)} ${(CX + r * Math.sin(a)).toFixed(1)}`
  }
  return `M${pt(-155, 108)} A108 108 0 0 1 ${pt(-95, 108)}`
})()

function DonutArt() {
  const gid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Glazed pink donut with sprinkles" className="h-full w-full">
      <defs>
        <radialGradient id={`${gid}-dough`} cx="50%" cy="50%" r="50%">
          <stop offset="0.3" stopColor="#f6c987" />
          <stop offset="0.75" stopColor="#e9a255" />
          <stop offset="1" stopColor="#c27a32" />
        </radialGradient>
        <radialGradient id={`${gid}-glaze`} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ff9db8" />
          <stop offset="1" stopColor="#f0577f" />
        </radialGradient>
      </defs>
      <path d={DOUGH_PATH} fillRule="evenodd" fill={`url(#${gid}-dough)`} />
      <path d={GLAZE_PATH} fillRule="evenodd" fill={`url(#${gid}-glaze)`} stroke="#d93e68" strokeOpacity="0.45" strokeWidth="2" />
      <path d={HIGHLIGHT} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="10" strokeLinecap="round" />
      {SPRINKLES.map((s, i) => (
        <rect
          key={i}
          x="-9"
          y="-3"
          width="18"
          height="6"
          rx="3"
          fill={s.color}
          transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(0)})`}
        />
      ))}
    </svg>
  )
}

/* ---------- Decorative pieces ---------- */

function Star4({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z" />
    </svg>
  )
}

// Ticket with scalloped (punched) edges.
function Stamp({ children, className = '' }) {
  const id = useId().replace(/:/g, '')
  const W = 220
  const H = 150
  const gap = 22
  const holes = []
  for (let x = gap / 2; x < W; x += gap) holes.push([x, 0], [x, H])
  for (let y = gap / 2; y < H; y += gap) holes.push([0, y], [W, y])
  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden="true">
        <defs>
          <mask id={id}>
            <rect width={W} height={H} fill="#fff" />
            {holes.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="7" fill="#000" />
            ))}
          </mask>
        </defs>
        <rect width={W} height={H} fill={C.yellow} mask={`url(#${id})`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center px-8 text-center font-display text-[clamp(0.85rem,1.9vw,1.35rem)] font-extrabold uppercase leading-[0.95]">
        {children}
      </div>
    </div>
  )
}

function Flower({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <circle key={i} cx={60 + 36 * Math.cos(a)} cy={60 + 36 * Math.sin(a)} r="22" fill={C.mint} />
      })}
      <circle cx="60" cy="60" r="34" fill={C.mint} />
      <circle cx="60" cy="60" r="12" fill="none" stroke={C.ink} strokeWidth="4" />
      <circle cx="60" cy="60" r="3.5" fill={C.ink} />
    </svg>
  )
}

const BITS = [
  { left: '22%', top: '34%', w: 26, h: 9, color: C.yellow, rot: 25, delay: 0 },
  { left: '71%', top: '26%', w: 22, h: 8, color: C.mint, rot: -35, delay: 0.8 },
  { left: '80%', top: '55%', w: 18, h: 18, color: C.ink, rot: 0, delay: 1.4, round: true },
  { left: '15%', top: '62%', w: 20, h: 20, color: C.ink, rot: 0, delay: 0.4, round: true },
  { left: '33%', top: '78%', w: 24, h: 8, color: C.pink, rot: 60, delay: 1.1 },
  { left: '64%', top: '80%', w: 26, h: 9, color: C.yellow, rot: -20, delay: 0.6 },
]

/* ---------- Hero ---------- */

export default function Hero({ productSrc, productAlt = 'Our hero pastry' }) {
  const reduce = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1]
  const ribbonGroup = Array.from({ length: 3 }).flatMap(() => COPY.ribbon)

  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-3 pb-24 pt-28"
      style={{ background: C.bg, color: C.ink }}
    >
      {/* 1 · Headline (back layer) */}
      <h1 className="relative z-0 text-center font-display text-[14.5vw] font-extrabold uppercase leading-[1.2] tracking-[0.02em] text-[clamp(5rem,12vw,10rem)] md:text-[clamp(5.5rem,10vw,10.5rem)]">
        {[COPY.line1, COPY.line2].map((line, i) => (
          <span key={line} className="block overflow-hidden py-[0.03em]">
            <motion.span
              className="block"
              initial={reduce ? false : { y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* 2 · Tilted ribbon (middle layer) */}
      <div className="pointer-events-none absolute left-[-6%] top-[54%] z-10 w-[112%] -rotate-[5deg]">
        <motion.div
          initial={reduce ? false : { x: '-30%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="overflow-hidden whitespace-nowrap"
          style={{ background: C.pink }}
        >
          <motion.div
            className="flex w-max items-center py-3 md:py-4"
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
          >
            {[0, 1].map((g) => (
              <div key={g} className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12" aria-hidden={g === 1}>
                {ribbonGroup.map((word, i) => (
                  <span key={i} className="flex items-center gap-8 font-display text-[clamp(1.4rem,4vw,3.4rem)] font-extrabold uppercase leading-none md:gap-12">
                    {word}
                    <Star4 className="h-[0.8em] w-[0.8em]" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 3 · The one hero product (front layer) */}
      <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center pt-24">
        <motion.div
          initial={reduce ? false : { y: -420, rotate: -40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, rotate: -12, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 11, delay: 0.55 }}
          className="w-[min(78vw,620px)]"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -16, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
            className="aspect-square w-full"
            style={{ filter: 'drop-shadow(0 34px 28px rgba(58,29,18,0.28))' }}
          >
            {productSrc ? (
              <img src={productSrc} alt={productAlt} className="h-full w-full object-contain" />
            ) : (
              <DonutArt />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* 4 · Stickers + floating bits */}
      <motion.div
        initial={reduce ? false : { scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: -8 }}
        transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 1.1 }}
        className="absolute left-[4%] top-[17%] z-30 w-[clamp(9.5rem,24vw,19rem)] md:left-[11%] md:top-[15%]"
      >
        <Stamp>{COPY.stamp}</Stamp>
      </motion.div>

      <motion.div
        initial={reduce ? false : { scale: 0, rotate: 90 }}
        animate={reduce ? { scale: 1 } : { scale: 1, rotate: 360 }}
        transition={{
          scale: { type: 'spring', delay: 1.3 },
          rotate: reduce ? undefined : { duration: 40, ease: 'linear', repeat: Infinity },
        }}
        className="absolute bottom-[12%] right-[4%] z-30 w-[clamp(5.5rem,13vw,10.5rem)] md:right-[8%]"
      >
        {/* <Flower className="block w-full" /> */}
      </motion.div>

      {BITS.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute z-30 block"
          style={{
            left: b.left,
            top: b.top,
            width: b.w,
            height: b.h,
            background: b.color,
            borderRadius: b.round ? '50%' : 999,
            rotate: b.rot,
          }}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: 1.2 + b.delay * 0.3 },
            scale: { delay: 1.2 + b.delay * 0.3, type: 'spring' },
            y: { duration: 4 + b.delay, ease: 'easeInOut', repeat: Infinity, delay: b.delay },
          }}
        />
      ))}

      {/* 5 · Small call-to-action */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-7 left-5 z-40 flex max-w-[17rem] flex-col items-start gap-4 md:bottom-10 md:left-12"
      >
        <p className="text-sm font-medium leading-snug md:text-base">{COPY.blurb}</p>
        <Link
          to={COPY.ctaTo}
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition hover:brightness-125 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4"
          style={{ background: C.ink, outlineColor: C.pink }}
        >
          {COPY.cta} <ArrowUpRight size={18} />
        </Link>
      </motion.div>
    </section>
  )
}
