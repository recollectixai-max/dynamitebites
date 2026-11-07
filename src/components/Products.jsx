import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/**
 * Products section: big headline + label badge, scalloped arrow buttons, and a
 * scroll-snap carousel of colour-block cards. Each product "pops" out of the
 * top of its card.
 *
 * Usage:
 *   <Products />                                  -> uses the built-in illustrated products
 *   <Products items={myItems} title="Our goodies" />
 *
 * To use real photography, give an item an `image` (transparent PNG/WebP cut-out):
 *   { name: 'Pistachio Roll', price: 5.5, bg: '#bfe8d4', image: '/pistachio-roll.png' }
 * Items without `image` fall back to an illustration via `kind`:
 *   'cupcake' | 'drink' | 'donut' | 'slice'
 *
 * Needs: react-router-dom, framer-motion, lucide-react, Tailwind, and the `font-display` class.
 */

const INK = 'var(--color-text, #3a1d12)'
const BG = 'var(--color-bg, #fff3e0)'

const ITEMS = [
  { name: 'Dynamite Chicken', price: 42, kind: 'cupcake', bg: '#ffa3b9', a: '#f0577f', b: '#b3234f', image: '/d-chicken.png' },
  { name: 'Dynamite Shrimps', price: 49, kind: 'drink', bg: '#bfe8d4', a: '#d99a5b', b: '#f0577f', image: '/main-p.png' },
  { name: 'Dynamite Chicken', price: 42, kind: 'donut', bg: '#ffd966', a: '#f0577f', b: '#fff3e0', image: '/d-chicken.png' },
  { name: 'Dynamite Shrimps', price: 49, kind: 'slice', bg: '#d6c8f7', a: '#ff9bb5', b: '#3a1d12', image: '/main-p.png' },
  { name: 'Dynamite Chicken', price: 42, kind: 'cupcake', bg: '#ffc7a1', a: '#fff3e0', b: '#7a4a2b', image: '/d-chicken.png' },
  { name: 'Dynamite Shrimps', price: 49, kind: 'drink', bg: '#ffa3b9', a: '#e0a35f', b: '#3a1d12', image: '/main-p.png' },
]

/* ------------------------------------------------------------------ */
/* Illustrated products (viewBox 200 x 220). Replace via `image` prop. */
/* ------------------------------------------------------------------ */

function blob(cx, cy, base, waves = [], steps = 120) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = base + waves.reduce((s, [amp, freq, phase]) => s + amp * Math.sin(freq * t + phase), 0)
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`
  }
  return d + 'Z'
}

const DONUT_DOUGH = blob(100, 112, 86, [[1.5, 5, 0]]) + blob(100, 112, 26, [[1, 4, 1]])
const DONUT_GLAZE = blob(100, 112, 72, [[5, 9, 0], [3, 5, 1]]) + blob(100, 112, 34, [[2, 6, 0]])
const DONUT_SPRINKLES = (() => {
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 22 }, (_, i) => {
    const t = rnd() * Math.PI * 2
    const r = 42 + rnd() * 24
    return { x: 100 + r * Math.cos(t), y: 112 + r * Math.sin(t), rot: rnd() * 180, c: ['#fff3e0', '#ffc24b', '#bfe8d4', '#3a1d12'][i % 4] }
  })
})()

function Cupcake({ a, b }) {
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      <path d="M44 118 L156 118 L141 204 Q140 212 131 212 L69 212 Q60 212 59 204 Z" fill={b} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${64 + i * 10.5} 124 L${64 + i * 10.5 + (i - 3.5) * 1.6} 208`} stroke="#000" strokeOpacity=".16" strokeWidth="3" strokeLinecap="round" />
      ))}
      <ellipse cx="100" cy="118" rx="58" ry="13" fill="#e9b36f" />
      <ellipse cx="100" cy="104" rx="56" ry="22" fill={a} />
      <ellipse cx="100" cy="82" rx="43" ry="19" fill={a} />
      <ellipse cx="100" cy="62" rx="30" ry="15" fill={a} />
      <path d="M100 38C113 46 109 57 100 59C91 57 87 46 100 38Z" fill={a} />
      <g fill="none" stroke="#000" strokeOpacity=".12" strokeWidth="3" strokeLinecap="round">
        <path d="M46 108Q100 132 154 108" />
        <path d="M60 86Q100 104 140 86" />
        <path d="M72 66Q100 80 128 66" />
      </g>
      <path d="M62 98Q70 90 84 92" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="30" r="10" fill="#d62839" />
      <circle cx="97" cy="27" r="3" fill="#fff" opacity=".65" />
    </svg>
  )
}

const GLASS = 'M46 38L154 38L142 200Q141 212 129 212L71 212Q59 212 58 200Z'

function Drink({ a, b }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d={GLASS} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="40" y="36" width="120" height="180" fill="#fff" fillOpacity=".3" />
        <rect x="40" y="120" width="120" height="100" fill="#fbf1e3" />
        <path d="M40 116Q70 94 100 110T160 102V132Q130 144 100 130T40 136Z" fill={a} />
        <rect x="40" y="62" width="120" height="48" fill="#4b2a1a" />
        <rect x="40" y="38" width="120" height="28" fill="#c98b55" />
        {[[58, 44, -14], [96, 38, 12], [128, 52, -6]].map(([x, y, r], i) => (
          <rect key={i} x={x} y={y} width="30" height="30" rx="6" fill="#fff" fillOpacity=".5" stroke="#fff" strokeOpacity=".9" strokeWidth="2" transform={`rotate(${r} ${x + 15} ${y + 15})`} />
        ))}
      </g>
      <line x1="124" y1="6" x2="100" y2="150" stroke={b} strokeWidth="9" strokeLinecap="round" />
      <path d={GLASS} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="4" />
      <path d="M64 76L69 188" stroke="#fff" strokeOpacity=".55" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function Donut({ a, b }) {
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      <g transform="rotate(-8 100 112)">
        <path d={DONUT_DOUGH} fillRule="evenodd" fill="#eaa458" />
        <path d={DONUT_GLAZE} fillRule="evenodd" fill={a} />
        <path d="M44 96A60 60 0 0 1 90 54" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="6" strokeLinecap="round" />
        {DONUT_SPRINKLES.map((s, i) => (
          <rect key={i} x="-7" y="-2.5" width="14" height="5" rx="2.5" fill={i % 5 === 0 ? b : s.c} transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(0)})`} />
        ))}
      </g>
    </svg>
  )
}

function Slice({ a, b }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="30" y="118" width="140" height="90" rx="8" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="30" y="176" width="140" height="34" fill="#5a2f1b" />
        <rect x="30" y="146" width="140" height="30" fill={a} />
        <rect x="30" y="134" width="140" height="12" fill="#fff3e0" />
        <rect x="30" y="118" width="140" height="16" fill={b} />
      </g>
      <path d="M50 130v28q0 8 7 8t7-8v-28ZM128 130v40q0 9 8 9t8-9v-40Z" fill={b} />
      <ellipse cx="100" cy="112" rx="50" ry="14" fill="#fff6e8" />
      <ellipse cx="100" cy="94" rx="40" ry="14" fill="#fff6e8" />
      <ellipse cx="100" cy="76" rx="28" ry="12" fill="#fff6e8" />
      <path d="M100 56C110 62 107 70 100 72C93 70 90 62 100 56Z" fill="#fff6e8" />
      <g fill={b}>
        <polygon points="62,96 78,70 90,92" />
        <polygon points="112,86 134,64 140,92" />
        <polygon points="86,70 96,48 108,72" />
      </g>
      <g fill="none" stroke="#000" strokeOpacity=".08" strokeWidth="3" strokeLinecap="round">
        <path d="M54 104Q100 124 146 104" />
        <path d="M66 86Q100 102 134 86" />
      </g>
    </svg>
  )
}

const ART = { cupcake: Cupcake, drink: Drink, donut: Donut, slice: Slice }

/* ------------------------------------------------------------------ */
/* Decorative shapes                                                   */
/* ------------------------------------------------------------------ */

// Scalloped flower-shaped icon button background.
function FlowerShape() {
  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i / 9) * Math.PI * 2
        return <circle key={i} cx={60 + 34 * Math.cos(t)} cy={60 + 34 * Math.sin(t)} r="22" fill="#fff" />
      })}
      <circle cx="60" cy="60" r="36" fill="#fff" />
    </svg>
  )
}

// Wavy-edged label badge.
function ScallopBadge({ children, className = '' }) {
  const W = 150
  const H = 46
  const r = 7
  const nx = Math.round((W - 2 * r) / 15)
  const ny = Math.round((H - 2 * r) / 15)
  const dots = []
  for (let i = 0; i <= nx; i++) {
    const x = r + (i * (W - 2 * r)) / nx
    dots.push([x, r], [x, H - r])
  }
  for (let j = 0; j <= ny; j++) {
    const y = r + (j * (H - 2 * r)) / ny
    dots.push([r, y], [W - r, y])
  }
  return (
    <div className={`relative ${className}`} style={{ width: W, height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0" aria-hidden="true">
        <rect x={r} y={r} width={W - 2 * r} height={H - 2 * r} fill="#bfdcff" />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#bfdcff" />
        ))}
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-extrabold uppercase" style={{ color: INK }}>
        {children}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export default function Products({
  items = ITEMS,
  title = 'Fresh picks',
  label = "Today's trays",
  currency = 'AED',
  orderTo = '/contact',
}) {
  const reduce = useReducedMotion()
  const scroller = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const measure = () => {
    const el = scroller.current
    if (!el) return
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items])

  const go = (dir) => {
    const el = scroller.current
    if (!el) return
    const card = el.firstElementChild
    const step = (card ? card.getBoundingClientRect().width : 300) + 24
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  const arrowBtn = (dir, Icon, disabled) => (
    <button
      type="button"
      onClick={() => go(dir)}
      disabled={disabled}
      aria-label={dir < 0 ? 'Previous products' : 'Next products'}
      className="group relative grid h-[4.5rem] w-[4.5rem] place-items-center transition-transform enabled:hover:scale-110 enabled:active:scale-95 disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 md:h-24 md:w-24"
      style={{ color: INK, outlineColor: INK }}
    >
      <FlowerShape />
      <Icon className="relative transition-transform group-enabled:group-hover:scale-110" size={26} strokeWidth={2.5} />
    </button>
  )

  return (
    <section id="products" className="relative overflow-hidden py-20 md:py-28" style={{ background: BG, color: INK }}>
      <div className="mx-auto max-w-[96rem] px-5 md:px-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div className="relative">
            <ScallopBadge className="absolute -top-5 left-[6%] z-10 -rotate-[4deg]">{label}</ScallopBadge>
            <h2 className="font-display text-[clamp(3.5rem,11vw,9.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.02em]">
              {title}
            </h2>
          </div>
          <div className="flex shrink-0 gap-1 md:gap-3">
            {arrowBtn(-1, ArrowLeft, edge.start)}
            {arrowBtn(1, ArrowRight, edge.end)}
          </div>
        </div>
      </div>

      {/* Carousel — top padding leaves room for products that pop out of the cards */}
      <div
        ref={scroller}
        onScroll={measure}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-6 pt-28 md:px-10"
        style={{ scrollPaddingInline: '2.5rem' }}
      >
        {items.map((it, i) => {
          const Art = ART[it.kind] || ART.cupcake
          return (
            <motion.article
              key={`${it.name}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: Math.min(i, 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex h-[22rem] w-[17.5rem] shrink-0 snap-start flex-col justify-end rounded-[1.4rem] p-5 md:h-[23rem] md:w-[18.75rem]"
              style={{ background: it.bg }}
            >
              {/* Product pops out of the card top */}
              <motion.div
                // whileHover={reduce ? undefined : { y: -10, rotate: -4, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                className="absolute hover:scale-2 -top-20 left-1/2 aspect-[200/220] w-[84%] -translate-x-1/2"
                style={{ filter: 'drop-shadow(0 18px 16px rgba(58,29,18,0.22))' }}
              >
                {it.image ? (
                  <img src={it.image} alt={it.name} className="h-[100%] w-[100%] object-contain" loading="lazy" />
                ) : (
                  <Art a={it.a} b={it.b} />
                )}
              </motion.div>

              <h3 className="font-display text-[1.7rem] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] md:text-[1.85rem]">
                {it.name}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  to={it.to || orderTo}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold uppercase transition hover:gap-3 hover:bg-[var(--color-text,#3a1d12)] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
                  style={{ outlineColor: INK }}
                  aria-label={`Order ${it.name}`}
                >
                  Order now <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <span className="text-sm font-medium tabular-nums">
                  {currency} &nbsp;
                  {Number(it.price).toFixed(2)}
                </span>
              </div>
            </motion.article>
          )
        })}
        {/* trailing spacer so the last card can snap fully into view */}
        <div className="w-px shrink-0 md:w-10" aria-hidden="true" />
      </div>
    </section>
  )
}
