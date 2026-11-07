import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Img from '../components/Img'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Faq from '../components/Faq'
import { faqs, photos, u } from '../data'
import Gallery from '../components/Gallery'

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{n}{suffix}</span>
}

const stats = [
  { to: 20, suffix: 'K+', label: 'Dynamite shrimps and street food bites served to hungry beachgoers every month', bg: 'bg-primary text-white' },
  { to: 9, suffix: 'K+', label: 'Regulars who track their steps down the boardwalk to refuel with us every single week', bg: 'bg-accent' },
  { to: 5, suffix: '', label: 'Years of bringing authentic, fiery Asian street flavors directly to the sands of Kite Beach', bg: 'bg-mint' },
]

const crew = [
  { name: 'Arjun Rao', role: 'Head Baker & Sourdough Lead', img: photos.manA },
  { name: 'Meera Iyer', role: 'Pastry Chef & Lamination Nerd', img: photos.womanA },
  { name: 'Tomas Weber', role: 'Cake Artist & Decorator', img: photos.manB },
]

const story = [
  {
    n: '01',
    title: 'THE VISION',
    text: 'It began with a simple mission: to step away from repetitive beach fast food and deliver authentically bold Oriental, Chinese, and Thai street food right onto the shores of Dubai. We wanted rich, appetizing flavors that tasted like the bustling night markets of Asia',
  },
  {
    n: '02',
    title: 'THE KITE BEACH SHACK',
    text: 'We set up our signature orange and dark-themed outdoor venue right on the sand at Kite Beach in Umm Suqeim 1. The coastal air combined with our warmly lit open-air seating quickly drew a lively crowd looking for a fresh beachside dining experience.',
  },
  {
    n: '03',
    title: 'STILL EXPERIMENTING',
    text: 'Today, we continue to feed beachgoers, foodies, and night-owls. From our famous creamy, spicy Dynamite Shrimps to customizable Hakka noodles and Korean Chicken, our recipes keep evolving while maintaining our AED 50 per-head promise of great value by the sea.',
  },
]

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="overflow-hidden px-5 pb-10 pt-36 text-center md:pt-44">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Pill>Since 2021</Pill></motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(3.5rem,13vw,11rem)] font-extrabold uppercase leading-[0.85]"
          >
            About <span className="text-primary">us</span>
          </motion.h1>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-3 gap-3 md:gap-8">
            {[photos.about1, photos.about3, photos.about2].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80, rotate: 0 }}
                animate={{ opacity: 1, y: i === 1 ? 24 : 0, rotate: [-5, 0, 5][i] }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.9 }}
                className="aspect-[3/4] overflow-hidden rounded-[2rem] border-2 border-[var(--color-text)]"
              >
                <Img src={photo} alt="" className="h-full w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Marquee words={['Fresh joy', 'Made by hand', 'Made today']} className="mt-16 rotate-[1.5deg] bg-accent" iconClass="text-primary" />

      {/* STATS */}
      <section className="px-5 py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <Pill>Our stats</Pill>
            <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
              BUILT ON <span className="text-primary"> BOLD FLAVORS</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.12}>
                <motion.div whileHover={{ y: -8 }} className={`flex h-full min-h-[280px] flex-col justify-between rounded-[2.2rem] border-2 border-[var(--color-text)] p-8 ${s.bg}`}>
                  <div className="font-display text-8xl font-extrabold leading-none">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </div>
                  <p className="text-lg font-medium">{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CREW */}
      {/* <section className="bg-surface px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-14 text-center">
            <Pill>The team</Pill>
            <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
              Meet the <span className="text-primary">crew</span>
            </h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {crew.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.12}>
                <motion.div whileHover={{ y: -10, rotate: [-1.5, 0, 1.5][i] }} className="group overflow-hidden rounded-[2.2rem] border-2 border-[var(--color-text)] bg-white/70 p-3">
                  <div className="aspect-[4/4.6] overflow-hidden rounded-[1.7rem]">
                    <Img src={u(m.img, 700)} seed={m.name} alt={m.name} className="h-full w-full grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  </div>
                  <div className="px-3 pb-3 pt-5">
                    <h3 className="font-display text-2xl font-extrabold uppercase">{m.name}</h3>
                    <p className="mt-1 text-sm text-muted">{m.role}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section> */}

      <Gallery />

      {/* STORY */}
      <section className="px-5 py-28">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_1.3fr]">
          <Reveal className="md:sticky md:top-32 md:self-start">
            <Pill>Our story</Pill>
            <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
              The story behind <span className="text-primary">us</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted">
              A passion for Thai and Asian street food turned into a vibrant beachfront destination with rich, eye-catching flavors.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-8 py-4 font-bold uppercase tracking-wider text-cream transition hover:bg-primary">
              Contact us <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          <div className="space-y-6">
            {story.map((s, i) => (
              <Reveal key={s.n} delay={0.05}>
                <motion.div whileHover={{ x: 8 }} className={`rounded-[2rem] border-2 border-[var(--color-text)] p-8 md:p-10 ${['bg-accent', 'bg-mint', 'bg-primary text-white'][i]}`}>
                  <div className="font-display text-6xl font-extrabold opacity-40">{s.n}</div>
                  <h3 className="mt-3 font-display text-2xl font-extrabold uppercase md:text-3xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed opacity-90">{s.text}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-10">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-10 text-center">
            <Pill>FAQ</Pill>
            <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-6xl">Got questions?</h2>
          </Reveal>
          <Reveal><Faq items={faqs} /></Reveal>
        </div>
      </section>
    </>
  )
}
