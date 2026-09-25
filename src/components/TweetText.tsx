import { useMemo, useState } from 'react'
import { tokenize, truncateTokens, type Token } from '../lib/linkify'
import { graphemes } from '../lib/text'

function linkLabel(url: string): string {
  const shown = graphemes(url.replace(/^https?:\/\/(www\.)?/, ''))
  return shown.length > 30 ? shown.slice(0, 29).join('') + '…' : shown.join('')
}

function render(tokens: Token[]) {
  return tokens.map((t, i) =>
    t.type === 'text' ? (
      t.value
    ) : (
      <a key={i} className="link" href={t.href} target="_blank" rel="noreferrer">
        {t.type === 'url' ? linkLabel(t.value) : t.value}
      </a>
    ),
  )
}

interface Props {
  text: string
  /** Nombre de caractères avant "Voir plus" (X tronque vers 280) */
  truncateAt?: number
  className?: string
}

export function TweetText({ text, truncateAt = 280, className = 'tweet-text' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const tokens = useMemo(() => tokenize(text), [text])
  const short = useMemo(() => truncateTokens(tokens, truncateAt), [tokens, truncateAt])
  const collapsed = short.truncated && !expanded

  return (
    <div className={className}>
      {render(collapsed ? short.tokens : tokens)}
      {collapsed && (
        <>
          {' '}
          <button className="link see-more" onClick={() => setExpanded(true)}>
            Voir plus
          </button>
        </>
      )}
    </div>
  )
}
