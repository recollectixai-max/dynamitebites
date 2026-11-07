import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function Faq({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y-2 divide-[var(--color-text)] border-y-2 border-[var(--color-text)]">
      {items.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-6 py-6 text-left"
            aria-expanded={open === i}
          >
            <span className="font-display text-xl font-bold md:text-2xl">{f.q}</span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white">
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="max-w-2xl pb-6 leading-relaxed text-muted">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
