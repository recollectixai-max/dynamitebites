import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Clock, Send, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react'
import Img from '../components/Img'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Faq from '../components/Faq'
import { faqs, photos, u } from '../data'

const CONTACTS = [
  { Icon: Mail, label: 'Email us', value: 'hello@dynamitebites.ae', href: 'mailto:hello@dynamitebites.ae', bg: 'bg-accent' },
  { Icon: Phone, label: 'Call us', value: '+971 4 591 6515', href: 'tel:+97145916515', bg: 'bg-mint' },
  { Icon: Clock, label: 'Opening hours', value: 'Daily · 12 pm - 11:30 pm', bg: 'bg-surface' },
]

const fields = [
  { name: 'first', label: 'First name', type: 'text', half: true },
  { name: 'last', label: 'Last name', type: 'text', half: true },
  { name: 'email', label: 'Email', type: 'email', half: true },
  { name: 'phone', label: 'Phone number', type: 'tel', half: true },
  { name: 'subject', label: 'Subject', type: 'text' },
]

const inputCls =
  'w-full rounded-2xl border-2 border-[var(--color-text)] bg-white/70 px-5 py-4 outline-none transition focus:border-primary focus:bg-white'

export default function Contact() {
  const [values, setValues] = useState({ first: '', last: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    setSent(true) // Hook this up to your backend / form service of choice.
  }

  return (
    <>
      {/* HERO + INFO */}
      <section
        className="relative overflow-hidden px-5 py-20 md:py-28"
        style={{ background: 'var(--color-bg, #fff3e0)', color: 'var(--color-text, #3a1d12)' }}
      >
        <div className="relative mx-auto max-w-6xl pt-24">
          {/* Label */}
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-text,#3a1d12)] bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} style={{ color: 'var(--color-primary, #f0577f)' }} />
            Get in touch
          </span>

          {/* Headline */}
          <h1 className="mt-6 font-display text-[clamp(3rem,9.5vw,8.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em]">
            Let’s start a
            <span className="relative mt-1 block w-fit" style={{ color: 'var(--color-primary, #f0577f)' }}>
              conversation
              <svg
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-3 left-0 h-3 w-full md:h-4"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d={'M2 8q9-8 18 0' + 't18 0'.repeat(15)}
                  stroke="var(--color-accent, #ffc24b)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Spinning sticker */}
          <div className="pointer-events-none absolute right-0 top-0 hidden h-32 w-32 md:block lg:h-40 lg:w-40">
            <svg viewBox="0 0 120 120" className="h-full w-full animate-[spin_20s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
              <defs>
                <path id="say-hi-ring" d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="var(--color-accent, #ffc24b)" />
              <text fontSize="11" fontWeight="800" fill="var(--color-text, #3a1d12)" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                <textPath href="#say-hi-ring" textLength="256" lengthAdjust="spacing">
                  SAY HI • SAY HI • SAY HI • SAY HI •{' '}
                </textPath>
              </text>
            </svg>
            <Sparkles className="absolute inset-0 m-auto" size={28} />
          </div>

          {/* Intro + cards */}
          <div className="mt-14 grid items-start gap-10 md:mt-20 md:grid-cols-[1fr_1.2fr] md:gap-16">
            <div>
              <p className="max-w-md text-lg leading-relaxed opacity-80">
                Questions, a custom cake or a big office order? Drop us a line and a real baker will write back.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:hello@dynamitebites.ae"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text,#3a1d12)] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-[var(--color-bg,#fff3e0)] transition hover:brightness-125"
                >
                  Send an email <ArrowUpRight size={16} />
                </a>
                <a
                  href="tel:+97145916515"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-text,#3a1d12)] px-7 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:bg-[var(--color-accent,#ffc24b)]"
                >
                  Call Us Now
                </a>
              </div>
            </div>

            <ul className="m-0 space-y-4 p-0">
              {CONTACTS.map(({ Icon, label, value, href, bg, tilt }) => {
                const Tag = href ? 'a' : 'div'
                return (
                  <li key={label} className="list-none">
                    <Tag
                      {...(href ? { href } : {})}
                      className={`group flex items-center gap-4 rounded-[1.75rem] border-2 border-[var(--color-text,#3a1d12)] p-5 transition duration-300 hover:-translate-y-1 hover:rotate-0 md:p-6 ${tilt}`}
                      style={{ background: bg }}
                    >
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--color-text,#3a1d12)] text-white">
                        <Icon size={22} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.7rem] font-bold uppercase tracking-widest opacity-60">{label}</span>
                        <span className="block truncate font-display text-xl font-extrabold md:text-2xl">{value}</span>
                      </span>
                      {href && (
                        <ArrowUpRight
                          size={22}
                          className="shrink-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                        />
                      )}
                    </Tag>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
      {/* FORM */}
      <section id="contact" className="scroll-mt-28 px-5 py-20">
        <div className="mx-auto grid max-w-7xl items-stretch gap-10 md:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-[2.5rem] border-2 border-[var(--color-text)] bg-surface p-6 md:p-10">
            <h2 className="font-display text-4xl font-extrabold uppercase">Send a message</h2>

            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 flex flex-col items-center py-16 text-center">
                <CheckCircle2 size={64} className="text-primary" />
                <h3 className="mt-5 font-display text-3xl font-extrabold">Thank you, {values.first || 'friend'}!</h3>
                <p className="mt-2 max-w-sm text-muted">Your note is on its way to the kitchen. We usually reply within a day.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <label key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                    <span className="mb-2 block text-sm font-bold">{f.label}</span>
                    <input name={f.name} type={f.type} value={values[f.name]} onChange={change} required={['first', 'email'].includes(f.name)} className={inputCls} />
                  </label>
                ))}
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold">Message</span>
                  <textarea name="message" rows={5} value={values.message} onChange={change} required className={`${inputCls} resize-none`} />
                </label>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-bold uppercase tracking-wider text-white transition hover:brightness-110 sm:col-span-2">
                  Send a message <Send size={18} />
                </button>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.15} className="relative hidden min-h-[480px] md:block">
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border-2 border-[var(--color-text)]">
              <Img src={u(photos.latte, 900)} seed="contact-side" alt="Coffee and pastry" className="h-full w-full" />
            </div>
            <div className="animate-floaty absolute -left-6 bottom-10 rounded-3xl bg-accent px-6 py-4 font-display text-xl font-extrabold uppercase" style={{ '--r': '-6deg' }}>
              Say hello 👋
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee words={['Come visit us', 'Pull up a chair', 'Coffee is on']} className="my-10 rotate-[-1.5deg] bg-primary text-white" iconClass="text-accent" />

      {/* LOCATIONS */}
      <section
        id="location"
        className="px-5 py-20 md:py-28"
        style={{ background: 'var(--color-bg, #fff3e0)', color: 'var(--color-text, #3a1d12)' }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-block rounded-full border-2 border-[var(--color-text,#3a1d12)] bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              Visit us
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">
              Come say <span style={{ color: 'var(--color-primary, #f0577f)' }}>hello</span>
            </h2>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[2rem] border-2 border-[var(--color-text,#3a1d12)] bg-white/60 md:mt-16 md:rounded-[2.5rem]">
            <iframe
              title="Map showing our bakery location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3611.1170896744247!2d55.20694017549925!3d25.1655239329826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b3d49dbd781%3A0xad3eb487c85a5e9f!2sDynamite%20Bites!5e0!3m2!1sen!2sin!4v1793859546850!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[24rem] w-full border-0 md:h-[34rem]"
            />

            <div className="m-3 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(58,29,18,0.15)] md:absolute md:bottom-6 md:left-6 md:m-0 md:max-w-xs md:p-5">
              <p className="font-display text-xl font-extrabold uppercase leading-none">Dynamite Bites</p>
              <p className="mt-2 text-sm leading-snug opacity-80">Kite Beach - Jumeirah 3 - Umm Suqeim 1 - Dubai - United Arab Emirates</p>
              <p className="mt-1 text-sm font-semibold">Daily · 12 pm - 11:30 pm</p>
              <a
                href="https://www.google.com/maps/dir//Dynamite+Bites,+Kite+Beach+-+Jumeirah+3+-+Umm+Suqeim+1+-+Dubai+-+United+Arab+Emirates/@25.1655239,55.2069402,17z/data=!4m16!1m7!3m6!1s0x3e5f6b3d49dbd781:0xad3eb487c85a5e9f!2sDynamite+Bites!8m2!3d25.1655191!4d55.2095151!16s%2Fg%2F11hfjqf1pv!4m7!1m0!1m5!1m1!1s0x3e5f6b3d49dbd781:0xad3eb487c85a5e9f!2m2!1d55.2094948!2d25.1655331?entry=ttu&g_ep=EgoyMDI2MTEwMi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110"
                style={{ background: 'var(--color-primary, #f0577f)' }}
              >
                Get directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-10 pt-10">
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
