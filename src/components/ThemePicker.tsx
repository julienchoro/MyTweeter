import { useEffect, useRef, useState } from 'react'
import { COLOR_LABELS, isEdited, PRESETS, useTheme, type ThemeColors } from '../lib/themes'
import { PaletteIcon } from './Icons'

function Swatch({ colors }: { colors: ThemeColors }) {
  return (
    <span className="swatch" style={{ background: colors.bg, borderColor: colors.border }}>
      <span style={{ background: colors.text }} />
      <span style={{ background: colors.accent }} />
      <span style={{ background: colors.like }} />
    </span>
  )
}

// Le hook vit ici plutôt que dans App : changer une couleur ne re-rend que ce panneau
export function ThemePicker() {
  const { themeId, setThemeId, custom, setCustom } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // ferme le panneau au clic extérieur ou avec Échap
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = PRESETS.find((p) => p.id === themeId)

  return (
    <div className="theme-picker" ref={ref}>
      <button
        className="theme-toggle"
        onClick={() => setOpen(!open)}
        title="Thème"
        aria-label="Choisir un thème"
        aria-expanded={open}
      >
        <PaletteIcon width={20} height={20} />
      </button>

      {open && (
        <div className="theme-panel" role="dialog" aria-label="Thème">
          <div className="theme-panel-title">Thème</div>
          <div className="theme-list">
            <button className={`theme-option${themeId === 'system' ? ' selected' : ''}`} onClick={() => setThemeId('system')}>
              <span className="swatch swatch-system" />
              Système
            </button>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                className={`theme-option${themeId === p.id ? ' selected' : ''}`}
                onClick={() => setThemeId(p.id)}
              >
                <Swatch colors={p.colors} />
                {p.name}
              </button>
            ))}
            <button
              className={`theme-option${themeId === 'custom' ? ' selected' : ''}`}
              onClick={() => setThemeId('custom')}
            >
              <Swatch colors={custom} />
              Perso
            </button>
          </div>

          {themeId === 'custom' ? (
            <div className="theme-editor">
              {(Object.keys(COLOR_LABELS) as (keyof ThemeColors)[]).map((key) => (
                <label key={key} className="color-row">
                  <input
                    type="color"
                    value={custom[key]}
                    onChange={(e) => setCustom({ ...custom, [key]: e.target.value })}
                  />
                  <span>{COLOR_LABELS[key]}</span>
                  <code>{custom[key]}</code>
                </label>
              ))}
            </div>
          ) : (
            current && (
              <button
                className="theme-customize"
                onClick={() => {
                  if (isEdited(custom) && !window.confirm('Remplacer ton thème Perso actuel par une copie de ce thème ?')) return
                  setCustom(current.colors)
                  setThemeId('custom')
                }}
              >
                Personnaliser à partir de « {current.name} »
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
