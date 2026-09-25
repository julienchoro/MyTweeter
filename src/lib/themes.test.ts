import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { isEdited, isThemeId, mix, parseCustom, PRESETS, schemeFor, themeVars } from './themes'

const dark = PRESETS.find((p) => p.id === 'dark')!
const light = PRESETS.find((p) => p.id === 'light')!

describe('themes', () => {
  it('mélange deux couleurs comme color-mix', () => {
    expect(mix('#ffffff', '#000000', 0.5)).toBe('#808080')
    expect(mix('#ff0000', '#0000ff', 0)).toBe('#0000ff')
  })

  it('déclare pour chaque préréglage un schéma cohérent avec son fond', () => {
    for (const p of PRESETS) expect(schemeFor(p.colors.bg), p.id).toBe(p.scheme)
  })

  it('refuse un id de thème inconnu', () => {
    expect(isThemeId('system')).toBe(true)
    expect(isThemeId('custom')).toBe(true)
    expect(isThemeId('nord')).toBe(true)
    expect(isThemeId('dracula-old')).toBe(false)
  })

  it('relit un thème perso en ignorant les valeurs invalides', () => {
    expect(parseCustom('{"bg":"#123456","text":"red","accent":42}', dark.colors)).toEqual({
      ...dark.colors,
      bg: '#123456',
    })
    expect(parseCustom('pas du json', dark.colors)).toEqual(dark.colors)
    expect(parseCustom(null, dark.colors)).toEqual(dark.colors)
  })

  it('détecte un thème perso modifié', () => {
    expect(isEdited({ ...light.colors })).toBe(false)
    expect(isEdited({ ...light.colors, accent: '#ff7a00' })).toBe(true)
  })

  // Le mode Système utilise les valeurs de index.css avant tout JavaScript :
  // elles doivent rester identiques aux préréglages Sombre et Clair.
  it('garde index.css aligné sur les préréglages Sombre et Clair', () => {
    const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
    const block = (start: string) => {
      const from = css.indexOf(start)
      return css.slice(from, css.indexOf('}', from))
    }
    const decls = (text: string) =>
      Object.fromEntries([...text.matchAll(/^\s*(--[\w-]+|color-scheme):\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]))

    const darkCss = decls(block(':root {'))
    const lightCss = decls(block('@media (prefers-color-scheme: light)'))
    for (const [k, v] of Object.entries(themeVars(dark.colors, dark.scheme))) expect(darkCss[k], k).toBe(v)
    for (const [k, v] of Object.entries(themeVars(light.colors, light.scheme))) expect(lightCss[k] ?? darkCss[k], k).toBe(v)
  })
})
