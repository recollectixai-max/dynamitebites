import { Sparkles } from 'lucide-react'

export default function Pill({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-text)] bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${className}`}
    >
      <Sparkles size={14} className="text-primary" />
      {children}
    </span>
  )
}
