import { Sparkles } from 'lucide-react'

export default function Marquee({ words, className = '', iconClass = '' }) {
  const row = [...words, ...words, ...words, ...words]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="flex w-max animate-marquee items-center gap-10 py-4">
        {row.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl font-extrabold uppercase md:text-4xl"
          >
            {w}
            <Sparkles size={26} className={iconClass} />
          </span>
        ))}
      </div>
    </div>
  )
}
