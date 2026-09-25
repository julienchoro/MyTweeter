import { graphemes } from '../lib/text'
import type { Author } from '../types'

function colorFor(handle: string): string {
  let h = 0
  for (const c of handle) h = (h * 31 + c.charCodeAt(0)) % 360
  return `hsl(${h} 45% 40%)`
}

export function Avatar({ author, size = 40 }: { author: Author; size?: number }) {
  const style = { width: size, height: size, fontSize: size * 0.42 }
  if (author.avatarUrl) {
    return <img className="avatar" src={author.avatarUrl} alt="" style={style} loading="lazy" />
  }
  return (
    <div className="avatar avatar-fallback" style={{ ...style, background: colorFor(author.handle) }} aria-hidden>
      {(graphemes(author.name.trim())[0] ?? '?').toUpperCase()}
    </div>
  )
}
