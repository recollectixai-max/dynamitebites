import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Wheat, ArrowUpRight } from 'lucide-react'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border-2 border-[var(--color-text)] bg-cream/90 py-2.5 pl-6 pr-2.5 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <img src="/dynamite-logo.png" alt="Dynamite Bites logo" className="h-14 w-32 object-contain" />
        </Link>

        <div className="hidden items-center gap-9 text-sm font-bold uppercase tracking-wider md:flex">
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`transition-colors hover:text-primary ${pathname === to ? 'text-primary' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/#menu"
            className="hidden items-center gap-1 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110 sm:inline-flex"
          >
            Order now <ArrowUpRight size={16} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-text)] text-cream md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-3 max-w-5xl rounded-3xl border-2 border-[var(--color-text)] bg-cream p-6 md:hidden"
          >
            <div className="flex flex-col gap-4 font-display text-2xl font-extrabold uppercase">
              {links.map(({ label, to }) => (
                <Link key={to} to={to} className={pathname === to ? 'text-primary' : ''}>
                  {label}
                </Link>
              ))}
              <Link to="/contact" className="text-primary">Order now →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
