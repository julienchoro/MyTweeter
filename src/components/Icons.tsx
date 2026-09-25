import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': true } as const

export const ReplyIcon = (p: P) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M12 4.5h-1.5a7 7 0 0 0 0 14H11v2.5l4.5-3a7 7 0 0 0-3.5-13.5Z" />
  </svg>
)

export const RetweetIcon = (p: P) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 9 7 6.5 9.5 9M7 7v8a2 2 0 0 0 2 2h4.5M19.5 15 17 17.5 14.5 15M17 17V9a2 2 0 0 0-2-2h-4.5" />
  </svg>
)

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  </svg>
)

export const ViewsIcon = (p: P) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <path d="M5 20V13M10 20V5M15 20v-9M20 20V9" />
  </svg>
)

export const BookmarkIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M6 3.5h12v17l-6-4.2-6 4.2v-17Z" />
  </svg>
)

export const ShareIcon = (p: P) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15V3.5M7.5 8 12 3.5 16.5 8M4.5 14v5.5h15V14" />
  </svg>
)

export const CommunityIcon = (p: P) => (
  <svg {...base} {...p} fill="currentColor">
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M2 19c0-3.3 2.7-6 6-6s6 2.7 6 6H2Zm12.5 0c0-2-.8-3.9-2.1-5.2A6 6 0 0 1 22 19h-7.5Z" />
  </svg>
)

export const XLogo = (p: P) => (
  <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...p} fill="currentColor">
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.3 4.7H5.5l11.2 14.5Z" />
  </svg>
)

const badgeColors = { blue: '#1d9bf0', gold: '#e2b719', gray: '#829aab' }

export const VerifiedBadge = ({ kind = 'blue' }: { kind?: keyof typeof badgeColors }) => (
  <svg viewBox="0 0 22 22" width={18} height={18} aria-label="Compte certifié" role="img" className="verified">
    <path
      fill={badgeColors[kind]}
      d="M20.4 11c0-1.4-.8-2.6-2-3.2.4-1.3.2-2.8-.8-3.8s-2.4-1.3-3.8-.8C13.3 2 12.1 1.2 10.7 1.2S8.1 2 7.5 3.2c-1.3-.5-2.8-.2-3.8.8S2.4 6.4 2.9 7.8C1.7 8.4.9 9.6.9 11s.8 2.6 2 3.2c-.5 1.3-.2 2.8.8 3.8s2.4 1.3 3.8.8c.6 1.2 1.8 2 3.2 2s2.6-.8 3.2-2c1.3.5 2.8.2 3.8-.8s1.3-2.4.8-3.8c1.1-.6 1.9-1.8 1.9-3.2Z"
    />
    <path fill="#fff" d="m9.6 14.9-3.4-3.4 1.3-1.3 2.1 2.1 4.9-5.3 1.4 1.3-6.3 6.6Z" />
  </svg>
)

export const PaletteIcon = (p: P) => (
  <svg {...base} {...p} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.5-1-2.6 0-1 .8-1.7 1.8-1.7h2.2a3.7 3.7 0 0 0 3.7-3.7c0-4.2-3.8-7.3-8.5-7.3Z" />
    <circle cx="7.8" cy="11" r="1.1" fill="currentColor" />
    <circle cx="10.5" cy="7.4" r="1.1" fill="currentColor" />
    <circle cx="15" cy="7.8" r="1.1" fill="currentColor" />
  </svg>
)
