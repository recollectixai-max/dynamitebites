import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'

/**
 * "Pick your favourite" section: centred headline, a three-up product stage
 * (previous · ACTIVE · next) where each product sits on its own coloured shape,
 * and a control bar with flower-shaped arrows + an info card for the active category.
 *
 * Usage:
 *   <Favourite />                       -> built-in illustrated products
 *   <Favourite items={myItems} />       -> your own categories
 *
 * Item shape:
 *   { id, title, text, color, shape: 'blob'|'burst'|'flower'|'wobble', rotate,
 *     kind: 'croissant'|'drink'|'cupcake'|'slice',  art: {…colour overrides}
 *     image: '/cut-out.png',   // optional transparent PNG/WebP, replaces the illustration
 *     to: '/#menu' }           // optional link target for the info card
 *
 * Needs: react-router-dom, framer-motion, lucide-react, Tailwind and the `font-display` class.
 * Swipe / drag on the stage, tap a side product, or use the arrows.
 */

const INK = 'var(--color-text, #3a1d12)'
const BG = 'var(--color-bg, #fff3e0)'

const ITEMS = [
  {
    id: 'drinks', title: 'Drinks', text: 'Cold, creamy and a little bit fizzy',
    kind: 'drink', shape: 'blob', color: '#ffa3b9', rotate: -12,
    art: { f: '#fff6e8', c: '#d6336c', m: '#ffe1ea', a: '#ff7aa0' },
    image: '/main-p.png'
  },
  {
    id: 'starters', title: 'Starters', text: 'Layered, buttery and baked at dawn',
    kind: 'croissant', shape: 'burst', color: '#ffc27a', rotate: 8,
    art: { a: '#ff9bb5', b: '#3a1d12' },
    image: '/main-p.png'
  },
  {
    id: 'cupcakes', title: 'Cupcakes', text: 'Swirled high and finished by hand',
    kind: 'cupcake', shape: 'flower', color: '#bfe8d4', rotate: 0,
    art: { a: '#d7ebb0', b: '#5f7f3e' },
    image: '/main-p.png'
  },
]

/* ------------------------------------------------------------------ */
/* Background shapes                                                    */
/* ------------------------------------------------------------------ */

function blob(cx, cy, base, waves = [], steps = 160) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = base + waves.reduce((s, [amp, freq, phase]) => s + amp * Math.sin(freq * t + phase), 0)
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`
  }
  return d + 'Z'
}

const SHAPE_PATHS = {
  blob: blob(100, 100, 80, [[10, 3, 0], [6, 5, 1.2]]),
  burst: blob(100, 100, 78, [[15, 4, 0.4]]),
  flower: blob(100, 100, 82, [[13, 8, 0]]),
  wobble: blob(100, 100, 80, [[9, 3, 2], [7, 6, 0]]),
}

function Product({ item }) {
  if (item.image) return <img src={item.image} alt={item.title} draggable={false} className="h-full w-full object-contain" />
 
}

/* ------------------------------------------------------------------ */
/* Little decorative pieces                                             */
/* ------------------------------------------------------------------ */

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

function ScallopBadge({ children, className = '' }) {
  const W = 150, H = 46, r = 7
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
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill="#bfdcff" />)}
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

const SLOT = {
  center: { left: '50%', scale: 1.12, opacity: 1, zIndex: 20 },
  left: { left: '17%', scale: 0.88, opacity: 1, zIndex: 10 },
  right: { left: '83%', scale: 0.88, opacity: 1, zIndex: 10 },
  hidden: { left: '50%', scale: 0.4, opacity: 0, zIndex: 0 },
}

export default function Favourite({
  items = ITEMS,
  titleTop = 'Pick your',
  titleBottom = 'favourite',
  label = 'Our menu',
  viewAllTo = 'https://drive.google.com/file/d/1lqcwak79yxxweQnRuWqnzCHGSpQVgefL/view?usp=sharing',
}) {
  const reduce = useReducedMotion()
  const n = items.length
  const [active, setActive] = useState(Math.min(1, n - 1))
  const startX = useRef(null)

  const go = (dir) => setActive((a) => (a + dir + n) % n)
  const slotOf = (i) => {
    const off = (i - active + n) % n
    if (off === 0) return 'center'
    if (off === 1) return 'right'
    if (off === n - 1) return 'left'
    return 'hidden'
  }

  const transition = reduce ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 18 }
  const current = items[active]

  const arrow = (dir, Icon) => (
    <button
      type="button"
      onClick={() => go(dir)}
      aria-label={dir < 0 ? 'Previous category' : 'Next category'}
      className="group relative grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 md:h-24 md:w-24"
      style={{ color: INK, outlineColor: INK }}
    >
      <FlowerShape />
      <Icon className="relative transition-transform group-hover:scale-110" size={26} strokeWidth={2.5} />
    </button>
  )

  return (
    <section className="relative overflow-hidden px-5 py-20 md:py-28" style={{ background: BG, color: INK }}>
      {/* Header */}
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="relative">
          <ScallopBadge className="absolute -top-5 right-[2%] z-10 rotate-[4deg]">{label}</ScallopBadge>
          <h2 className="font-display text-[clamp(3.25rem,11vw,8.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.02em]">
            {titleTop}
            <br />
            {titleBottom}
          </h2>
        </div>
        <Link
          to={viewAllTo}
          className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold uppercase transition hover:gap-3 hover:brightness-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
          style={{ background: 'var(--color-accent, #ffc24b)', outlineColor: INK }}
          target="_blank"
          rel="noopener noreferrer"
        >
          View all <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Stage */}
      <div
        className="relative mx-auto mt-6 h-[19rem] max-w-7xl touch-pan-y select-none md:h-[30rem]"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current == null) return
          const dx = e.clientX - startX.current
          startX.current = null
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        }}  
        onPointerCancel={() => (startX.current = null)}
      >
        {items.map((item, i) => {
          const slot = slotOf(i)  
          const isSide = slot === 'left' || slot === 'right'
          return (
            <motion.div
              key={item.id}
              initial={false}
              animate={SLOT[slot]}
              transition={transition}
              style={{ x: '-50%', y: '-50%', top: '50%', pointerEvents: slot === 'hidden' ? 'none' : 'auto' }}
              className={`absolute aspect-square w-[clamp(10rem,30vw,19rem)] ${isSide ? 'cursor-pointer' : ''}`}
              role={isSide ? 'button' : undefined}
              tabIndex={isSide ? 0 : -1}
              aria-hidden={slot === 'hidden' ? true : undefined}
              aria-label={isSide ? `Show ${item.title}` : undefined}
              onClick={isSide ? () => setActive(i) : undefined}
              onKeyDown={isSide ? (e) => (e.key === 'Enter' || e.key === ' ') && setActive(i) : undefined}
            >
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-[4%] md:inset-[-4%] h-[80%] w-[80%] md:h-[120%] md:w-[120%]"
                style={{ transform: `rotate(${item.rotate ?? 0}deg)`, top: '30%' }}
                aria-hidden="true"
              >
                <path d={SHAPE_PATHS[item.shape] || SHAPE_PATHS.blob} fill={item.color} />
              </svg>
              <motion.div
                whileHover={reduce || slot === 'hidden' ? undefined : { y: -18, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                className="absolute inset-0 grid place-items-center"
                style={{ filter: 'drop-shadow(0 18px 16px rgba(58,29,18,0.22))' }}
              >
                <div className="h-[80%] w-[80%] md:h-[120%] md:w-[120%]">
                  <Product item={item} />
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Controls + info card */}
      <div className="relative z-30 mx-auto -mt-4 flex max-w-xl items-center justify-center gap-3 md:gap-6">
        {arrow(-1, ArrowLeft)}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="relative w-[15.5rem] md:w-[17rem]"
          >
            <Link
              to={current.to || viewAllTo}
              className="group flex items-center gap-3 rounded-2xl bg-white p-3 pt-4 shadow-[0_10px_30px_rgba(58,29,18,0.10)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
              style={{ outlineColor: INK }}
            >
              <span
                className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5"
                style={{ background: current.color }}
              >
                <Product item={current} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-extrabold uppercase leading-none">{current.title}</span>
                <span className="mt-1 block text-xs leading-snug opacity-75">{current.text}</span>
              </span>
              <span
                className="absolute -top-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full transition-transform group-hover:rotate-90"
                style={{ background: current.color, border: `4px solid ${BG}` }}
                aria-hidden="true"
              >
                <Plus size={16} strokeWidth={3} />
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>

        {arrow(1, ArrowRight)}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {current.title}
      </p>
    </section>
  )
}
