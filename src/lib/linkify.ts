import { graphemes } from './text'

export type Token =
  | { type: 'text'; value: string }
  | { type: 'url' | 'mention' | 'hashtag'; value: string; href: string }

/** Extensions reconnues pour les domaines écrits sans http:// (pas .py, .md, .js… qui sont des fichiers) */
const TLDS = 'com|org|net|io|dev|ai|app|co|fr|be|ch|ca|de|uk|eu|me|gg|so|sh|xyz|tech|info|edu|gov|ly|tv|fm|to'

const PATTERN = new RegExp(
  [
    String.raw`(https?:\/\/[^\s<>"]+)`,
    String.raw`((?:www\.)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:${TLDS})(?![\w-])(?:\/[^\s<>"]*)?)`,
    String.raw`@(\w{1,15})(?!\w)`,
    // un hashtag doit contenir au moins une lettre (#1 n'en est pas un)
    String.raw`#([\p{L}\p{N}_]*\p{L}[\p{L}\p{N}_]*)`,
  ].join('|'),
  'giu',
)

/** Un @, # ou domaine collé à ce qui précède n'est pas un lien (ex. john@example.com, C#) */
const GLUED = /[\p{L}\p{N}_@#./&-]/u

const TRAILING = '.,;:!?\'"…'

function count(s: string, c: string): number {
  return s.split(c).length - 1
}

/** Retire la ponctuation finale et les parenthèses/crochets fermants non ouverts dans l'URL */
function trimUrl(url: string): string {
  for (;;) {
    const last = url.at(-1) ?? ''
    if (TRAILING.includes(last)) url = url.slice(0, -1)
    else if (last === ')' && count(url, '(') < count(url, ')')) url = url.slice(0, -1)
    else if (last === ']' && count(url, '[') < count(url, ']')) url = url.slice(0, -1)
    else return url
  }
}

export function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let pos = 0
  const pushText = (value: string) => {
    if (!value) return
    const prev = tokens.at(-1)
    if (prev?.type === 'text') prev.value += value
    else tokens.push({ type: 'text', value })
  }

  for (const m of text.matchAll(PATTERN)) {
    const start = m.index
    const [whole, url, domain, handle, tag] = m
    const glued = start > 0 && GLUED.test(text[start - 1])
    let token: Token | null = null

    if (url) {
      const value = trimUrl(url)
      token = { type: 'url', value, href: value }
    } else if (domain && !glued) {
      const value = trimUrl(domain)
      token = { type: 'url', value, href: `https://${value}` }
    } else if (handle && !glued) {
      token = { type: 'mention', value: whole, href: `https://x.com/${handle}` }
    } else if (tag && !glued) {
      token = { type: 'hashtag', value: whole, href: `https://x.com/hashtag/${encodeURIComponent(tag)}` }
    }

    if (!token) continue // reste dans le texte, ajouté avec le morceau suivant
    pushText(text.slice(pos, start))
    tokens.push(token)
    pos = start + token.value.length
  }
  pushText(text.slice(pos))
  return tokens
}

/**
 * Coupe à `max` caractères visibles sans jamais couper un lien, une mention
 * ou un emoji : un lien qui dépasse la limite est entièrement retiré.
 */
export function truncateTokens(tokens: Token[], max: number): { tokens: Token[]; truncated: boolean } {
  const out: Token[] = []
  let remaining = max
  for (const token of tokens) {
    const chars = graphemes(token.value)
    if (chars.length <= remaining) {
      out.push(token)
      remaining -= chars.length
      continue
    }
    if (token.type === 'text' && remaining > 0) {
      out.push({ type: 'text', value: chars.slice(0, remaining).join('') })
    }
    const last = out.at(-1)
    if (last?.type === 'text') last.value = last.value.trimEnd()
    return { tokens: out, truncated: true }
  }
  return { tokens, truncated: false }
}
