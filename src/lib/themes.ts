import { useEffect, useState } from 'react'

/** Les 7 couleurs qui définissent un thème ; le reste est dérivé en CSS */
export interface ThemeColors {
  bg: string
  text: string
  muted: string
  border: string
  accent: string
  like: string
  retweet: string
}

export interface ThemePreset {
  id: string
  name: string
  scheme: 'light' | 'dark'
  colors: ThemeColors
}

const x = { accent: '#1d9bf0', like: '#f91880', retweet: '#00ba7c' }

export const PRESETS: ThemePreset[] = [
  { id: 'dark', name: 'Sombre', scheme: 'dark', colors: { bg: '#000000', text: '#e7e9ea', muted: '#71767b', border: '#2f3336', ...x } },
  { id: 'dim', name: 'Dim', scheme: 'dark', colors: { bg: '#15202b', text: '#f7f9f9', muted: '#8b98a5', border: '#38444d', ...x } },
  { id: 'light', name: 'Clair', scheme: 'light', colors: { bg: '#ffffff', text: '#0f1419', muted: '#536471', border: '#eff3f4', ...x } },
  {
    id: 'sepia', name: 'Sépia', scheme: 'light',
    colors: { bg: '#f4ecd8', text: '#3b2f1e', muted: '#7a6a53', border: '#e2d5ba', accent: '#b5651d', like: '#c0392b', retweet: '#4f7942' },
  },
  {
    id: 'nord', name: 'Nord', scheme: 'dark',
    colors: { bg: '#2e3440', text: '#eceff4', muted: '#9aa5b8', border: '#434c5e', accent: '#88c0d0', like: '#bf616a', retweet: '#a3be8c' },
  },
  {
    id: 'dracula', name: 'Dracula', scheme: 'dark',
    colors: { bg: '#282a36', text: '#f8f8f2', muted: '#8f98c4', border: '#44475a', accent: '#bd93f9', like: '#ff79c6', retweet: '#50fa7b' },
  },
]

export const COLOR_LABELS: Record<keyof ThemeColors, string> = {
  bg: 'Fond',
  text: 'Texte',
  muted: 'Texte secondaire',
  border: 'Bordures',
  accent: 'Accent (liens)',
  like: "J'aime",
  retweet: 'Repost',
}

/** 'system', l'id d'un préréglage, ou 'custom' */
export type ThemeId = string

const KEY_THEME = 'mytweeter-theme'
const KEY_CUSTOM = 'mytweeter-custom-theme'
/** Variables résolues, relues par le script de index.html pour éviter un flash */
const KEY_VARS = 'mytweeter-theme-vars'

function load<T>(key: string, parse: (raw: string) => T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : parse(raw)
  } catch {
    return fallback
  }
}

function save(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // stockage indisponible (navigation privée…)
  }
}

/** Clair ou sombre selon la luminance du fond, pour les contrôles natifs */
export function schemeFor(bg: string): 'light' | 'dark' {
  const n = parseInt(bg.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? 'light' : 'dark'
}

function resolve(id: ThemeId, custom: ThemeColors): { colors: ThemeColors; scheme: 'light' | 'dark' } | null {
  if (id === 'custom') return { colors: custom, scheme: schemeFor(custom.bg) }
  const preset = PRESETS.find((p) => p.id === id)
  return preset ? { colors: preset.colors, scheme: preset.scheme } : null
}

function toVars(colors: ThemeColors, scheme: string): Record<string, string> {
  const vars: Record<string, string> = { 'color-scheme': scheme }
  for (const [k, v] of Object.entries(colors)) vars[`--${k}`] = v
  return vars
}

export function useTheme() {
  const [themeId, setThemeId] = useState<ThemeId>(() => load(KEY_THEME, (r) => r, 'system'))
  const [custom, setCustom] = useState<ThemeColors>(() =>
    load(KEY_CUSTOM, (r) => ({ ...PRESETS[1].colors, ...JSON.parse(r) }), PRESETS[1].colors),
  )

  useEffect(() => {
    const root = document.documentElement
    const resolved = resolve(themeId, custom)
    for (const k of ['color-scheme', ...Object.keys(COLOR_LABELS).map((c) => `--${c}`)]) root.style.removeProperty(k)

    if (!resolved) {
      save(KEY_THEME, null)
      save(KEY_VARS, null)
      return
    }
    const vars = toVars(resolved.colors, resolved.scheme)
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
    save(KEY_THEME, themeId)
    save(KEY_VARS, JSON.stringify(vars))
  }, [themeId, custom])

  useEffect(() => save(KEY_CUSTOM, JSON.stringify(custom)), [custom])

  return { themeId, setThemeId, custom, setCustom }
}
