// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du LocalStorage ---------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Retourne à partir du localStorage l'objet stocké de nom element */
const getLocalStorage = (nomObjet) => {
     /* let o = JSON.parse(localStorage.getItem(nomObjet));
     return o; */
    return JSON.parse(localStorage.getItem("panier"));
}

/* Met dans le localStorage l'objet de nom nomObjet */
const setLocalStorage = (objetY, nomObjetY) => {
    /* let nomObjet = Object.prototype.toString(objet); 
     if( nomObjet === "panier" ) nomObjet = nomObjet + 'Z'; */
    
    
     // localStorage.setItem(nomObjet, JSON.stringify(objet));
    
    
    localStorage.setItem("panierZ", JSON.stringify(nomObjetY) );
}

