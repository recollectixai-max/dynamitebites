import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Cake, Coffee, Cookie, Star } from 'lucide-react'
import Img from '../components/Img'
import Pill from '../components/Pill'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import ProductCarousel from '../components/ProductCarousel'
import { goodies, drinks, photos, u } from '../data'
import Hero from "../components/Hero"
import Products from "../components/Products"
import Favourite from "../components/Favourite"
import WhyUs from "../components/WhyUs"
import Instagram from "../components/Instagram"
import Testimonial from "../components/Testimonial"

const myItems = [
  { name: 'Raspberry Swirl Cupcake', price: 4.25, kind: 'cupcake', bg: '#ffa3b9', a: '#f0577f', b: '#b3234f', image: '/drink.avif' },
  { name: 'Cold Brew Cloud', price: 5.25, kind: 'drink', bg: '#bfe8d4', a: '#d99a5b', b: '#f0577f', image: '/drink.avif' },
  { name: 'Glazed Ring', price: 3.5, kind: 'donut', bg: '#ffd966', a: '#f0577f', b: '#fff3e0', image: '/drink.avif' },
  { name: 'Cocoa Cream Slice', price: 6.75, kind: 'slice', bg: '#d6c8f7', a: '#ff9bb5', b: '#3a1d12', image: '/drink.avif' },
  { name: 'Vanilla Bean Cupcake', price: 4.25, kind: 'cupcake', bg: '#ffc7a1', a: '#fff3e0', b: '#7a4a2b', image: '/drink.avif' },
  { name: 'Caramel Oat Latte', price: 5.5, kind: 'drink', bg: '#ffa3b9', a: '#e0a35f', b: '#3a1d12', image: '/drink.avif' },
]

const myPosts = [
  {
    video: '/reel-1.mp4',
    // src: '/insta/reel-1-poster.jpg',
    alt: 'Croissants cooling on a rack',
    href: 'https://www.instagram.com/reel/DOBq4WXkkDr/?rpxt=MW1oNm93ZDR1ZXVp',
  },
  {
    video: '/reel-2.mp4',
    // src: '/insta/reel-1-poster.jpg',
    alt: 'Croissants cooling on a rack',
    href: 'https://www.instagram.com/reel/DOWLyOYCCy6/?dlrf=MThmaWJwbm90b2c5OA==',
  },
  {
    // video: '/post-1.jpg',
    src: '/post-2.jpg',
    alt: 'Croissants cooling on a rack',
    href: 'https://www.instagram.com/p/C0KGD8lvRBc/?xtok=MTZrZTlleGhraGM5OA==',
  },
  {
    // video: '/post-2.jpg',
    src: '/post-1.jpg',
    alt: 'Croissants cooling on a rack',
    href: 'https://www.instagram.com/p/Cq79NVdIoIH/?mdxt=dHRlZGYwMnlheDEx',
  },
  {
    // video: '/post-3.jpg',
    src: '/post-3.jpg',
    alt: 'Croissants cooling on a rack',
    href: 'https://www.instagram.com/p/DPg6QlyEvbq/?cplk=MXVjbzlwYjhmM2JhYg==',
  },
]

function SpinBadge({ className = '' }) {
  return (
    <div className={`relative h-28 w-28 md:h-36 md:w-36 ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="10" fontWeight="800" fill="currentColor" style={{ fontFamily: 'var(--font-display)' }}>
          <textPath href="#badge-circle" textLength="236" lengthAdjust="spacing">
            BAKED FRESH • EVERY DAY •{' '}
          </textPath>
        </text>
      </svg>
      <Cake className="absolute inset-0 m-auto" size={30} />
    </div>
  )
}

const categories = [
  { title: 'Drinks', text: 'Cold brews, creamy lattes and fizzy pink sips.', Icon: Coffee, img: photos.iced, bg: 'bg-mint' },
  { title: 'Pastries', text: 'Laminated, buttery and pulled from the oven at dawn.', Icon: Cookie, img: photos.croissant, bg: 'bg-accent' },
  { title: 'Cakes', text: 'Tall, tender slices and made-to-order showstoppers.', Icon: Cake, img: photos.layerCake, bg: 'bg-primary text-white' },
]

const stats = [
  { big: '98%', label: 'of guests come back within a week' },
  { big: '12K+', label: 'treats baked by hand every month' },
  { big: '5 AM', label: 'when the first dough hits the bench' },
]

const reviews = [
  { name: 'Riya Mehta', role: 'Morning regular', quote: 'The cardamom bun is the reason I am early to work now.', bg: 'bg-accent' },
  { name: 'Daniel Okafor', role: 'Birthday host', quote: 'The cake looked like a painting and tasted even better.', bg: 'bg-mint' },
  { name: 'Sofia Reyes', role: 'Cold brew convert', quote: 'Cosy room, warm staff, and a cold brew that actually delivers.', bg: 'bg-surface' },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <Hero productSrc="/main-p.png" productAlt="Chocolate croissant" />

      <Favourite />

      <Products id="starters" />

      <Marquee words={['Crispy Goodness', 'Saucy Delights', 'Made to Crave', 'Flavour Explosion']} className="mt-10 rotate-[-1.5deg] bg-primary text-white" iconClass="text-accent" />

      {/* ABOUT TEASER */}
      <section className="px-5 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <Reveal>
            <Pill>About us</Pill>
            <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
              Big flavour. <span className="text-primary">Zero</span> holding back.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              At Dynamite Bites, we believe great food should never be boring. We're all about bold flavours, irresistible bites and food that keeps you coming back for more. Every bite brings a little extra excitement to your day.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold uppercase tracking-wider text-white transition hover:brightness-110">
              Discover our story <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="relative mx-auto h-[420px] w-full max-w-lg md:h-[520px]">
            <div className="absolute left-0 top-0 h-[75%] w-[62%] -rotate-3 overflow-hidden rounded-[2rem] border-2 border-[var(--color-text)]">
              <Img src={u(photos.kitchen, 800)} seed="teaser-kitchen" alt="Bakers at work" className="h-full w-full" />
            </div>
            <div className="absolute bottom-0 right-0 h-[68%] w-[58%] rotate-3 overflow-hidden rounded-[2rem] border-2 border-[var(--color-text)]">
              <Img src={u(photos.shop, 800)} seed="teaser-shop" alt="Bakery counter" className="h-full w-full" />
            </div>
            <div className="animate-floaty absolute bottom-8 left-4 grid h-24 w-24 place-items-center rounded-full bg-accent font-display text-lg font-extrabold uppercase leading-none" style={{ '--r': '-10deg' }}>
              <span className="text-center">Hand<br />made</span>
            </div>
          </Reveal>
        </div>
      </section>

      <WhyUs />

      <Marquee words={['Crispy & Juicy', 'Full of Flavour', 'Worth Every Bite', 'Crispy Goodness']} className="mt-10 rotate-[3.5deg] bg-primary text-white mb-8" iconClass="text-accent" />

      <Testimonial />

      <Products items={myItems} title="Our Drinks" />

      <Instagram handle="@dynamite.bites" url="https://instagram.com/dynamite.bites" posts={myPosts} />

      <Marquee words={['Freshly Made', 'Simply Delicious', 'Cravings Sorted', 'Sauce It Up']} className="mt-10 rotate-[-1.5deg] bg-primary text-white" iconClass="text-accent" />

      <Products items={myItems} title="Our Drinks" />

      {/* CTA */}
      {/* <section className="px-5 pt-28">
        <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] border-2 border-[var(--color-text)] bg-accent px-6 py-20 text-center md:py-28">
          <Pill>Let’s talk</Pill>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-extrabold uppercase leading-[0.92] md:text-8xl">
            Your next sweet favourite is waiting
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg">Tell us what you are craving and we will have it boxed, bowed and ready.</p>
          <Link to="/contact" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-9 py-4 font-bold uppercase tracking-wider text-cream transition hover:bg-primary">
            Get in touch <ArrowUpRight size={18} />
          </Link>
          <div className="animate-floaty absolute -left-6 bottom-6 hidden h-36 w-28 overflow-hidden rounded-3xl border-2 border-[var(--color-text)] md:block" style={{ '--r': '-12deg' }}>
            <Img src={u(photos.cupcake, 400)} seed="cta-left" alt="" className="h-full w-full" />
          </div>
          <div className="animate-floaty absolute -right-6 top-6 hidden h-36 w-28 overflow-hidden rounded-3xl border-2 border-[var(--color-text)] md:block" style={{ '--r': '12deg', animationDelay: '1.5s' }}>
            <Img src={u(photos.croissant, 400)} seed="cta-right" alt="" className="h-full w-full" />
          </div>
        </Reveal>
      </section> */}
    </>
  )
}
