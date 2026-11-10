<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Commandes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ion-refresh="rafraichir">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="chargement" class="ion-text-center ion-padding">
        <ion-spinner />
      </div>
      <div v-else-if="erreur" class="ion-padding">
        <ion-text color="danger">{{ erreur }}</ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>
      <ion-list v-else-if="commandes.length">
        <ion-item v-for="commande in commandes" :key="commande.id">
          <ion-label>
            <h2>Commande n°{{ commande.id }} · Table {{ commande.table }}</h2>
            <p>{{ formatDate(commande.date) }}</p>
            <p>{{ detailsLignes(commande.lignes) }}</p>
            <p>Total : <strong>{{ formatAriary(commande.total) }}</strong></p>
          </ion-label>
          <ion-badge slot="end" color="primary">{{ commande.statut }}</ion-badge>
        </ion-item>
      </ion-list>
      <p v-else class="ion-text-center ion-padding">
        <ion-text color="medium">Aucune commande pour le moment.</ion-text>
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonRefresher, IonRefresherContent,
  onIonViewWillEnter,
} from '@ionic/vue';
import api from '@/services/api';
import { formatAriary, formatDate } from '@/utils/format';

const commandes = ref([]);
const chargement = ref(true);
const erreur = ref(null);

function detailsLignes(lignes) {
  return lignes.map((ligne) => `${ligne.quantite} × ${ligne.nom}`).join(', ');
}

async function charger() {
  chargement.value = true;
  erreur.value = null;
  try {
    commandes.value = await api.getCommandes();
  } catch (e) {
    erreur.value = e.message || 'Impossible de charger les commandes.';
  } finally {
    chargement.value = false;
  }
}

async function rafraichir(event) {
  await charger();
  event.target.complete();
}

onIonViewWillEnter(charger);
</script>
