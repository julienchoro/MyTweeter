import type { Tweet } from '../types'

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function haystack(t: Tweet): string {
  const parts = [
    t.text,
    t.author.name,
    '@' + t.author.handle,
    t.card?.title,
    t.card?.description,
    ...(t.tags ?? []).map((tag) => '#' + tag),
    ...(t.media ?? []).map((m) => m.alt),
  ]
  if (t.quoted) parts.push(haystack(t.quoted))
  return normalize(parts.filter(Boolean).join(' \n '))
}

/**
 * Recherche plein texte simple : tous les mots de la requête doivent apparaître
 * (texte, auteur, tags, tweet cité, carte). Insensible à la casse et aux accents.
 * `@handle` et `#tag` fonctionnent aussi.
 */
export function searchTweets(tweets: Tweet[], query: string): Tweet[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return tweets
  return tweets.filter((t) => {
    const h = haystack(t)
    return terms.every((term) => h.includes(term))
  })
}
