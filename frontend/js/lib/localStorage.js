// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du LocalStorage ---------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Retourne à partir du localStorage l'objet ayant pour nom pNomObjet passé en argument
   Retourne null si l'objet n'existe pas
eg. d'utilisation : getLocalStorage("panierZ");
*/
const getLocalStorage = (pNomObjet) => {
     /* let o = JSON.parse(localStorage.getItem(pNomObjet));
     return o; */
    return JSON.parse(localStorage.getItem(pNomObjet));
}

/* Met dans le localStorage l'objet pObjet de nom pNomObjet passés en argument
   eg. d'utilisation : setLocalStorage("panierZ", panier);
*/
const setLocalStorage = (pNomObjet, pObjet) => {
    // let nomObjet = Object.prototype.toString(objet); 
    
    localStorage.setItem(pNomObjet, JSON.stringify(pObjet));
    // localStorage.setItem("panierZ", JSON.stringify(panier) );
}

