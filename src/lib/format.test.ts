import { describe, expect, it } from 'vitest'
import { formatCount, formatFullDate, formatTime } from './format'

describe('formatCount', () => {
  it('formate comme X en français, sans espace avant l’unité', () => {
    expect(formatCount(0)).toBe('')
    expect(formatCount(undefined)).toBe('')
    expect(formatCount(184)).toBe('184')
    expect(formatCount(6000)).toBe('6k')
    expect(formatCount(24_900)).toBe('24,9k')
    expect(formatCount(1_200_000)).toBe('1,2M')
    expect(formatCount(1_500_000_000)).toBe('1,5Md')
  })
})

describe('formatTime', () => {
  const now = new Date(2026, 8, 25, 12, 0, 0)

  it('affiche une durée relative dans la semaine', () => {
    expect(formatTime(new Date(2026, 8, 25, 4, 0).toISOString(), undefined, now)).toBe('8 h')
    expect(formatTime(new Date(2026, 8, 24, 11, 0).toISOString(), undefined, now)).toBe('1 j')
  })

  it('affiche la date au-delà de la semaine, avec l’année si elle diffère', () => {
    expect(formatTime(new Date(2026, 2, 24, 10, 0).toISOString(), undefined, now)).toBe('24 mars')
    expect(formatTime(new Date(2025, 2, 24, 10, 0).toISOString(), undefined, now)).toBe('24 mars 2025')
  })

  it('accepte les variantes ISO courantes', () => {
    const expected = formatTime('2026-09-25T06:00:00Z', undefined, now)
    expect(formatTime('2026-09-25 06:00:00z', undefined, now)).toBe(expected)
    expect(formatTime('2026-09-25T08:00:00+0200', undefined, now)).toBe(expected)
  })

  it('prend une date seule comme un jour local, sans décalage', () => {
    expect(formatTime('2026-03-24', undefined, now)).toBe('24 mars')
    expect(formatTime('2026-09-24', undefined, now)).toBe('24 sept.')
  })

  it('revient au texte du screenshot si la date est absente, non ISO ou invalide', () => {
    expect(formatTime(undefined, '16 h', now)).toBe('16 h')
    expect(formatTime('24 sept. 2026', '16 h', now)).toBe('16 h')
    expect(formatTime('2026-02-31T10:00', '16 h', now)).toBe('16 h')
    expect(formatTime('n’importe quoi', undefined, now)).toBe('')
  })

  it('affiche la date pour une date future plutôt que « 1 s »', () => {
    expect(formatTime(new Date(2026, 8, 26, 12, 0).toISOString(), undefined, now)).toBe('26 sept.')
  })
})

describe('formatFullDate', () => {
  it('omet l’heure pour une date seule et ignore une date illisible', () => {
    expect(formatFullDate('2026-03-24')).toBe('24 mars 2026')
    expect(formatFullDate('pas une date')).toBeUndefined()
    expect(formatFullDate(undefined)).toBeUndefined()
  })
})
