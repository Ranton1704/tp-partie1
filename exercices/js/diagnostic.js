/*
 * FICHE 00 — Diagnostic JavaScript
 * Complétez chaque fonction, puis lancez :   npm run js
 * Le script indique les exercices réussis (✓) et ceux à revoir (✗).
 * Interdit : les boucles for/while. Utilisez les outils indiqués.
 */

// 1. DÉSTRUCTURATION
// resumePlat({ nom: 'Romazava', prix: '6000.00', ... })  ->  "Romazava : 6000.00 Ar"
// Outil : const { ... } = objet   (ou directement dans les paramètres)
export function resumePlat(plat) {
  // TODO
  const { nom, prix } = plat;
  return `${nom} : ${prix} Ar`;
}

// 2. SPREAD ET IMMUTABILITÉ
// Renvoie un NOUVEAU tableau contenant les lignes du panier + { plat, quantite: 1 }.
// Le tableau reçu ne doit PAS être modifié.
// Outil : [...tableau, element]
export function ajouterLigne(panier, plat) {
  // TODO
  return [...panier, { plat, quantite: 1 }];
}

// 3. FILTER ET MAP
// Renvoie les noms des plats disponibles :  ['Romazava', 'Lasopy', 'Vary fotsy']
export function nomsDisponibles(plats) {
  // TODO
  return plats
    .filter(plat => plat.disponible)
    .map(plat => plat.nom);
}

// 4. REDUCE
// lignes = [{ plat, quantite }, ...]  ->  total en nombre (ex. 15000)
// Attention : plat.prix est une CHAÎNE ("6000.00").
export function totalPanier(lignes) {
  // TODO
  return lignes.reduce((total, ligne) => {
    return total + Number(ligne.plat.prix) * ligne.quantite;
  }, 0);
}

// 5. FIND, CHAÎNAGE OPTIONNEL (?.) ET COALESCENCE (??)
// Renvoie le nom de la catégorie du plat d'identifiant id.
// Si le plat n'existe pas OU n'a pas de catégorie : 'Inconnue'.
// En une seule ligne, sans if.
export function nomCategorie(plats, id) {
  // TODO
  return plats
    .find(plat => plat.id === id)?.categorie?.nom ?? 'Inconnue';

}

// 6. ASYNC / AWAIT ET TRY / CATCH
// chargerPlats est une fonction asynchrone qui renvoie une Promise de tableau.
// Renvoyez { nombre: <nombre de plats>, erreur: null } si tout va bien,
// ou { nombre: 0, erreur: <message de l'erreur> } si chargerPlats échoue.
export async function chargerMenu(chargerPlats) {
  // TODO
  try {
    const plats = await chargerPlats();
    return { nombre: plats.length, erreur: null };
  } catch (error) {
    return { nombre: 0, erreur: error.message };
  }
}
