<template>
  <!-- ion-page : l'enveloppe obligatoire de chaque page -->
  <ion-page>
    <!-- En-tête fixe en haut de l'écran -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Menu du jour</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-toolbar>
      <ion-searchbar v-model="recherche" placeholder="Rechercher un plat" :debounce="250" />
    </ion-toolbar>

    <ion-segment v-model="categorieChoisie" scrollable @ion-change="charger">
      <ion-segment-button value="toutes"><ion-label>Toutes</ion-label></ion-segment-button>
      <ion-segment-button v-for="c in categories" :key="c.id" :value="c.id">
        <ion-label>{{ c.nom }}</ion-label>
      </ion-segment-button>
    </ion-segment>

    <!-- Zone qui défile -->
    <ion-content>
      <!-- Rafraîchissement par glissement vers le bas -->
      <ion-refresher slot="fixed" @ion-refresh="rafraichir">
        <ion-refresher-content />
      </ion-refresher>
      <!-- 1. Chargement en cours -->
      <div v-if="chargement" class="ion-text-center ion-padding">
        <ion-spinner />
      </div>

      <!-- 2. Erreur -->
      <div v-else-if="erreur" class="ion-padding">
        <ion-text color="danger">
          <p>{{ erreur }}</p>
        </ion-text>
        <ion-button expand="block" @click="charger">Réessayer</ion-button>
      </div>

      <!-- 3. La liste des plats -->

      <ion-list v-if="platsFiltres.length > 0">
        <ion-item v-for="plat in platsFiltres" :key="plat.id" :router-link="`/tabs/menu/${plat.id}`">
          
          <ion-label>
            <h2>{{ plat.nom }}</h2>
            <p>{{ plat.description }}</p>
            <p>{{ plat.categorie.nom }}</p>
          </ion-label>
          <ion-text color="primary">
            <p>{{ formatAriary(plat.prix) }}</p>
            <ion-badge v-if="!plat.disponible" color="medium">Épuisé</ion-badge>
          </ion-text>
          <ion-button slot="end" fill="clear" :disabled="!plat.disponible" @click.stop.prevent="ajouterAupanier(plat)">
            <ion-icon slot="icon-only" :icon="addCircleOutline" />
          </ion-button>
        </ion-item>
      </ion-list>
      <p v-else class="ion-padding">Aucun plat trouvé</p>

    </ion-content>


  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {
  IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonBadge, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSpinner, IonText, IonButton, IonSearchbar, IonIcon
} from '@ionic/vue';
import api from '@/services/api';
import { addCircleOutline } from 'ionicons/icons';
import { formatAriary } from '@/utils/format';
import { usePanier } from '@/composables/usePanier';
import { toastController } from '@ionic/vue';
const categories = ref([]);
const plat = ref([]);
const chargement = ref(true);
const erreur = ref(null);
const recherche = ref('');
const categorieChoisie = ref('toutes');

const platsFiltres = computed(() => {
  return plat.value.filter((plat) => {
    const correspondRecherche = plat.nom.toLowerCase().includes(recherche.value.toLowerCase());
    const correspondCategorie = categorieChoisie.value === 'toutes' || plat.categorie.id === categorieChoisie.value;
    return correspondRecherche && correspondCategorie;
  });
});

async function ajouterAupanier(plat){
  await usePanier().ajouter(plat);

  const toast = await toastController.create({
      message: `${plat.nom} ajouté au panier`,
      duration: 1500, position: 'top', color: 'secondary'
  
});
await toast.present();

}



async function charger() {
  chargement.value = true;
  erreur.value = null;
  try {
    plat.value = await api.getPlats();
    categories.value = await api.getCategories();
  } catch (e) {
    erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    console.error(e);
  } finally {
    chargement.value = false;
  }
}

async function rafraichir(event) {
  await charger();
  event.target.complete();
}
onMounted(charger);
</script>
