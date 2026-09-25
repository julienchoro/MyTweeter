/**
 * Format d'un tweet sauvegardé. C'est le contrat entre l'extracteur
 * (screenshot -> JSON) et l'interface d'affichage.
 * Seuls `id`, `author` et `text` sont obligatoires.
 */
export type Verified = 'blue' | 'gold' | 'gray'

export interface Author {
  name: string
  handle: string // sans le @
  avatarUrl?: string
  verified?: Verified
}

export interface Media {
  type: 'image' | 'video' | 'gif'
  url: string
  alt?: string
  /** largeur / hauteur, pour réserver la place avant chargement */
  aspectRatio?: number
}

/** Carte d'aperçu : article X, lien externe… */
export interface Card {
  kind: 'article' | 'link'
  title: string
  description?: string
  imageUrl?: string
  url?: string
  domain?: string
}

export interface Metrics {
  replies?: number
  retweets?: number
  likes?: number
  views?: number
  liked?: boolean
  bookmarked?: boolean
}

export interface Tweet {
  id: string
  author: Author
  /** Date ISO si connue */
  createdAt?: string
  /** Date telle qu'affichée sur le screenshot ("16 h", "1 j") si pas de date exacte */
  displayTime?: string
  text: string
  media?: Media[]
  card?: Card
  quoted?: Tweet
  metrics?: Metrics
  isAd?: boolean
  communityNotes?: boolean
  /** Métadonnées de sauvegarde, utiles pour la recherche */
  source?: {
    url?: string
    screenshot?: string
    savedAt?: string
  }
  tags?: string[]
}
