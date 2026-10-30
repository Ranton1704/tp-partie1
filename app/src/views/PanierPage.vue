<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Panier</ion-title>
        <ion-buttons slot="end" v-if="lignes.length > 0">
          <ion-button @click="vider">Vider</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="lignes.length === 0" class="ion-text-center ion-padding">
        <p>Votre panier est vide</p>
        <ion-button router-link="/tabs/menu">Voir le menu</ion-button>
      </div>

      <div v-else>
        <ion-list>
          <ion-item v-for="ligne in lignes" :key="ligne.plat.id">
            <ion-label>
              <h2>{{ ligne.plat.nom }}</h2>
              <p>{{ formatAriary(ligne.plat.prix) }} × {{ ligne.quantite }}</p>
            </ion-label>

            <!-- Boutons pour modifier la quantité (+ / -) -->
            <div slot="end" style="display: flex; align-items: center; gap: 5px;">
              <ion-button fill="clear" color="medium" @click="changerQuantite(ligne.plat.id, -1)">
                <ion-icon slot="icon-only" :icon="removeCircleOutline" />
              </ion-button>
              
              <span>{{ ligne.quantite }}</span>

              <ion-button fill="clear" color="primary" @click="changerQuantite(ligne.plat.id, 1)">
                <ion-icon slot="icon-only" :icon="addCircleOutline" />
              </ion-button>
            </div>
          </ion-item>
        </ion-list>

        <!-- Ligne du Total -->
        <div class="ion-padding ion-text-end" style="margin-top: 20px;">
          <h3><strong>Total : {{ formatAriary(total) }}</strong></h3>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { formatAriary } from '@/utils/format';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner,
  IonText, IonButton, IonList, IonBadge, IonLabel, IonItem, IonIcon,IonButtons
} from '@ionic/vue';
import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { usePanier } from '@/composables/usePanier';

const { lignes, changerQuantite, vider, total } = usePanier();

</script>
