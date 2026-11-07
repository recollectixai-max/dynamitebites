import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Camera } from 'lucide-react'

/**
 * Gallery section: a headline, then a pinned stage where six photos start as a
 * loose stack in the middle and spread out into a scattered grid as you scroll,
 * while a big centrepiece word pops in between them.
 *
 * Usage:
 *   <Gallery />
 *   <Gallery heading="A peek inside" word="BAKED!" photos={myPhotos} />
 *   <Gallery centerpiece={<img src="/my-centerpiece.png" alt="" />} />
 *
 * photos: [{ src, alt }]  — exactly 6 give the intended layout (extra ones are ignored).
 *
 * Needs: framer-motion, lucide-react, Tailwind and the `font-display` class.
 * With reduced motion enabled the stage is not pinned and shows the final layout.
 */

const INK = 'var(--color-text, #3a1d12)'
const BG = '#fffaf0'

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=1000&q=80`

const PHOTOS = [
  { src: '/g1.JPG', alt: 'Bakers shaping dough' },
  { src: '/g2.JPG', alt: 'Golden croissants' },
  { src: '/g3.JPG', alt: 'Chocolate cake slice' },
  { src: '/g4.JPG', alt: 'Frosted cupcakes' },
  { src: '/g5.JPG', alt: 'Warm latte on the counter' },
  { src: '/g6.JPG', alt: 'Fresh loaves of bread' },
]
const FALLBACKS = ['#f0577f', '#ffc24b', '#bfe8d4', '#d6c8f7', '#ff9f68', '#bfdcff']

// x / y are offsets from the centre in vw / vh; w is the card width in vw.
const DESKTOP = [
  { x: -30, y: -30, w: 17, ar: '4 / 5', r: -4 },
  { x: 0, y: -35, w: 17, ar: '5 / 4', r: 2 },
  { x: 30, y: -30, w: 17, ar: '4 / 5', r: 4 },
  { x: -30, y: 30, w: 17, ar: '4 / 5', r: 3 },
  { x: 0, y: 35, w: 17, ar: '5 / 4', r: -2 },
  { x: 30, y: 30, w: 17, ar: '4 / 5', r: -3 },
]
const COMPACT = [
  { x: -24, y: -25, w: 38, ar: '4 / 5', r: -4 },
  { x: 0, y: -39, w: 30, ar: '5 / 4', r: 2 },
  { x: 24, y: -25, w: 38, ar: '4 / 5', r: 4 },
  { x: -24, y: 25, w: 38, ar: '4 / 5', r: 3 },
  { x: 0, y: 39, w: 30, ar: '5 / 4', r: -2 },
  { x: 24, y: 25, w: 38, ar: '4 / 5', r: -3 },
]

function useCompact() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return compact
}

/* ------------------------------------------------------------------ */
/* Centrepiece: big word + sprinkle burst + glazed donut (all SVG)       */
/* ------------------------------------------------------------------ */

function blob(cx, cy, base, waves = [], steps = 140) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = base + waves.reduce((s, [amp, freq, phase]) => s + amp * Math.sin(freq * t + phase), 0)
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`
  }
  return d + 'Z'
}

const DOUGH = blob(250, 190, 62, [[1.5, 5, 0]]) + blob(250, 190, 18, [[1, 4, 1]])
const GLAZE = blob(250, 190, 51, [[4, 9, 0], [2.5, 5, 1]]) + blob(250, 190, 24, [[1.5, 6, 0]])

const SPRINKLES = (() => {
  let seed = 11
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const colors = ['#f0577f', '#ffc24b', '#bfe8d4', '#3a1d12', '#bfdcff']
  const out = []
    // two bursts, one above each end of the word, fanning up and outwards
    ;[[110, 120, -1], [390, 120, 1]].forEach(([cx, cy, side], b) => {
      for (let i = 0; i < 12; i++) {
        const angle = ((-20 - rnd() * 110) * Math.PI) / 180 // upwards arc
        const dist = 25 + rnd() * 75
        out.push({
          x: cx + side * Math.abs(Math.cos(angle)) * dist,
          y: cy + Math.sin(angle) * dist,
          rot: rnd() * 180,
          c: colors[(i + b) % colors.length],
        })
      }
    })
  return out
})()

function Centerpiece({ word }) {
  return (
    <div className="relative mx-auto w-[min(86vw,36rem)]" aria-hidden={false}>
      <div
        className="relative z-0 text-center font-display text-[clamp(4.5rem,15vw,10.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]"
        style={{ color: INK }}
      >
        <img src="/dynamite-logo.png" alt="Dynamite Bites logo" className="h-full w-full object-contain" />
      </div>
      
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Photo tile                                                           */
/* ------------------------------------------------------------------ */

function Tile({ photo, index, layout, progress }) {
  const [failed, setFailed] = useState(false)

  const stagger = index * 0.01
  const range = [0.0 + stagger, 0.40 + stagger * 0.5]
  const mid = index - 2.5

  const x = useTransform(progress, range, [`${mid * 2}vw`, `${layout.x}vw`])
  const y = useTransform(progress, range, [`${mid * 1.5}vh`, `${layout.y}vh`])
  const rotate = useTransform(progress, range, [mid * 3, layout.r])
  const scale = useTransform(progress, range, [0.72, 1])
  return (
    <motion.figure  
      style={{
        x,
        y,
        rotate,
        scale,
        width: `min(${layout.w}vw, ${layout.w * 1.5}vh)`,
        aspectRatio: layout.ar,
        zIndex: index + 1,
      }}
      className="col-start-1 row-start-1 m-0 overflow-hidden rounded-xl shadow-[0_16px_36px_rgba(58,29,18,0.22)]"
    >
      {failed ? (
        <div className="grid h-full w-full place-items-center" style={{ background: FALLBACKS[index % FALLBACKS.length] }} role="img" aria-label={photo.alt}>
          <Camera size={32} className="text-white/80" />
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </motion.figure>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export default function Gallery({
  photos = PHOTOS,
  heading = 'A peek inside the bakehouse',
  word = 'BAKED!',
  centerpiece,
}) {
  const reduce = useReducedMotion()
  const compact = useCompact()
  const layout = compact ? COMPACT : DESKTOP

  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })
  const done = useMotionValue(1)
  const progress = reduce ? done : smooth

  const centerScale = useTransform(progress, [0.35, 0.7], [0.55, 1])
  const centerOpacity = useTransform(progress, [0.35, 0.62], [0, 1])
  const centerRotate = useTransform(progress, [0.35, 0.7], [-8, 0])

  return (
    <section className="relative overflow-hidden" style={{ background: BG, color: INK }}>
      {/* Headline */}
      <div className="px-5 pb-10 pt-24 text-center md:pb-16 md:pt-32">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl font-display text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]"
        >
          {heading}
        </motion.h2>
      </div>

      {/* Pinned stage */}
      <div ref={track} className={reduce ? 'relative' : 'relative h-[100vh]'}>
        <div className={`${reduce ? 'relative' : 'sticky top-0'} grid h-screen place-items-center overflow-hidden`}>
          {photos.slice(0, 6).map((photo, i) => (
            <Tile key={photo.src} photo={photo} index={i} layout={layout[i]} progress={progress} />
          ))}

          <motion.div
            style={{ scale: centerScale, opacity: centerOpacity, rotate: centerRotate, zIndex: 20 }}
            className="col-start-1 row-start-1"
          >
            {centerpiece || <Centerpiece word={word} />}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
