import { ref, computed} from 'vue';

const lignes = ref([]);

export function usePanier(){
    function ajouter(plat){

    }

    function changerQuantite(platId, delta){

    }

    function vider(){
        lignes.values = [];
    }

    const nombresArticles = computed (() =>0

);
    const total = computed (() =>0

);
    return { lignes, ajouter, changerQuantite, vider, nombreArticles, total};
}