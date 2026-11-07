import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Wheat, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
    setEmail('')
  }

  return (
    <footer className="mt-24 rounded-t-[3rem] bg-black px-6 pb-8 pt-16 text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-3xl font-extrabold">
            <img src="/dynamite-logo.png" alt="Dynamite Bites logo" className="h-16 w-38 object-contain" />
          </Link>
          <p className="mt-4 max-w-sm text-cream/70">
            A flavour-packed destination for crispy bites, delicious Asian favourites and satisfying meals, made to turn every craving into a memorable experience.
          </p>
          <form onSubmit={submit} className="mt-8 flex max-w-sm items-center rounded-full border-2 border-cream/30 p-1.5 pl-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={done ? 'You are on the list!' : 'Newsletter — your email'}
              className="w-full bg-transparent text-sm outline-none placeholder:text-cream/50"
            />
            <button aria-label="Subscribe" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold text-accent">Explore</h4>
          <ul className="mt-4 space-y-3 text-cream/80">
            <li><Link className="hover:text-accent" to="/">Home</Link></li>
            <li><Link className="hover:text-accent" to="/about">About</Link></li>
            <li><Link className="hover:text-accent" to="https://drive.google.com/file/d/1lqcwak79yxxweQnRuWqnzCHGSpQVgefL/view?usp=sharing" target="_blank">Menu</Link></li>
            <li><Link className="hover:text-accent" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-bold text-accent">Follow along</h4>
          <div className="mt-4 flex gap-3">
            {[
              { Icon: Instagram, href: 'https://www.instagram.com/dynamite.bites', label: 'Instagram' },
              { Icon: Facebook, href: 'https://www.facebook.com/dynamite.bites', label: 'Facebook' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-cream/30 transition hover:bg-accent hover:text-[var(--color-text)]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-cream/60">Monday–Saturday (12:00 PM – 11:30 PM), Sunday (12:00 PM – 11:00 PM)</p>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-cream/15 pt-6 text-sm text-cream/50">
        © 2026 Dynamite Bites. All rights reserved. Designed by <a href="https://recollectix.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Recollectix Media Pvt Ltd</a>.
      </div>
    </footer>
  )
}
