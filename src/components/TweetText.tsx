import { useState, type ReactNode } from 'react'

const TOKEN = /(https?:\/\/[^\s]+|@\w{1,15}|#[\p{L}\p{N}_]+|\b[\w-]+\.(?:py|md|log|ts|js|io|com|dev|ai)\b)/gu

function linkify(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return part
    if (part.startsWith('@')) {
      return <a key={i} className="link" href={`https://x.com/${part.slice(1)}`} target="_blank" rel="noreferrer">{part}</a>
    }
    if (part.startsWith('#')) {
      return <a key={i} className="link" href={`https://x.com/hashtag/${part.slice(1)}`} target="_blank" rel="noreferrer">{part}</a>
    }
    const href = part.startsWith('http') ? part : `https://${part}`
    const shown = part.replace(/^https?:\/\/(www\.)?/, '')
    return (
      <a key={i} className="link" href={href} target="_blank" rel="noreferrer">
        {shown.length > 30 ? shown.slice(0, 29) + '…' : shown}
      </a>
    )
  })
}

interface Props {
  text: string
  /** Nombre de caractères avant "Voir plus" (X tronque vers 280) */
  truncateAt?: number
  className?: string
}

export function TweetText({ text, truncateAt = 280, className = 'tweet-text' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const tooLong = text.length > truncateAt
  const shown = tooLong && !expanded ? text.slice(0, truncateAt).trimEnd() : text

  return (
    <div className={className}>
      {linkify(shown)}
      {tooLong && !expanded && (
        <>
          {' '}
          <button
            className="link see-more"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(true)
            }}
          >
            Voir plus
          </button>
        </>
      )}
    </div>
  )
}
