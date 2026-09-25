const compact = new Intl.NumberFormat('fr-FR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 24900 -> "24,9k", 1,5 milliard -> "1,5Md", comme sur X en français */
export function formatCount(n?: number): string {
  if (n == null || n === 0) return ''
  if (n < 1000) return String(n)
  // Intl sépare le nombre et l'unité par une espace insécable (U+00A0 ou U+202F selon la version)
  return compact.format(n).replace(/\s+/g, '')
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/i

/**
 * Lit `createdAt`. Une date seule ("2026-03-24") est prise comme un jour local,
 * pas minuit UTC, sinon elle s'afficherait la veille à l'ouest de Greenwich.
 * Seul le format ISO est accepté : les autres formats ("24 sept. 2026") sont lus
 * différemment selon les navigateurs. Renvoie null si la date est invalide.
 */
function parseDate(value?: string): { date: Date; dateOnly: boolean } | null {
  const v = value?.trim()
  if (!v) return null
  const dateOnly = DATE_ONLY.exec(v)
  const m = dateOnly ?? DATE_TIME.exec(v)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  // certains moteurs acceptent le 31 février et le reportent au 3 mars
  const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate()
  if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth) return null
  // forme stricte que tous les navigateurs lisent : "T", "Z" majuscule, décalage "+02:00"
  const iso = v.toUpperCase().replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2')
  const date = dateOnly ? new Date(y, mo - 1, d) : new Date(iso)
  return Number.isNaN(date.getTime()) ? null : { date, dateOnly: dateOnly != null }
}

/**
 * Date courte : "8 h", "1 j" dans la semaine, sinon "25 sept.".
 * Si `createdAt` est absent ou illisible, affiche `fallback` (le texte vu sur le screenshot).
 */
export function formatTime(value?: string, fallback?: string, now = new Date()): string {
  const parsed = parseDate(value)
  if (!parsed) return fallback ?? ''
  const { date, dateOnly } = parsed
  const diff = (now.getTime() - date.getTime()) / 1000
  if (!dateOnly && diff >= 0 && diff < 7 * 86400) {
    if (diff < 60) return `${Math.max(1, Math.floor(diff))} s`
    if (diff < 3600) return `${Math.floor(diff / 60)} min`
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`
    return `${Math.floor(diff / 86400)} j`
  }
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

/** Date complète pour l'infobulle, ou undefined si inconnue ou illisible */
export function formatFullDate(value?: string): string | undefined {
  const parsed = parseDate(value)
  if (!parsed) return undefined
  return parsed.date.toLocaleString(
    'fr-FR',
    parsed.dateOnly ? { dateStyle: 'long' } : { dateStyle: 'long', timeStyle: 'short' },
  )
}
