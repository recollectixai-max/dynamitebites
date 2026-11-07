import { useState } from 'react'

// Image with a graceful fallback if the remote photo fails to load.
export default function Img({ src, alt = '', seed = 'bakery', className = '', ...rest }) {
  const [failed, setFailed] = useState(false)
  const url = failed ? `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/1100` : src
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      {...rest}
    />
  )
}
