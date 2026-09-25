const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('fr', { granularity: 'grapheme' }) : null

/** Découpe en caractères visibles : un emoji, même composé, compte pour un */
export function graphemes(s: string): string[] {
  return segmenter ? Array.from(segmenter.segment(s), (g) => g.segment) : Array.from(s)
}
