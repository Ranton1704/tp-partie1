# Fiche 02 — Navigation et cycle de vie

**Durée** : 1 h · **Slides** : deck « Partie 1 — Ionic et Vue », section 2 (navigation, cycle de vie), jusqu'à la slide « Au TP : fiche 02 »

## Objectif

Ouvrir une page de détail pour chaque plat, revenir au menu avec l'animation de
retour, et comprendre le piège n°1 d'Ionic : **le cache des pages**.

## 1. Une route avec paramètre

Dans `router/index.js`, ajoutez une route enfant, à côté de `menu` :

```js
{ path: 'menu/:id', component: () => import('@/views/PlatDetailPage.vue') },
```

Ajoutez `getPlat(id)` dans `services/api.js` (route `GET /plats/:id`).

## 2. La page de détail

Créez `views/PlatDetailPage.vue`. Elle doit :

- afficher dans la barre un bouton retour :

```html
<ion-buttons slot="start">
  <ion-back-button default-href="/tabs/menu" text="Menu" />
</ion-buttons>
```

- lire l'identifiant dans l'adresse avec `useRoute()` (de `vue-router`) : `route.params.id` ;
- charger le plat au montage, puis l'afficher dans une `ion-card`
  (`ion-card-header`, `ion-card-subtitle` pour la catégorie, `ion-card-title`, `ion-card-content`) ;
- afficher « Ce plat n'existe pas. » si l'API répond 404. L'erreur levée par `api.js`
  contient `e.statut`.

**Vérifiez** : ouvrez directement <http://localhost:8100/tabs/menu/99>.

## 3. Rendre la liste cliquable

Dans `MenuPage.vue`, ajoutez sur chaque `ion-item` :

```html
:router-link="`/tabs/menu/${plat.id}`"
```

Cliquez sur un plat : la page glisse depuis la droite. Le bouton retour la fait
glisser dans l'autre sens. Ionic gère une **pile** de pages, comme une application native.

## 4. Naviguer depuis le code

Pour revenir en arrière ou changer de page depuis une fonction, utilisez
`useIonRouter()` plutôt que `useRouter()` : il conserve les animations.

```js
import { useIonRouter } from '@ionic/vue';
const ionRouter = useIonRouter();
ionRouter.back();                       // revenir
ionRouter.navigate('/tabs/commandes', 'forward', 'replace'); // aller ailleurs
```

Vous l'utiliserez à la fiche 03.

## 5. L'expérience du cache

Dans `MenuPage.vue`, ajoutez temporairement :

```js
import { onMounted, onUnmounted } from 'vue';
import { onIonViewWillEnter, onIonViewDidLeave } from '@ionic/vue';

onMounted(() => console.log('MENU onMounted'));
onUnmounted(() => console.log('MENU onUnmounted'));
onIonViewWillEnter(() => console.log('MENU ionViewWillEnter'));
onIonViewDidLeave(() => console.log('MENU ionViewDidLeave'));
```

Console ouverte, faites ce parcours : Menu → onglet Panier → onglet Menu → un plat → retour.
Notez chaque message affiché.

Retirez ensuite ces lignes (sauf le `onMounted` d'origine).

## Questions

- **Q2.1** Recopiez la suite des messages observés. Combien de fois `onMounted` s'est-il exécuté ?
- **Q2.2** La page Commandes doit afficher la liste à jour **chaque fois** qu'on ouvre l'onglet. Dans quel hook faudra-t-il charger les données, et pourquoi pas dans `onMounted` ?
- **Q2.3** Quelle différence voyez-vous entre `router-link` sur un `ion-item` et un simple lien `<a href>` ? Essayez.
