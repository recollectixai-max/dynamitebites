import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Testimonial section: a soft butter-coloured rounded panel with a small label,
 * a big tight two-line headline, and a single row of pill-shaped quote chips
 * (avatar · “quote” · name) drifting slowly sideways with faded edges.
 * The row pauses on hover; with reduced motion it becomes a swipeable row.
 *
 * Usage:
 *   <Testimonial />
 *   <Testimonial items={myReviews} headline={['One bite.', 'Then back.']} speed={70} />
 *
 * items: [{ quote, name, avatar? }]   (avatar is optional; initials are shown if missing/failing)
 *
 * Needs: framer-motion, Tailwind and the `font-display` class. No router dependency.
 */

const INK = 'var(--color-text, #3a1d12)'
const BG = 'var(--color-bg, #fff3e0)'

const p = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=96&h=96&crop=faces&q=80`

// Placeholder reviews: replace with real ones from your guests.
const ITEMS = [
  {
    quote: 'That crispy coating and sauce combination is seriously addictive.',
    name: 'Riya M.',
    avatar: p('1494790108377-be9c29b29330')
  },
  {
    quote: 'Every bite was packed with flavour. Already planning my next order.',
    name: 'Daniel O.',
    avatar: p('1507003211169-0a1dd7228f2d')
  },
  {
    quote: 'Such a great mix of flavours. Everything was absolutely delicious.',
    name: 'Sofia R.',
    avatar: p('1438761681033-6461ffad8d80')
  },
  {
    quote: 'The perfect spot whenever I am craving something satisfying.',
    name: 'Aman K.',
    avatar: p('1500648767791-00dcc994a43e')
  },
  {
    quote: 'Ordered a few things to share, and nothing was left!',
    name: 'Priya S.',
    avatar: p('1544005313-94ddf0286df2')
  },
  {
    quote: 'Great flavours, generous portions and a really enjoyable meal.',
    name: 'Marcus L.',
    avatar: p('1472099645785-5658abf4ff4e')
  },
  {
    quote: 'Friendly service and food that definitely deserves another visit.',
    name: 'Hannah T.',
    avatar: p('1534528741775-53994a69daeb')
  },
  {
    quote: 'Found our new favourite place for a delicious meal with friends.',
    name: 'Vikram D.',
    avatar: p('1506794778202-cad84cf45f1d')
  },
];

const TINTS = ['#f0577f', '#ffc24b', '#7fc8a9', '#9a8bd6', '#ff9f68']

function Avatar({ src, name, index }) {
  const [failed, setFailed] = useState(!src)
  if (failed) {
    return (
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
        style={{ background: TINTS[index % TINTS.length] }}
        aria-hidden="true"
      >
        {name.trim().charAt(0).toUpperCase()}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/80"
    />
  )
}

function Chip({ item, index }) {
  return (
    <li className="shrink-0 list-none">
      <motion.figure
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="m-0 inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-[#fff8e1] py-2.5 pl-2.5 pr-6 shadow-[0_6px_18px_rgba(58,29,18,0.09)]"
      >
        <Avatar src={item.avatar} name={item.name} index={index} />
        <blockquote className="m-0 text-[0.95rem] font-medium" style={{ color: INK }}>
          “{item.quote}”
        </blockquote>
        <figcaption className="text-xs font-semibold opacity-55" style={{ color: INK }}>
          {item.name}
        </figcaption>
      </motion.figure>
    </li>
  )
}

export default function Testimonial({
  items = ITEMS,
  label = 'Kind words from our guests',
  headline = ['The people', 'have spoken'],
  speed = 60, // seconds for one full loop; higher = slower
  background = '#fbe7ad',
}) {
  const reduce = useReducedMotion()
  const fade = 'linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)'

  return (
    <section className="px-3 py-3 md:px-4 md:py-4" style={{ background: BG, color: INK }}>
      <style>{`
        @keyframes tm-scroll { to { transform: translateX(-50%); } }
        .tm-track { animation: tm-scroll ${speed}s linear infinite; }
        .tm-row:hover .tm-track, .tm-row:focus-within .tm-track { animation-play-state: paused; }
      `}</style>

      <div className="rounded-[1.5rem] py-16 text-center md:rounded-[2rem] md:py-24" style={{ background }}>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] md:text-xs"
        >
          {label}
        </motion.p>

        <h2 className="mt-5 font-display text-[clamp(3rem,8.5vw,6.8rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          {headline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: '105%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* Drifting row of quote chips */}
        <div
          className={`tm-row mt-12 md:mt-16 ${reduce ? 'no-scrollbar overflow-x-auto px-5' : 'overflow-hidden'}`}
          style={reduce ? undefined : { maskImage: fade, WebkitMaskImage: fade }}
        >
          <div className={reduce ? 'flex w-max gap-4' : 'tm-track flex w-max'}>
            <ul className={`m-0 flex gap-4 p-0 ${reduce ? '' : 'pr-4'}`}>
              {items.map((it, i) => (
                <Chip key={it.name + i} item={it} index={i} />
              ))}
            </ul>
            {!reduce && (
              <ul className="m-0 flex gap-4 p-0 pr-4" aria-hidden="true">
                {items.map((it, i) => (
                  <Chip key={`dup-${it.name}${i}`} item={it} index={i} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
