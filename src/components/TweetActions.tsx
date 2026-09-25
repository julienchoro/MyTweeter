import type { Metrics } from '../types'
import { formatCount } from '../lib/format'
import { BookmarkIcon, HeartIcon, ReplyIcon, RetweetIcon, ShareIcon, ViewsIcon } from './Icons'

export function TweetActions({ metrics = {} }: { metrics?: Metrics }) {
  return (
    <div className="actions">
      <span className="action action-reply" title="Réponses">
        <ReplyIcon /> <span>{formatCount(metrics.replies)}</span>
      </span>
      <span className="action action-retweet" title="Reposts">
        <RetweetIcon /> <span>{formatCount(metrics.retweets)}</span>
      </span>
      <span className={`action action-like${metrics.liked ? ' active' : ''}`} title="J'aime">
        <HeartIcon filled={metrics.liked} /> <span>{formatCount(metrics.likes)}</span>
      </span>
      <span className="action action-views" title="Vues">
        <ViewsIcon /> <span>{formatCount(metrics.views)}</span>
      </span>
      <span className="action-group">
        <span className={`action action-bookmark${metrics.bookmarked ? ' active' : ''}`} title="Signets">
          <BookmarkIcon filled={metrics.bookmarked} />
        </span>
        <span className="action action-share" title="Partager">
          <ShareIcon />
        </span>
      </span>
    </div>
  )
}
