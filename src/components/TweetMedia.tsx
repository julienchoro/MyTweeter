import type { Media } from '../types'

export function TweetMedia({ media }: { media: Media[] }) {
  const items = media.slice(0, 4)
  const single = items.length === 1

  return (
    <div className={`media-grid media-${items.length}`}>
      {items.map((m, i) => (
        <div
          key={i}
          className={`media-item${single && !m.aspectRatio ? ' no-ratio' : ''}`}
          style={single && m.aspectRatio ? { aspectRatio: String(m.aspectRatio) } : undefined}
        >
          {m.type === 'image' ? (
            <img src={m.url} alt={m.alt ?? ''} loading="lazy" />
          ) : (
            <video src={m.url} controls={m.type === 'video'} autoPlay={m.type === 'gif'} loop={m.type === 'gif'} muted playsInline />
          )}
          {m.type === 'gif' && <span className="media-badge">GIF</span>}
        </div>
      ))}
    </div>
  )
}
