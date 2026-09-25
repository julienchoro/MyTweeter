import { useMemo, useState } from 'react'
import { Tweet } from './components/Tweet'
import { searchTweets } from './lib/search'
import type { Tweet as TweetData } from './types'
import data from './data/tweets.json'

const tweets = data as TweetData[]

export default function App() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchTweets(tweets, query), [query])

  return (
    <div className="layout">
      <header className="topbar">
        <h1>MyTweeter</h1>
        <input
          className="search"
          type="search"
          placeholder="Rechercher (texte, @auteur, #tag)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="count">
          {results.length} / {tweets.length} tweets
        </div>
      </header>
      <main className="timeline">
        {results.map((t) => (
          <Tweet key={t.id} tweet={t} onTagClick={(tag) => setQuery('#' + tag)} />
        ))}
        {results.length === 0 && <p className="empty">Aucun tweet ne correspond à « {query} ».</p>}
      </main>
    </div>
  )
}
