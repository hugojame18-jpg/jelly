# Reproduction de fr.jellycat.com

Reproduction statique de la boutique en ligne Jellycat France, réalisée à des fins
d'exercice et d'apprentissage front-end (HTML / CSS / JavaScript, sans framework
ni dépendance).

> **Avertissement**
> Ce dépôt n'est ni affilié à, ni approuvé par Jellycat Limited. « Jellycat », le
> logo, les visuels produits et les textes descriptifs appartiennent à Jellycat
> Limited et restent leur propriété. Les images sont chargées depuis le CDN
> d'origine et ne sont pas redistribuées ici. Ce code est publié pour la
> démonstration technique uniquement : ne le déployez pas en ligne tel quel et ne
> l'utilisez pas à des fins commerciales.

## Lancer en local

```bash
node server.js
```

Puis ouvrir <http://localhost:8123>.

## Pages

| Fichier | Rôle |
| --- | --- |
| `index.html` | Accueil : carrousel héros, rails produits, cartes catégories, bannière Purrks, Instagram, pied de page |
| `category.html?c=<clé>` | Page catégorie : grille produits, tri, sous-catégories |
| `product.html?p=<slug>` | Fiche produit : galerie, prix, accordéons, avis, rail « Pour vous » |

## Données

| Fichier | Contenu |
| --- | --- |
| `products.js` | 9 fiches produit complètes (nom, prix, SKU, dimensions, description, galerie) |
| `categories.js` | 14 catégories : 9 avec grille produits, 5 pages d'atterrissage |

## Comportements implémentés

- Carrousel héros automatique (7 s) avec flèches et pastilles
- Rails produits défilables
- Tri des grilles catégorie (A-Z, Z-A, prix croissant/décroissant, nouveautés)
- Panier mémorisé dans `localStorage`, **limité à 1 article par commande**
- Mise en page adaptative (points de rupture 1100 / 900 / 640 px)

## Limites connues

- Pas de méga-menus déroulants dans la navigation
- Pas de panneau de filtres ni de pagination sur les grilles
- Les fiches produit hors des 9 détaillées affichent nom, prix et visuel, sans
  description ni avis
- Pas de tunnel de commande ni de back-end
