# Fiche 04 — Envoyer la commande

**Durée** : 1 h 30 · **Slides** : deck « Partie 1 — Ionic et Vue », section 2 (formulaires, alertes, appels HTTP), jusqu'à la slide « Au TP : fiche 04 »

## Objectif

Saisir le numéro de table, confirmer, envoyer la commande à l'API, gérer les
erreurs, puis afficher l'historique des commandes.

## 1. L'APId

```
POST /api/commandes
{ "table": 4, "lignes": [ { "plat_id": 1, "quantite": 2 } ] }
```

| Réponse | Cas |
|---|---|
| 201 + la commande créée | tout va bien |
| 422 + `erreurs.table` ou `erreurs.lignes` | données invalides (table hors de 1 à 20…) |
| 409 + `message` | un plat est devenu indisponible |

Testez-la d'abord en ligne de commande :

```bash
curl -X POST http://localhost:3000/api/commandes \
     -H "Content-Type: application/json" \
     -d '{"table":4,"lignes":[{"plat_id":1,"quantite":2}]}'
```

Ajoutez dans `services/api.js` :

```js
creerCommande(commande) {
  return requete('/commandes', { method: 'POST', body: JSON.stringify(commande) });
},
getCommandes() {
  return requete('/commandes');
},
```

## 2. Le formulaire

Sous la liste du panier, ajoutez le champ et le bouton :

```html
<ion-input v-model="table" type="number" label="Numéro de table"
           label-placement="floating" fill="outline"
           :class="{ 'ion-invalid ion-touched': erreurTable }"
           :error-text="erreurTable" />
<ion-button expand="block" class="ion-margin-top" :disabled="envoi" @click="confirmer">
  Envoyer la commande
</ion-button>
```

## 3. Confirmer avant d'envoyer

```js
const alerte = await alertController.create({
  header: 'Confirmer la commande',
  message: `Table ${table.value} : ${formatAriary(total.value)}`,
  buttons: [
    { text: 'Annuler', role: 'cancel' },
    { text: 'Envoyer', role: 'confirm' },
  ],
});
await alerte.present();
const { role } = await alerte.onDidDismiss();
if (role === 'confirm') await envoyer();
```

## 4. Envoyer

Écrivez `envoyer()`. Elle doit, dans l'ordre :

1. afficher un indicateur de chargement (`loadingController`, même principe que le toast) ;
2. construire le corps attendu par l'API à partir de `lignes` (`map`) ;
3. appeler `api.creerCommande(...)` ;
4. en cas de succès : vider le panier et le champ, afficher un toast vert
   « Commande n°… envoyée », puis aller sur l'onglet Commandes
   (`ionRouter.navigate('/tabs/commandes', 'forward', 'replace')`) ;
5. en cas d'erreur 422 sur la table : afficher le message **sous le champ** (`erreurTable`) ;
6. pour toute autre erreur : un toast rouge avec `e.message` ;
7. dans tous les cas : fermer l'indicateur de chargement (`finally`).

**Vérifiez les trois cas** :

- table vide ou 25 : message sous le champ ;
- un plat épuisé dans le panier : pour le provoquer, ajoutez dans `MenuPage.vue`
  le plat 4 au panier en retirant temporairement le `:disabled` ; vous obtenez le toast rouge (409) ;
- table 4 : succès, et vous arrivez sur l'onglet Commandes.

## 5. La page Commandes

Dans `CommandesPage.vue`, affichez les commandes : numéro, table, date
(`formatDate`), le détail des lignes (« 2 × Romazava, 1 × Vary fotsy »),
le total et le statut dans un badge.

Chargez la liste avec le bon hook (réponse à Q2.2), et ajoutez un `ion-refresher`.

**Vérifiez** : passez une commande, allez sur Commandes, revenez au menu, passez une
autre commande : la liste contient bien les deux, sans recharger la page du navigateur.

## Questions

- **Q4.1** Pourquoi convertir avec `Number(table.value)` avant l'envoi ? Que renvoie un `ion-input` de type `number` ?
- **Q4.2** Quel rôle joue `finally` dans `envoyer()` ? Que se passerait-il sans lui en cas d'erreur ?
- **Q4.3** Pourquoi l'API vérifie-t-elle la table alors que l'application pourrait le faire ? Faut-il aussi vérifier côté application ?

**Faites un commit** : `git commit -am "fiche 04 - application JS complete"`. Il servira à la fiche 07.
