import { useEffect, useRef, useState } from 'react'
import { COLOR_LABELS, PRESETS, type ThemeColors, type ThemeId } from '../lib/themes'
import { PaletteIcon } from './Icons'

interface Props {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  custom: ThemeColors
  setCustom: (c: ThemeColors) => void
}

function Swatch({ colors }: { colors: ThemeColors }) {
  return (
    <span className="swatch" style={{ background: colors.bg, borderColor: colors.border }}>
      <span style={{ background: colors.text }} />
      <span style={{ background: colors.accent }} />
      <span style={{ background: colors.like }} />
    </span>
  )
}

export function ThemePicker({ themeId, setThemeId, custom, setCustom }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // ferme le panneau au clic extérieur ou avec Échap
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
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
              <button className="theme-customize" onClick={() => { setCustom(current.colors); setThemeId('custom') }}>
                Personnaliser à partir de « {current.name} »
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
