import { useMemo, useState } from 'react'
import { AutoThemeIcon, MoonIcon, SunIcon } from './components/Icons'
import { Tweet } from './components/Tweet'
import { searchTweets } from './lib/search'
import { useTheme, type Theme } from './lib/theme'
import type { Tweet as TweetData } from './types'
import data from './data/tweets.json'

const tweets = data as TweetData[]

const nextTheme: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const themeLabel: Record<Theme, string> = { system: 'Thème : système', light: 'Thème : clair', dark: 'Thème : sombre' }
const ThemeIcon = { system: AutoThemeIcon, light: SunIcon, dark: MoonIcon }

export default function App() {
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useTheme()
  const Icon = ThemeIcon[theme]
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
        <button
          className="theme-toggle"
          onClick={() => setTheme(nextTheme[theme])}
          title={themeLabel[theme]}
          aria-label={themeLabel[theme]}
        >
          <Icon width={20} height={20} />
        </button>
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
