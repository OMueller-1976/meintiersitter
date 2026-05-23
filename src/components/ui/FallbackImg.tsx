'use client'

interface FallbackImgProps {
  src: string
  alt: string
  className?: string
}

export default function FallbackImg({ src, alt, className }: FallbackImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => { e.currentTarget.style.display = 'none' }}
    />
  )
}
