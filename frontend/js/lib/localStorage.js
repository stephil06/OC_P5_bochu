// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du LocalStorage ---------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/*
function realTypeof(obj) {
    return Object.prototype.toString.apply(obj);
}*/

/* Retourne à partir du localStorage l'objet stocké de nom element */
const getLocalStorage = (nomObjet) => {
     let o = JSON.parse(localStorage.getItem(nomObjet));
     return o; //  let panier;
    // return panier = JSON.parse(localStorage.getItem('panierZ'));
}

/* Met dans le localStorage l'objet de nom nomObjet */
const setLocalStorage = (objet, nomObjet) => {
    // export function setLocalStorage(objet, nomObjet) {
    /* let nomObjet = Object.prototype.toString(objet); 
     if( nomObjet == "panier" ) nomObjet = nomObjet + 'Z'; */
    localStorage.setItem(nomObjet, JSON.stringify(objet));
    // localStorage.setItem("panierZ", JSON.stringify(panier));
}

/* constantes de nommmage des localStorages */
const listeProduitsLS = "listeProduits";
const panierLS = "panierZ";
