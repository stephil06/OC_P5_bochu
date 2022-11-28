/* import {getLocalStorage} from './localStorage.js';
import {setLocalStorage} from './localStorage.js'; */


/* Récupère la Couleur de la balise <select id="colors"> 
    Si couleur = '' affiche un message d'erreur
    Sinon : retourne la couleur
*/
const lireCouleur = () => {
    const couleur = document.querySelector("#colors").value;
    if (couleur === '') { alert("Merci de renseigner une couleur"); exit; }
    return couleur;
}

/* Récupère la quantite de la balise <input type="number" id="quantity"> 
    Si quantite invalide affiche un message d'erreur
    Sinon : retourne la quantite
*/
const lireQuantite = () => {
    const quantite = parseInt(document.querySelector("#quantity").value);
    if (quantite <= 0 || quantite > 100) { alert("Merci de renseigner un nombre d'article(s) (compris entre 1 & 100)"); exit; }
    return quantite;
}

/* Crée un produit du panier avec la structure {id, couleur, quantite} */
const creerProduitPanier = (produitId, produitCouleur, produitQuantite) => {
    return {
        id: produitId,
        couleur: produitCouleur,
        quantite: produitQuantite
    };
}

/* Retourne le produitPanier sous la forme : (id;couleur;quantite) */
const produitPanierToString = (produitPanier) => {
    return produitPanier === null ? '' : `(${produitPanier.id};${produitPanier.couleur};${produitPanier.quantite})`;
}

/* Retourne les produits du Panier */
const panierToString = (panier) => {
    let s = '';
    panier === null ? s = '' : panier.forEach(value => s += produitPanierToString(value));
    return s;
}

/* Ajout du produitPanier dans le Panier puis ajout du Panier dans le localStorage (cf https://tutowebdesign.com/localstorage-javascript.php)

Panier : un array contenant des produitPanier i.e. 3 caractéristiques: son id, sa couleur, sa quantité

Si le panier est vide : on ajoute produitPanier
Lorsqu’on ajoute un produit au panier : 
    - Si celui-ci n'existe pas dans le panier, on ajoute au Panier produitPanier
    - Si celui-ci existe déjà dans le panier (même id + même couleur) :
            Si qte + la qte qui existe dans le panier n'est pas supérieur à 100 on augmente sa quantité.
*/
const ajouterPanier = (produitPanier) => {
    // localStorage.clear();
    const quantiteMax = 100;
    // Récupérer le Panier à partir du localStorage 
    // let panier = JSON.parse(localStorage.getItem("panierZ")); // JSON.parse() reforme l’objet à partir de la chaîne
    let panier = getLocalStorage("panierZ");

    let s = 'Panier avant: \n';
    /* panier.forEach( value =>  s += `(${value.id};${value.couleur};${value.quantite})` ); alert(s); */
    s += panierToString(panier);
    let ajout = true;
    debugger;
    if (panier === null) {
        panier = []; 
        panier.push(produitPanier);
    } else {
        const trouve = panier.find(element => element.id == produitPanier.id && element.couleur == produitPanier.couleur);

        if (trouve === undefined)
            panier.push(produitPanier);
        else if (trouve.quantite + produitPanier.quantite <= quantiteMax) {
            trouve.quantite += produitPanier.quantite;
        } else {
            ajout = false; const qte = quantiteMax - trouve.quantite;
            let message;
            (qte != 0) ? message = `Désolé, on ne peut ajouter un tel nombre !\nOn en a déjà ${trouve.quantite} dans le panier.\nPour cette référence, vous pouvez donc ajouter jusqu'à ${qte} articles.`
                : message = `Désolé, on ne peut ajouter un tel nombre !\nOn en a déjà ${trouve.quantite} dans le panier.\nPour cette référence, vous ne pouvez plus ajouter d'article.`;
            alert(message);
        }
    }

    s += '\nPanier après: \n';
    /* panier.forEach( value =>  s += "(" + value.id + ";" + value.couleur + ";" + value.quantite + ")"  ); alert(s); */
    s += panierToString(panier);
    alert(s);

    if (ajout) {
        // Mettre le Panier modifié dans le localStorage
        // localStorage.setItem("panierZ", JSON.stringify(panier)); // JSON.stringify() transforme l'objet panier en chaine de caractères
        setLocalStorage(panier, "panierZ");
        alert("Ce Produit a été ajouté au Panier. Vous allez être redirigé sur la page Panier.");
        window.location.href = 'cart.html';
    }
}
