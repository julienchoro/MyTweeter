import { describe, expect, it } from 'vitest'
import { tokenize, truncateTokens, type Token } from './linkify'

/** Représentation compacte : [type:valeur→href] pour les liens */
function show(text: string): string {
  return tokenize(text)
    .map((t) => (t.type === 'text' ? t.value : `[${t.type}:${t.value}→${t.href}]`))
    .join('')
}

describe('tokenize', () => {
  it('ne transforme pas une adresse e-mail en mention', () => {
    expect(show('mail john@example.com now')).toBe('mail john@example.com now')
  })

  it('reconnaît les mentions, sans la ponctuation qui suit', () => {
    expect(show('hi @swmansion! and @a_b.')).toBe(
      'hi [mention:@swmansion→https://x.com/swmansion]! and [mention:@a_b→https://x.com/a_b].',
    )
  })

  it("exclut la ponctuation finale et les parenthèses non ouvertes de l'URL", () => {
    expect(show('(https://example.com)')).toBe('([url:https://example.com→https://example.com])')
    expect(show('see https://example.com/a.')).toBe('see [url:https://example.com/a→https://example.com/a].')
  })

  it("garde les parenthèses qui font partie de l'URL", () => {
    expect(show('https://en.wikipedia.org/wiki/Foo_(bar) ok')).toBe(
      '[url:https://en.wikipedia.org/wiki/Foo_(bar)→https://en.wikipedia.org/wiki/Foo_(bar)] ok',
    )
  })

  it('reconnaît les domaines nus avec www, sous-domaines et chemins', () => {
    expect(show('www.example.com and github.com/foo/bar, done')).toBe(
      '[url:www.example.com→https://www.example.com] and [url:github.com/foo/bar→https://github.com/foo/bar], done',
    )
    expect(show('docs.anthropic.com')).toBe('[url:docs.anthropic.com→https://docs.anthropic.com]')
  })

  it('ne transforme pas les noms de fichiers en liens', () => {
    const text = '> route.py - costs.log - app.js - index.ts - policy.md'
    expect(show(text)).toBe(text)
  })

  it('ne coupe pas un domaine plus long au milieu', () => {
    expect(show('example.company')).toBe('example.company')
  })

  it('reconnaît les hashtags, y compris accentués, mais pas C# ni #1', () => {
    expect(show('C# and #rag, #1 #été')).toBe(
      'C# and [hashtag:#rag→https://x.com/hashtag/rag], #1 [hashtag:#été→https://x.com/hashtag/%C3%A9t%C3%A9]',
    )
  })
})

describe('truncateTokens', () => {
  const values = (tokens: Token[]) => tokens.map((t) => t.value)

  it('retire un lien entier plutôt que de le couper', () => {
    const r = truncateTokens(tokenize('aaaa @swmansion bbb'), 10)
    expect(r.truncated).toBe(true)
    expect(values(r.tokens)).toEqual(['aaaa'])
  })

  it('ne coupe pas un emoji en deux', () => {
    const r = truncateTokens(tokenize('abc 🧪🧪 def'), 5)
    expect(values(r.tokens)).toEqual(['abc 🧪'])
  })

  it('compte un emoji composé comme un seul caractère', () => {
    const r = truncateTokens(tokenize('abc 👨‍👩‍👧 def'), 5)
    expect(values(r.tokens)).toEqual(['abc 👨‍👩‍👧'])
  })

  it('ne tronque pas un texte assez court', () => {
    const tokens = tokenize('court @a')
    expect(truncateTokens(tokens, 280)).toEqual({ tokens, truncated: false })
  })
})
