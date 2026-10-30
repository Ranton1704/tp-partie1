import { ref, computed } from "vue";

const lignes = ref([]);

export function usePanier() {
  function ajouter(plat) {
    const ligneExistante = lignes.value.find(l => l.plat.id === plat.id);

    if (ligneExistante) {
      ligneExistante.quantite++;
    } else {
      lignes.value.push({ plat, quantite: 1 });
    }
  }

  function changerQuantite(platId, delta) {
    const index = lignes.value.findIndex((l) => l.plat.id === platId);
    if (index !== -1) {
      lignes.value[index].quantite += delta;
      if (lignes.value[index].quantite <= 0) {
        lignes.value.splice(index, 1);
      }
    }
  }

  function vider() {
    lignes.value = [];
  }

  const nombreArticles= computed(() =>{
    return lignes.value.reduce((total, ligne) => total + ligne.quantite, 0);   
  });

  const total = computed(() =>{
    return lignes.value.reduce((total, ligne) => total + ligne.plat.prix * ligne.quantite, 0);
  });
  
  return { lignes, ajouter, changerQuantite, vider, nombreArticles, total };
}
