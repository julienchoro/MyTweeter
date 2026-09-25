import type { Card } from '../types'

export function TweetCard({ card }: { card: Card }) {
  const content = (
    <>
      {card.imageUrl && (
        <div className="card-image">
          <img src={card.imageUrl} alt="" loading="lazy" />
          {card.kind === 'link' && card.domain && <span className="card-domain-badge">{card.domain}</span>}
        </div>
      )}
      <div className="card-body">
        <div className="card-title">{card.title}</div>
        {card.description && <div className="card-description">{card.description}</div>}
      </div>
    </>
  )
  return card.url ? (
    <a className={`card card-${card.kind}`} href={card.url} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <div className={`card card-${card.kind}`}>{content}</div>
  )
}
