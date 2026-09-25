const compact = new Intl.NumberFormat('fr-FR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 24900 -> "24,9k", comme sur X en français */
export function formatCount(n?: number): string {
  if (n == null || n === 0) return ''
  if (n < 1000) return String(n)
  return compact.format(n).replace(/\s?k$/, 'k').replace(/\s?M$/, 'M').replace(/ /g, '')
}

/** Date relative courte : "8 h", "1 j", ou "25 sept." au-delà d'une semaine */
export function formatTime(iso?: string, fallback?: string): string {
  if (!iso) return fallback ?? ''
  const date = new Date(iso)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return `${Math.max(1, Math.floor(diff))} s`
  if (diff < 3600) return `${Math.floor(diff / 60)} min`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} j`
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  })
}

export function formatFullDate(iso?: string): string | undefined {
  if (!iso) return undefined
  return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
}
