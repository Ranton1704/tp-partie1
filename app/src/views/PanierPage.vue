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
        <ion-input v-model="table" type="number" label="Numéro de table" label-placement="floating"
                   fill="outline" :class="{ 'ion-invalid ion-touched': erreurTable }"
                   :error-text="erreurTable" />
        <ion-button expand="block" class="ion-margin-top" :disabled="envoi" @click="confirmer">
          Envoyer la commande
        </ion-button>

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
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonText, IonButton, IonList, IonInput, IonLabel, IonItem, IonIcon,IonButtons,
  alertController, loadingController, toastController, useIonRouter
} from '@ionic/vue';
import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { usePanier } from '@/composables/usePanier';
import api from '@/services/api';
import { ref, watch } from 'vue';

const { lignes, changerQuantite, vider, total } = usePanier();
const table = ref('');
const erreurTable = ref('');
const envoi = ref(false);
const ionRouter = useIonRouter();

watch(table, () => {
  erreurTable.value = '';
});

async function confirmer() {
  const alerte = await alertController.create({
    header: 'Confirmer la commande',
    message: `Table ${table.value || '—'} : ${formatAriary(total.value)}`,
    buttons: [
      { text: 'Annuler', role: 'cancel' },
      { text: 'Envoyer', role: 'confirm' },
    ],
  });
  await alerte.present();
  const { role } = await alerte.onDidDismiss();
  if (role === 'confirm') await envoyer();
}

async function envoyer() {
  envoi.value = true;
  const chargement = await loadingController.create({ message: 'Envoi de la commande…' });
  await chargement.present();

  try {
    const commande = {
      table: Number(table.value),
      lignes: lignes.value.map((ligne) => ({
        plat_id: ligne.plat.id,
        quantite: ligne.quantite,
      })),
    };
    const resultat = await api.creerCommande(commande);
    vider();
    table.value = '';
    const toast = await toastController.create({
      message: `Commande n°${resultat.id} envoyée`,
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    await toast.present();
    ionRouter.navigate('/tabs/commandes', 'forward', 'replace');
  } catch (e) {
    if (e.statut === 422 && e.details?.table) {
      erreurTable.value = e.details.table;
    } else {
      const toast = await toastController.create({
        message: e.message,
        duration: 2500,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
    }
  } finally {
    envoi.value = false;
    await chargement.dismiss();
  }
}
</script>
