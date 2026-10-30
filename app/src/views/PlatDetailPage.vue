<template>
    <ion-page>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-back-button default-href="/tabs/menu" text="Menu" />
            </ion-buttons>
            <ion-title>Détail du plat</ion-title>
        </ion-toolbar>

        <ion-content>
            <ion-refresher slot="fixed" @ion-refresh="rafraichir">
                <ion-refresher-content />
            </ion-refresher>
            <div v-if="chargement" class="ion-text-center ion-padding">
                <ion-spinner />
            </div>

            <div v-else-if="erreur" class="ion-padding">
                <ion-text color="danger">
                    <p>{{ erreur }}</p>
                </ion-text>
                <ion-button expand="block" @click="charger">Réessayer</ion-button>
            </div>

            <ion-card>
                <ion-card-header>
                    <ion-card-title color="primary">{{ plat.nom }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <p>Categories : {{ plat.categorie?.nom }}</p>
                    <p>{{ plat.description }}</p>
                    <p>Prix : {{ formatAriary(plat.prix) }}</p>
                    <ion-button slot="end" fill="clear" :disabled="!plat.disponible"
                        @click.stop.prevent="ajouterAupanier(plat)">
                      <p>Ajouter au panier: </p><ion-icon slot="icon-only" :icon="addCircleOutline" />
                    </ion-button>
                </ion-card-content>

            </ion-card>
        </ion-content>

    </ion-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
    IonPage, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader,
    IonSpinner, IonText, IonButton, IonCardTitle, IonCardContent, IonRefresher, IonRefresherContent,
    IonIcon
} from '@ionic/vue';
import api from '@/services/api';
import { formatAriary } from '@/utils/format';
import { addCircleOutline } from 'ionicons/icons';
const plat = ref([]);
const categories = ref([]);
const erreur = ref(null);
const route = useRoute();
const chargement = ref(true);
import { usePanier } from '@/composables/usePanier';
import { toastController } from '@ionic/vue';



async function ajouterAupanier(plat){
  await usePanier().ajouter(plat);

  const toast = await toastController.create({
      message: `${plat.nom} ajouté au panier`,
      duration: 1500, position: 'top', color: 'secondary'
  
});
await toast.present();

}

async function charger() {
    try {
        const id = route.params.id;
        plat.value = await api.getPlatById(id);
        categories.value = await api.getCategories();
    } catch (e) {
        if (e.statut === 404) {
            erreur.value = "Plat introuvable";
        } else {
            erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
        }
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