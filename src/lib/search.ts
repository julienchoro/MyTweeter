import type { Tweet } from '../types'
import { tokenize } from './linkify'

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

interface Indexed {
  /** Tout le texte cherchable, normalisé */
  text: string
  /** Tags perso et hashtags du texte, normalisés, sans le # */
  hashtags: Set<string>
}

// les tweets ne changent pas : on indexe chacun une seule fois
const cache = new WeakMap<Tweet, Indexed>()

function index(t: Tweet): Indexed {
  const cached = cache.get(t)
  if (cached) return cached

  const hashtags = new Set<string>()
  for (const tag of t.tags ?? []) hashtags.add(normalize(tag.replace(/^#/, '')))
  for (const token of tokenize(t.text)) {
    if (token.type === 'hashtag') hashtags.add(normalize(token.value.slice(1)))
  }

  const parts = [
    t.text,
    t.author.name,
    '@' + t.author.handle,
    t.card?.title,
    t.card?.description,
    t.card?.domain,
    t.card?.url,
    t.source?.url,
    t.source?.screenshot,
    ...(t.tags ?? []).map((tag) => '#' + tag.replace(/^#/, '')),
    ...(t.media ?? []).map((m) => m.alt),
  ]
  if (t.quoted) {
    const q = index(t.quoted)
    parts.push(q.text)
    q.hashtags.forEach((h) => hashtags.add(h))
  }

  const result = { text: normalize(parts.filter(Boolean).join(' \n ')), hashtags }
  cache.set(t, result)
  return result
}

/**
 * Recherche plein texte : tous les mots de la requête doivent apparaître
 * (texte, auteur, tags, tweet cité, carte, URL et screenshot d'origine).
 * Insensible à la casse et aux accents. `@handle` fonctionne aussi.
 * `#tag` cherche le tag ou le hashtag exact : #rag ne trouve pas #ragtime.
 */
export function searchTweets(tweets: Tweet[], query: string): Tweet[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return tweets
  return tweets.filter((t) => {
    const { text, hashtags } = index(t)
    return terms.every((term) => (term.length > 1 && term.startsWith('#') ? hashtags.has(term.slice(1)) : text.includes(term)))
  })
}
