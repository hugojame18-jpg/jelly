# Jellypin

Boutique en ligne fictive **Jellypin**, en HTML / CSS / JavaScript, sans framework
ni dépendance. Exercice de front-end : la structure, la mise en page et les
comportements sont modelés sur une boutique de peluches existante.

> **Avertissement**
> Projet d'apprentissage, sans lien avec aucune marque réelle. La maquette a été
> construite en s'inspirant de `fr.jellycat.com` ; les visuels produits sont
> encore chargés depuis le CDN d'origine et les textes descriptifs proviennent de
> ce site — ils appartiennent à **Jellycat Limited** et ne sont ni redistribués
> ici, ni utilisables commercialement. Remplacez-les par vos propres visuels et
> textes avant tout déploiement en ligne.

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
- Les images sont hébergées sur un CDN tiers : à remplacer par vos propres visuels
