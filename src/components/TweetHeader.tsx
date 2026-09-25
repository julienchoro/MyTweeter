import type { Tweet } from '../types'
import { formatFullDate, formatTime } from '../lib/format'
import { VerifiedBadge } from './Icons'

export function TweetHeader({ tweet, compact }: { tweet: Tweet; compact?: boolean }) {
  const { author } = tweet
  const time = formatTime(tweet.createdAt, tweet.displayTime)
  const fullDate = formatFullDate(tweet.createdAt)
  return (
    <div className={`tweet-header${compact ? ' compact' : ''}`}>
      <span className="name">{author.name}</span>
      {author.verified && <VerifiedBadge kind={author.verified} />}
      <span className="handle">@{author.handle}</span>
      {time && !tweet.isAd && (
        <>
          <span className="dot">·</span>
          <time className="time" dateTime={fullDate ? tweet.createdAt : undefined} title={fullDate}>
            {time}
          </time>
        </>
      )}
      {tweet.isAd && <span className="ad-label">Publicité</span>}
    </div>
  )
}
