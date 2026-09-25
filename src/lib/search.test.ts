import { describe, expect, it } from 'vitest'
import type { Tweet } from '../types'
import { searchTweets } from './search'

const author = { name: 'Auteur', handle: 'auteur' }
const tweets: Tweet[] = [
  { id: 'rag', author, text: 'Un article sur le RAG', tags: ['rag'] },
  { id: 'ragtime', author, text: 'Du jazz #ragtime' },
  {
    id: 'source',
    author: { name: 'Élodie', handle: 'elo' },
    text: 'Rien de spécial',
    card: { kind: 'link', title: 'Lien', domain: 'example.org' },
    source: { url: 'https://x.com/elo/status/1234567890', screenshot: 'IMG_4242.PNG' },
  },
  {
    id: 'quote',
    author,
    text: 'Je cite',
    quoted: { id: 'inner', author, text: 'Le tweet cité parle de #Été' },
  },
]
const ids = (query: string) => searchTweets(tweets, query).map((t) => t.id)

describe('searchTweets', () => {
  it('renvoie tout pour une requête vide', () => {
    expect(ids('  ')).toHaveLength(tweets.length)
  })

  it('cherche un tag exact, sans les tags plus longs', () => {
    expect(ids('#rag')).toEqual(['rag'])
    expect(ids('#ragtime')).toEqual(['ragtime'])
    expect(ids('#ra')).toEqual([])
  })

  it('trouve les hashtags du tweet cité, sans tenir compte des accents', () => {
    expect(ids('#ete')).toEqual(['quote'])
  })

  it("cherche aussi dans l'URL, le screenshot et le domaine de la carte", () => {
    expect(ids('1234567890')).toEqual(['source'])
    expect(ids('img_4242')).toEqual(['source'])
    expect(ids('example.org')).toEqual(['source'])
  })

  it('exige tous les mots, sans tenir compte des accents ni de la casse', () => {
    expect(ids('elodie special')).toEqual(['source'])
    expect(ids('@elo rag')).toEqual([])
  })
})
