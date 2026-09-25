import type { Tweet as TweetData } from '../types'
import { Avatar } from './Avatar'
import { CommunityIcon, XLogo } from './Icons'
import { TweetActions } from './TweetActions'
import { TweetCard } from './TweetCard'
import { TweetHeader } from './TweetHeader'
import { TweetMedia } from './TweetMedia'
import { TweetText } from './TweetText'

/** Tweet cité, affiché en encart sous le tweet principal */
function QuotedTweet({ tweet }: { tweet: TweetData }) {
  return (
    <div className="quoted">
      <div className="quoted-top">
        <Avatar author={tweet.author} size={20} />
        <TweetHeader tweet={tweet} compact />
      </div>
      {tweet.text && <TweetText text={tweet.text} truncateAt={200} className="tweet-text quoted-text" />}
      {tweet.media && tweet.media.length > 0 && <TweetMedia media={tweet.media} />}
      {tweet.card && <TweetCard card={tweet.card} />}
    </div>
  )
}

export function Tweet({ tweet, onTagClick }: { tweet: TweetData; onTagClick?: (tag: string) => void }) {
  return (
    <article className="tweet">
      <Avatar author={tweet.author} />
      <div className="tweet-main">
        <div className="tweet-top">
          <TweetHeader tweet={tweet} />
          {tweet.source?.url && (
            <a className="open-on-x" href={tweet.source.url} target="_blank" rel="noreferrer" title="Ouvrir sur X">
              <XLogo />
            </a>
          )}
        </div>
        {tweet.text && <TweetText text={tweet.text} />}
        {tweet.media && tweet.media.length > 0 && <TweetMedia media={tweet.media} />}
        {tweet.card && <TweetCard card={tweet.card} />}
        {tweet.quoted && <QuotedTweet tweet={tweet.quoted} />}
        {tweet.communityNotes && (
          <div className="community-notes">
            <CommunityIcon /> <span>Évaluer les Notes de la Communauté proposées</span>
          </div>
        )}
        {tweet.tags && tweet.tags.length > 0 && (
          <div className="tags">
            {tweet.tags.map((t) => (
              <button key={t} className="tag" onClick={() => onTagClick?.(t)}>#{t}</button>
            ))}
          </div>
        )}
        <TweetActions metrics={tweet.metrics} />
      </div>
    </article>
  )
}
