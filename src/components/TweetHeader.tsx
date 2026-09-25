import type { Tweet } from '../types'
import { formatFullDate, formatTime } from '../lib/format'
import { VerifiedBadge } from './Icons'

export function TweetHeader({ tweet, compact }: { tweet: Tweet; compact?: boolean }) {
  const { author } = tweet
  const time = formatTime(tweet.createdAt, tweet.displayTime)
  return (
    <div className={`tweet-header${compact ? ' compact' : ''}`}>
      <span className="name">{author.name}</span>
      {author.verified && <VerifiedBadge kind={author.verified} />}
      <span className="handle">@{author.handle}</span>
      {time && !tweet.isAd && (
        <>
          <span className="dot">·</span>
          <time className="time" dateTime={tweet.createdAt} title={formatFullDate(tweet.createdAt)}>
            {time}
          </time>
        </>
      )}
      {tweet.isAd && <span className="ad-label">Publicité</span>}
    </div>
  )
}
