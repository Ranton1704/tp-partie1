# Fiche 03 — Le panier

**Durée** : 1 h 30 · **Slides** : deck « Partie 1 — Ionic et Vue », section 2 (état partagé, retours utilisateur), jusqu'à la slide « Au TP : fiche 03 »

## Objectif

Créer un panier **partagé** entre plusieurs pages : on ajoute depuis le menu ou
le détail, on voit le nombre d'articles sur l'onglet, on ajuste les quantités
dans la page Panier.

## 1. Le problème

Le menu, la page de détail, l'onglet et la page Panier ont tous besoin du **même**
panier. Une variable `ref` déclarée dans une page n'existe que dans cette page.

La solution Vue est un **composable** : une fonction `useXxx()` placée dans
`src/composables/`, qui renvoie de l'état et des fonctions.

## 2. Créer `src/composables/usePanier.js`

```js
import { ref, computed } from 'vue';

// Déclaré EN DEHORS de la fonction : un seul panier pour toute l'application
const lignes = ref([]); // chaque ligne : { plat, quantite }

export function usePanier() {
  function ajouter(plat) {
    // TODO : si le plat est déjà dans le panier, quantite + 1,
    //        sinon ajouter une ligne { plat, quantite: 1 }
  }

  function changerQuantite(platId, delta) {
    // TODO : ajoute delta (+1 ou -1) à la quantité ;
    //        si la quantité tombe à 0, retirer la ligne
  }

  function vider() {
    lignes.value = [];
  }

  const nombreArticles = computed(() => /* TODO : somme des quantités */ 0);
  const total = computed(() => /* TODO : somme des prix × quantités */ 0);

  return { lignes, ajouter, changerQuantite, vider, nombreArticles, total };
}
```

Complétez les `TODO`. Pour `total`, souvenez-vous de la question Q0.2.

## 3. Ajouter depuis le menu

Dans `MenuPage.vue`, ajoutez à droite de chaque plat un bouton :

```html
<ion-button slot="end" fill="clear" :disabled="!plat.disponible"
            @click.stop.prevent="ajouterAuPanier(plat)">
  <ion-icon slot="icon-only" :icon="addCircleOutline" />
</ion-button>
```

Les icônes s'importent depuis `ionicons/icons`.

`ajouterAuPanier(plat)` appelle `ajouter(plat)` puis affiche un message bref :

```js
const toast = await toastController.create({
  message: `${plat.nom} ajouté au panier`,
  duration: 1500, position: 'top', color: 'secondary',
});
await toast.present();
```

**Expérience** : retirez `.stop.prevent` du `@click`. Que se passe-t-il quand on clique sur le bouton ? Remettez-le.

## 4. Ajouter depuis le détail

Dans `PlatDetailPage.vue`, ajoutez un bouton pleine largeur « Ajouter au panier »
(`expand="block"`), désactivé si le plat est épuisé. Il ajoute le plat puis revient
au menu avec `ionRouter.back()`.

## 5. Le badge sur l'onglet

Dans `TabsPage.vue`, utilisez `nombreArticles` pour afficher un `ion-badge` dans
le bouton d'onglet Panier, seulement s'il y a au moins un article.

## 6. La page Panier

Remplacez le contenu de `PanierPage.vue` :

- si le panier est vide : un message, et un bouton `router-link="/tabs/menu"` « Voir le menu » ;
- sinon, une liste : pour chaque ligne, le nom, « prix × quantité », et deux boutons
  `removeCircleOutline` / `addCircleOutline` qui appellent `changerQuantite` ;
- une dernière ligne « Total » ;
- un bouton « Vider » dans la barre de titre (`ion-buttons slot="end"`).

**Vérifiez** : ajoutez des plats depuis le menu, passez sur l'onglet Panier,
modifiez les quantités, revenez au menu : le badge suit.

## Défi

Le compteur de quantité peut descendre trop bas par double-clic rapide ?
Vérifiez que `changerQuantite` ne laisse jamais une quantité négative.

## Questions

- **Q3.1** Que se passerait-il si `const lignes = ref([])` était écrit **à l'intérieur** de `usePanier()` ? Essayez et décrivez.
- **Q3.2** Qu'avez-vous observé sans `.stop.prevent` ? Expliquez la propagation de l'événement.
- **Q3.3** Votre calcul du `total` fonctionne-t-il avec `l.plat.prix * l.quantite` ? Et avec `t + l.plat.prix` pour des quantités de 1 ? Expliquez la différence.
