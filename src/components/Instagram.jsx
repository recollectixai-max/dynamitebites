import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Instagram as InstagramIcon } from 'lucide-react'

/**
 * Instagram section: five portrait "photo" cards start stacked in the middle and
 * fan out (tilted, overlapping) as the section scrolls into view. The centre card
 * carries the "Follow us on Instagram" title and a handle pill; a dark pill button
 * sits underneath.
 *
 * Usage:
 *   <Instagram />
 *   <Instagram handle="@yourbakery" url="https://instagram.com/yourbakery" posts={myPosts} />
 *
 * posts: [{ src, alt, href? }]  (odd count looks best; the middle one is the hero card)
 *
 * Needs: framer-motion, lucide-react, Tailwind and the `font-display` class.
 * Photos load from Unsplash with a colour fallback if they fail; swap in your own feed images.
 */

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&h=980&q=80`

const POSTS = [
  { src: u('1551024601-bec78aea704b'), alt: 'Glazed donuts on a tray' },
  { src: u('1556910103-1c02745aae4d'), alt: 'Bakers shaping dough in the kitchen' },
  { src: u('1509042239860-f550ce710b93'), alt: 'A warm latte with a pastry' },
  { src: u('1578985545062-69928b1d9587'), alt: 'Rich chocolate cake slice' },
  { src: u('1555507036-ab1f4038808a'), alt: 'Golden croissants fresh from the oven' },
]

const FALLBACKS = ['#f0577f', '#ffc24b', '#bfe8d4', '#d6c8f7', '#ff9f68']

function useCompact() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return compact
}

function Media({ post, fallback }) {
  const reduce = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const videoRef = useRef(null)

  // Only play while the card is on screen (saves battery and bandwidth)
  useEffect(() => {
    const el = videoRef.current
    if (!el || reduce) return
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  if (post.video && !failed) {
    return (
      <video
        ref={videoRef}
        src={post.video}
        poster={post.src}
        muted
        loop
        playsInline
        autoPlay={!reduce}
        preload="metadata"
        aria-label={post.alt}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    )
  }

  if (failed && !post.src) {
    return (
      <div className="grid h-full w-full place-items-center" style={{ background: fallback }} role="img" aria-label={post.alt}>
        <InstagramIcon size={36} className="text-white/80" />
      </div>
    )
  }

  return (
    <img
      src={post.src}
      alt={post.alt}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  )
}

function FanCard({ post, index, k, spread, progress, centre, handle, title, url }) {
  const x = useTransform(progress, [0, 1], [`${k * 4}%`, `${k * spread * 100}%`])
  const rotate = useTransform(progress, [0, 1], [k * 1.5, k * 5.5])
  const y = useTransform(progress, [0, 1], ['0px', `${-Math.pow(Math.abs(k), 1.5) * 5}px`])
  const scale = useTransform(progress, [0, 1], [0.96, 1])

  return (
    <motion.a
      href={post.href || url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={centre ? `${title} ${handle}` : post.alt}
      style={{ x, y, rotate, scale, zIndex: 30 - Math.abs(k) * 10 }}
      className="col-start-1 row-start-1 block w-[clamp(8rem,32vw,17rem)] sm:w-[clamp(10rem,20vw,17rem)]"
    >
      <motion.div
        whileHover={{ y: -10, rotate: -k * 1.2 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="relative aspect-[3/4.2] overflow-hidden rounded-[1.4rem] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-[3px] ring-white/90"
      >
        <Media post={post} fallback={FALLBACKS[index % FALLBACKS.length]} />

        {centre && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-black/45 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 top-[7%] px-3 text-center font-display text-[clamp(1rem,2.3vw,1.9rem)] font-extrabold leading-[1.02] text-white [text-shadow:0_2px_0_rgba(0,0,0,0.25),0_0_14px_rgba(0,0,0,0.35)]">
              {title}
            </div>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.65rem] font-bold sm:text-xs" style={{ background: '#ffd966', color: '#2b1810' }}>
              {handle}
            </span>
          </>
        )}
      </motion.div>
    </motion.a>
  )
}

export default function Instagram({
  posts = POSTS,
  handle = '@doughlight.bakes',
  url = 'https://www.instagram.com/dynamite.bites',
  title = 'Follow us on Instagram',
  cta = 'Say hi on Instagram',
  background = '#ffc24b',
}) {
  const reduce = useReducedMotion()
  const compact = useCompact()
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.3'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })
  const done = useMotionValue(1)
  const progress = reduce ? done : smooth

  const mid = (posts.length - 1) / 2
  const spread = compact ? 0.58 : 0.84

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-20 md:py-28" style={{ background, color: '#fff3e0' }}>
      <div className="mx-auto grid max-w-6xl place-items-center py-6">
        {posts.map((post, i) => (
          <FanCard
            key={post.src}
            post={post}
            index={i}
            k={i - mid}
            spread={spread}
            progress={progress}
            centre={i === Math.round(mid)}
            handle={handle}
            title={title}
            url={url}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center md:mt-14">
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={reduce ? undefined : { y: -4 }}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 font-display text-base font-bold shadow-[0_10px_24px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffd966]"
          style={{ background: '#2b1810', color: '#fff3e0' }}
        >
          {cta}
          <span className="grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:rotate-45" style={{ background: '#ffd966', color: '#2b1810' }}>
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </span>
        </motion.a>
      </div>
    </section>
  )
}
