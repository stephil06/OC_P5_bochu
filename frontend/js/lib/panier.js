/* import {getLocalStorage} from './localStorage.js';
import {setLocalStorage} from './localStorage.js'; */

/* Récupère la Couleur de la balise <select id="colors"> 
    Si couleur = '' : affiche un message "Merci de renseigner une couleur"
    Sinon : retourne la couleur
*/
const lireCouleur = () => {
    const couleur = document.querySelector("#colors").value;
    if (couleur === '') {
        alert("Merci de renseigner une couleur");
        exit;
    }
    return couleur;
}

/* Récupère la quantite de la balise <input type="number" id="quantity"> 
    Si quantite invalide : affiche un message d'erreur
    Sinon : retourne la quantite
*/
const lireQuantite = () => {
    const quantiteMaxiPanier = 100; // pour une référence donnée, quantité maximale autorisée pour mettre au panier
    const quantite = parseInt(document.querySelector("#quantity").value);
    if (quantite <= 0 || quantite > quantiteMaxiPanier) {
        alert(`Merci de renseigner un nombre de produit(s) (compris entre 1 & ${quantiteMaxiPanier})`);
        exit;
    }
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
   Retourne '' Si panier = null
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
    let panier = getLocalStorage("panierZ");
    console.log('Ajout panier: get', panier);

    let ajout = true;

    if (panier === null) {
        panier[0] = produitPanier;
    } else {
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

    if (ajout) {
        // Met dans le localStorage le Panier modifié
        setLocalStorage("panierZ", panier);
        console.log('Après:', panier, "panierZ");

        alert("Ce Produit a été ajouté au Panier. Vous allez être redirigé sur la page Panier.");
        window.location.href = 'cart.html';
    }
}
