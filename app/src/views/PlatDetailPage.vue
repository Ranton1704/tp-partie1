<template>
    <ion-page>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-back-button default-href="/tabs/menu" text="Menu" />
            </ion-buttons>
            <ion-title>Détail du plat</ion-title>
        </ion-toolbar>
        
        <ion-content>
            <div v-if="chargement" class="ion-text-center ion-padding">
                <ion-spinner/>
            </div>

            <div v-else-if="erreur" class="ion-padding">
                <ion-text color="danger">
                    <p>{{ erreur }}</p>
                </ion-text>
                <ion-button expand="block" @click="charger">Réessayer</ion-button>
            </div>

            <ion-card>
                <ion-card-header>
                    <ion-card-subtitle></ion-card-subtitle>
                </ion-card-header>
            </ion-card>
        </ion-content>

    </ion-page>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useIonRouter } from '@ionic/vue';
import { IonPage, IonToolbar, IonButtons, IonBackButton, IonTitle,IonContent,IonCard,IonCardHeader,
         IonCardSubtitle,IonSpinner,IonText,IonButton } from '@ionic/vue';

import api from '@/services/api';
const plats = ref ([]);
const erreur = ref(null);

const ionRouter = useIonRouter();

async function charger() {
  try {
    plats.value = await api.getPlats();
  } catch (e) {
    erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
    console.error(e);
  }
}

onMounted(charger);
</script>