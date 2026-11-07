import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Check, Cookie, Sun, Wheat, Flame, Drumstick, Soup, Fish } from 'lucide-react'

/**
 * "Why choose us" section:
 *  1. A cream panel with scalloped top + bottom edges holding a giant headline whose
 *     words fill in from faded to dark as you scroll, two floating stat pills,
 *     a spinning sticker, and a wavy label badge.
 *  2. Two feature cards: a photo card with a cloud-shaped text bubble, and a
 *     colour card with stacked tilted cards, a big number and a round avatar.
 *
 * Usage:
 *   <WhyUs />
 *   <WhyUs image="/pastry-closeup.jpg" avatar="/team-member.jpg" />
 *
 * Needs: framer-motion, lucide-react, Tailwind and the `font-display` class.
 * All copy lives in the COPY object below.
 */

const COPY = {
  label: 'The Dynamite Difference',

  heading: 'A little crunch, a lot of character and flavours you will remember',

  statA: {
    value: 'THAI',
    label: 'Inspired by vibrant Asian cuisine'
  },

  statB: {
    value: 'CHINESE',
    label: 'Classic favourites with a twist'
  },

  sticker: 'Crunch • Flavour • Satisfaction • ',

  care: {
    title: 'Something for every craving',
    text: 'Discover a tempting selection of Asian favourites, from crispy appetisers and saucy bites to satisfying mains. Whether you love a little spice or crave something savoury, there is plenty to explore.'
  },

  help: {
    text: 'Need help with your order or have a question about our menu? Reach out to our team. We would love to hear from you.',
    big: 'HELLO!',
    caption: 'We are just a message away'
  },
}

const INK = '#3a1d12'
const FADED = '#dcd2bd'
const PANEL = '#fffaf0'
const BG = 'var(--color-bg, #fff3e0)'
const YELLOW = '#ffd966'
const MINT = '#bfe8d4'
const ORANGE = '#ff7a2f'

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80'
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'

/* ------------------------------------------------------------------ */
/* Small shapes                                                         */
/* ------------------------------------------------------------------ */

function blob(cx, cy, base, waves = [], steps = 200) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = base + waves.reduce((s, [amp, freq, phase]) => s + amp * Math.sin(freq * t + phase), 0)
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`
  }
  return d + 'Z'
}
const CLOUD = blob(100, 100, 88, [[7, 11, 0]])

function FlowerShape({ fill = '#fff', petals = 8, className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      {Array.from({ length: petals }, (_, i) => {
        const t = (i / petals) * Math.PI * 2
        return <circle key={i} cx={60 + 35 * Math.cos(t)} cy={60 + 35 * Math.sin(t)} r="22" fill={fill} />
      })}
      <circle cx="60" cy="60" r="36" fill={fill} />
    </svg>
  )
}

function FlowerBadge({ icon: Icon, fill = INK, color = '#fff', className = '' }) {
  return (
    <span className={`relative grid place-items-center ${className}`} aria-hidden="true">
      <FlowerShape fill={fill} />
      <Icon className="relative h-[34%] w-[34%]" style={{ color }} strokeWidth={2.5} />
    </span>
  )
}

function ScallopBadge({ children, className = '' }) {
  const W = 140, H = 42, r = 6.5
  const nx = Math.round((W - 2 * r) / 14)
  const ny = Math.round((H - 2 * r) / 14)
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
      <span className="absolute inset-0 grid place-items-center font-display text-xs font-extrabold uppercase" style={{ color: INK }}>
        {children}
      </span>
    </div>
  )
}

function Squiggle({ className = '' }) {
  const d = 'M0 7q5-7 10 0' + 't10 0'.repeat(11)
  return (
    <svg viewBox="0 0 120 14" className={className} fill="none" aria-hidden="true">
      <path d={d} stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Stat({ value, label, bg, icon: Icon, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-4 ${className}`} style={{ background: bg }}>
      <div className="leading-none">
        <div className="font-display text-2xl font-extrabold md:text-3xl">{value}</div>
        <div className="mt-1 text-[10px] font-medium opacity-80 md:text-xs">{label}</div>
      </div>
      {Icon && (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: INK, color: '#fff' }}>
          <Icon size={18} />
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll-filled headline                                               */
/* ------------------------------------------------------------------ */

function Word({ children, progress, index, total, reduce }) {
  const start = index / total
  const end = Math.min(1, (index + 1.4) / total)
  const color = useTransform(progress, [start, end], [FADED, INK])
  return (
    <motion.span style={{ color: reduce ? INK : color }} className="inline-block">
      {children}
    </motion.span>
  )
}

function FillHeading({ text, reduce }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  return (
    <h2
      ref={ref}
      className="mx-auto max-w-6xl text-center font-display text-[clamp(2.3rem,7.2vw,6.4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em]"
    >
      {words.map((w, i) => (
        <span key={i}>
          <Word progress={scrollYProgress} index={i} total={words.length} reduce={reduce}>
            {w}
          </Word>{' '}
        </span>
      ))}
    </h2>
  )
}

/* ------------------------------------------------------------------ */
/* Pieces with image fallback                                           */
/* ------------------------------------------------------------------ */

function Photo({ src, alt = '', className = '', fallback }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={className} style={{ background: fallback }} role="img" aria-label={alt} />
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export default function WhyUs({ image = DEFAULT_IMAGE, avatar = DEFAULT_AVATAR }) {
  const reduce = useReducedMotion()
  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  })

  const edge = (pos) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    height: 36,
    [pos]: '100%',
    backgroundImage: `radial-gradient(circle at 50% ${pos === 'top' ? '100%' : '0'}, ${PANEL} 0 35px, transparent 36px)`,
    backgroundSize: '72px 36px',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'center',
  })

  return (
    <section className="relative overflow-hidden py-14 md:py-20" style={{ background: BG, color: INK }}>
      {/* 1 · Headline panel */}
      <div className="relative px-5 pb-24 pt-28 md:pb-32 md:pt-36" style={{ background: PANEL }}>
        <div aria-hidden="true" style={edge('bottom')} />
        <div aria-hidden="true" style={edge('top')} />

        <div className="relative mx-auto max-w-6xl">
          <ScallopBadge className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 rotate-[-3deg] md:-top-20">
            {COPY.label}
          </ScallopBadge>

          <Stat
            {...COPY.statA}
            bg={YELLOW}
            className="absolute -top-14 left-0 z-10 scale-90 md:-top-16 md:scale-100"
          />

          <FillHeading text={COPY.heading} reduce={reduce} />

          {/* Spinning sticker */}
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            className="pointer-events-none absolute left-1/2 top-[48%] z-10 h-[clamp(5.5rem,11vw,8.5rem)] w-[clamp(5.5rem,11vw,8.5rem)] -translate-x-1/2 -translate-y-1/2"
          >
            <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
              <defs>
                <path id="whyus-ring" d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill={YELLOW} />
              <text fontSize="10.5" fontWeight="800" fill={INK} style={{ fontFamily: 'var(--font-display, sans-serif)', textTransform: 'uppercase' }}>
                <textPath href="#whyus-ring" textLength="256" lengthAdjust="spacing">
                  {COPY.sticker}
                </textPath>
              </text>
            </svg>
          </motion.div>
          <span className="pointer-events-none absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            <Sun size={28} strokeWidth={2.5} />
          </span>

          <Stat
            {...COPY.statB}
            bg={MINT}
            icon={Cookie}
            className="absolute -bottom-16 right-0 z-10 scale-90 md:-bottom-20 md:scale-100"
          />
        </div>
      </div>

      {/* 2 · Feature cards */}
      <div className="mx-auto mt-20 grid max-w-6xl gap-5 px-5 md:mt-28 md:grid-cols-2">
        {/* Photo card with cloud bubble */}
        <motion.article
          {...rise(0)}
          className="relative flex min-h-[32rem] items-center justify-center overflow-hidden rounded-[2rem] p-4 md:min-h-[36rem]"
        >
          <Photo
            src={image}
            alt="Close-up of a flaky, golden pastry"
            className="absolute inset-0 h-full w-full"
            fallback="repeating-linear-gradient(135deg,#f3b868 0 18px,#e59b43 18px 36px)"
          />
          <motion.div
            whileHover={reduce ? undefined : { rotate: 2, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="relative aspect-square w-[min(100%,25rem)]"
          >
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full drop-shadow-[0_14px_20px_rgba(58,29,18,0.18)]" aria-hidden="true">
              <path d={CLOUD} fill={PANEL} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[19%] text-center">
              <FlowerBadge icon={Flame} className="h-11 w-11" />
              <h3 className="mt-3 font-display text-[clamp(1.1rem,2.4vw,1.5rem)] font-extrabold uppercase leading-[0.98]">
                {COPY.care.title}
              </h3>
              <Squiggle className="mt-2 w-24" />
              <p className="mt-2 text-[0.7rem] leading-snug md:text-xs">{COPY.care.text}</p>
            </div>
          </motion.div>
        </motion.article>

        {/* Colour card with stacked cards */}
        <motion.article
          {...rise(0.12)}
          className="relative min-h-[32rem] overflow-hidden rounded-[2rem] md:min-h-[36rem]"
          style={{ background: YELLOW }}
        >
          <motion.div
            initial={reduce ? false : { rotate: 0, opacity: 0 }}
            whileInView={{ rotate: -6, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="absolute left-[8%] top-[12%] h-[58%] w-[48%] rounded-2xl shadow-[0_10px_24px_rgba(58,29,18,0.12)]"
            style={{
              background:
                'repeating-linear-gradient(90deg,#f3c4bb 0 14px,#fff3e0 14px 28px,#e59f8f 28px 42px,#fff3e0 42px 56px)',
            }}
            aria-hidden="true"
          />

          <motion.div
            initial={reduce ? false : { rotate: 0, opacity: 0, y: 40 }}
            whileInView={{ rotate: 6, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduce ? undefined : { rotate: 3, y: -6 }}
            className="absolute left-[22%] top-[24%] flex h-[56%] w-[64%] flex-col justify-between rounded-2xl p-5 text-white shadow-[0_14px_30px_rgba(58,29,18,0.22)] md:p-6"
            style={{ background: ORANGE }}
          >
            <div>
              <span className="mb-3 grid h-6 w-6 place-items-center rounded-full bg-white/90" style={{ color: ORANGE }}>
                <Check size={14} strokeWidth={3.5} />
              </span>
              <p className="max-w-[16rem] text-xs font-semibold leading-snug md:text-sm">{COPY.help.text}</p>
            </div>
            <div>
              <div className="font-display text-5xl font-extrabold leading-none md:text-6xl">{COPY.help.big}</div>
              <p className="mt-1 text-[0.7rem] font-semibold md:text-xs">{COPY.help.caption}</p>
            </div>
          </motion.div>

          <FlowerBadge icon={Drumstick} className="absolute right-[4%] top-[18%] h-[4.2rem] w-[4.2rem]" />

          <motion.div
            initial={reduce ? false : { scale: 0, rotate: -40 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.9 }}
            className="absolute bottom-[5%] right-[5%] h-24 w-24 md:h-28 md:w-28"
          >
            <FlowerShape fill="#fff" />
            <div className="absolute inset-[16%] overflow-hidden rounded-full bg-[#f3c4bb]">
              <Photo src={avatar} alt="A member of our team" className="h-full w-full" fallback="#f3c4bb" />
            </div>
          </motion.div>
        </motion.article>
      </div>
    </section>
  )
}
