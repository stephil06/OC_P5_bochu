/* import {getLocalStorage} from './localStorage.js';
import {setLocalStorage} from './localStorage.js'; */

/* Récupère la Couleur de la balise <select id="colors"> 
    Si couleur = '' : affiche un message "Merci de renseigner une couleur"
    Sinon : retourne la couleur
*/
const lireCouleur = () => {
    const couleur = document.querySelector("#colors").value;
    if (couleur === '') { alert("Merci de renseigner une couleur"); exit; }
    return couleur;
}

/* Récupère la quantite de la balise <input type="number" id="quantity"> 
    Si quantite invalide : affiche un message d'erreur
    Sinon : retourne la quantite
*/
const lireQuantite = () => {
    const quantiteMaxiPanier = 100; // pour une référence donnée, quantité maximale autorisée pour mettre au panier
    const quantite = parseInt(document.querySelector("#quantity").value);
    if (quantite <= 0 || quantite > quantiteMaxiPanier) { alert(`Merci de renseigner un nombre de produit(s) (compris entre 1 & ${quantiteMaxiPanier})`); exit; }
    return quantite;
}

/* Crée un produit du panier JSON avec la structure {id, couleur, quantite} */
const creerProduitPanier = (produitId, produitCouleur, produitQuantite) => {
    return {
        id: produitId,
        couleur: produitCouleur,
        quantite: produitQuantite
    };
}

/* Retourne le produit du Panier ayant pour id idProduit & pour couleur pCouleur (passés en argument) 
   Retourne undefined Si non trouvé
*/
const getProduitPanier = (panier, idProduit, pCouleur) => {
    const trouve = panier.find(element => element.id === idProduit && element.couleur === pCouleur);
    return trouve;
}

/* Retourne le produitPanier (passé en argument) sous la forme d'une chaîne : {id;couleur;quantite} 
    '' Si produitPanier = null
*/
const produitPanierToString = (produitPanier) => {
    return produitPanier === null ? '' : `(${produitPanier.id};${produitPanier.couleur};${produitPanier.quantite})`;
}

/* Retourne les produits du panier (passé en argument) (sous forme d'une chaîne) 
    '' Si panier = null
*/
const panierToString = (panier) => {
    let s = '';
    panier === null ? s = '' : panier.forEach(value => s += produitPanierToString(value));
    return s;
}

/* Ajout du produitPanier dans le Panier
Panier : un array contenant des produitPanier i.e. un objet JSON ayant 3 caractéristiques : {son id, sa couleur, sa quantité}

En cas d'ajout :
    - ajout du Panier dans le localStorage (cf https://tutowebdesign.com/localstorage-javascript.php), avec la clé "panierZ"
    - redirection vers la page 'cart.html'

Si le panier est vide : on ajoute produitPanier
Sinon
Lorsqu’on ajoute un produit au panier : 
    - Si celui-ci n'existe pas dans le panier, on ajoute au Panier produitPanier
    - Si celui-ci existe déjà dans le panier (même id + même couleur) :
            Si qte + la qte qui existe dans le panier n'est pas supérieure à 100 on augmente sa quantité
            sinon : on calcule la quantité ajoutable 
                Si quantité ajoutable = 0 : on affiche un message "Pour cette référence, on ne peut plus ajouter de produit"
                Sinon : on affiche un message "Pour cette référence, vous pouvez encore ajouter quantité ajoutable"
*/
const ajouterPanier = (produitPanier) => {
    const quantiteMaxiPanier = 100; // pour une référence donnée, quantité maximale autorisée pour mettre au panier
    // Récupérer le Panier à partir du localStorage 
    // let panier = JSON.parse(localStorage.getItem("panierZ")); // JSON.parse() reforme l’objet à partir de la chaîne
    // let panier = getLocalStorage("panierZ");
    // debugger;

    // let panier = getLocalStorage("panierZ"); alert(panier);

    let objLinea = localStorage.getItem("panierZ");
    let objJson = JSON.parse(objLinea);
    let panier = objJson;
    alert("Panier:" + panier);

    console.log('Ajout panier: get', panier);
    /*
    let s = 'Panier avant: \n';
   // panier.forEach( value =>  s += `(${value.id};${value.couleur};${value.quantite})` ); alert(s); 
   
    s += panierToString(panier); */
    let ajout = true;
    // debugger;
    if (panier === null) {
        panier = [];
        panier.push(produitPanier);
    } else {
        // const trouve = panier.find(element => element.id === produitPanier.id && element.couleur === produitPanier.couleur);
        const trouve = getProduitPanier(panier, produitPanier.id, produitPanier.couleur);

        if (trouve === undefined)
            panier.push(produitPanier);
        else if (trouve.quantite + produitPanier.quantite <= quantiteMaxiPanier) {
            trouve.quantite += produitPanier.quantite;
        } else {
            ajout = false;
            const qteAjoutable = quantiteMaxiPanier - trouve.quantite;
            let message;
            (qteAjoutable != 0) ? message = `Désolé, on ne peut ajouter un tel nombre !\nOn en a déjà ${trouve.quantite} dans le panier.\nPour cette référence, vous pouvez donc ajouter jusqu'à ${qteAjoutable} produit(s).`
                : message = `Désolé, on ne peut ajouter un tel nombre !\nOn en a déjà ${trouve.quantite} dans le panier.\nPour cette référence, vous ne pouvez plus ajouter de produit.`;
            alert(message);
        }
    }

    /* s += '\nPanier après: \n';
    // panier.forEach( value =>  s += "(" + value.id + ";" + value.couleur + ";" + value.quantite + ")"  ); alert(s); 
    s += panierToString(panier);
    alert(s); */

    if (ajout) {
        // Mettre le Panier modifié dans le localStorage
        // localStorage.setItem("panierZ", JSON.stringify(panier)); // JSON.stringify() transforme l'objet panier en chaine de caractères
        // setLocalStorage(panier, "panierZ");
        console.log('Après:', panier, "panierZ");

        // setLocalStorage(panier, "panierZ"); 
        localStorage.setItem("panierZ", JSON.stringify(panier));
        localStorage.setItem("panierY", JSON.stringify(panier));

        alert("Nb éléments du panier:" + panier.length);
        alert("Ce Produit a été ajouté au Panier. Vous allez être redirigé sur la page Panier.");
        alert(`Nombre de clés du panier : ${localStorage.length}`);
        let panierZ = localStorage.getItem("panierZ"); alert("panierZ:" + panierZ);

        window.location.href = 'cart.html';
    }
}
