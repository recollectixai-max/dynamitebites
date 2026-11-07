import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import Img from './Img'
import { money, u } from '../data'

export default function ProductCarousel({ items }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })

  return (
    <div>
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {items.map((it) => (
          <motion.article
            key={it.name}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group w-[280px] shrink-0 snap-start rounded-[2rem] border-2 border-[var(--color-text)] bg-white/70 p-3 md:w-[320px]"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Img
                src={u(it.img, 700)}
                seed={it.name}
                alt={it.name}
                className="h-full w-full transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex items-start justify-between gap-3 px-3 pb-2 pt-4">
              <div>
                <h3 className="font-display text-xl font-bold leading-tight">{it.name}</h3>
                <p className="mt-1 text-sm text-muted">{it.note}</p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold">{money(it.price)}</span>
            </div>
            <Link
              to="/contact"
              className="mx-3 mb-3 mt-2 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-primary"
            >
              Order now <ArrowUpRight size={16} />
            </Link>
          </motion.article>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-[var(--color-text)] transition hover:bg-[var(--color-text)] hover:text-cream"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Next"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-[var(--color-text)] bg-primary text-white transition hover:brightness-110"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
