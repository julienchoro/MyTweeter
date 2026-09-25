# MyTweeter

Affiche en React, avec l'apparence de X, les tweets sauvegardés (souvent à partir de screenshots), et permet de les rechercher.

```bash
npm install
npm run dev
```

## Principe

```
screenshot ──► extracteur (déjà existant) ──► JSON (format `Tweet`) ──► interface React + recherche
```

L'interface ne dépend que du format JSON défini dans `src/types.ts`. Il suffit que l'extracteur produise
un tableau de `Tweet` dans `src/data/tweets.json` (ou plus tard via une API).

Champs obligatoires : `id`, `author { name, handle }`, `text`. Tout le reste est optionnel :

| Champ | Rôle |
|---|---|
| `author.verified` | `"blue"`, `"gold"` ou `"gray"` |
| `createdAt` / `displayTime` | date ISO si connue, sinon le texte vu sur le screenshot (`"16 h"`) |
| `media[]` | images, vidéos ou GIFs (1 à 4, affichés en grille) |
| `card` | aperçu d'article ou de lien (titre, description, image) |
| `quoted` | tweet cité (même format, imbriqué) |
| `metrics` | réponses, reposts, likes, vues, `liked`, `bookmarked` |
| `communityNotes`, `isAd` | bandeau Notes de la Communauté, libellé « Publicité » |
| `source` | URL du tweet, chemin du screenshot d'origine, date de sauvegarde |
| `tags` | tags perso, cliquables pour filtrer |

## Thèmes

Le bouton palette en haut à droite propose : Système (suit l'appareil), Sombre, Dim, Clair, Sépia, Nord,
Dracula, et un thème **Perso** éditable (7 couleurs, partir d'un préréglage avec « Personnaliser »).
Le choix est gardé dans le navigateur.

Pour ajouter un préréglage, il suffit d'ajouter une entrée à `PRESETS` dans `src/lib/themes.ts` :
les autres teintes (survol, champs, fonds secondaires) sont dérivées automatiquement en CSS.

## Structure

```
src/
  types.ts              format de données
  data/tweets.json      tweets (exemples tirés de screenshots)
  lib/search.ts         recherche (texte, @auteur, #tag, tweet cité), insensible aux accents
  lib/format.ts         « 24,9k », « 8 h »…
  lib/themes.ts         préréglages de thèmes + thème perso
  components/
    Tweet.tsx           tweet complet + tweet cité
    TweetText.tsx       liens, @mentions, #hashtags, « Voir plus »
    TweetMedia.tsx      grille de médias
    TweetCard.tsx       carte article / lien
    TweetActions.tsx    barre de métriques
    ThemePicker.tsx     panneau de choix / édition du thème
```
