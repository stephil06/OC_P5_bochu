/* Fichier JS de la page "product.html?id=valeur" 
    - pour afficher les caractéristiques du produit ayant pour id valeur
    - Au clic sur le bouton "Ajouter au panier": ajouter le produit (id - couleur - quantité) dans le Panier
*/

/* Met à jour le DOM avec les caractéristiques du produit passé en paramètre */
const updateDomLeProduit = (produit) => {
    /* <div class="item__img">
          <!-- <img src="../images/logo.png" alt="Photographie d'un canapé"> --></img> */
    document.querySelector(".item__img").innerHTML = `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;

    /* <h1 id="title"><!-- Nom du produit --></h1> */
    document.querySelector("#title").innerHTML = `${produit.name}`;

    /* <p>Prix : <span id="price"><!-- 42 --></span>€</p> */
    document.querySelector("#price").innerHTML = `${produit.price}`;

    /* <p id="description"><!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. --></p> */
    document.querySelector("#description").innerHTML = `${produit.description}`;

    /* <select name="color-select" id="colors">
                  <option value="">--SVP, choisissez une couleur --</option>
    <!--          <option value="vert">vert</option>
                  <option value="blanc">blanc</option> --> */

/*
    let listeCouleurs = '<option value="">--SVP, choisissez une couleur --</option>';
    produit.colors.forEach(
        (couleur) => {
            listeCouleurs += `<option value="${couleur}">${couleur}</option>`;
        });
    document.querySelector("#colors").innerHTML = listeCouleurs;
    */

    // essayer avec MAP()
    // On crée un nouveau tableau
    // const tab2 = tab.map(valeur => valeur*2); 
    // let somme = tab2.reduce( (total, valeur ) => total + valeur);

    const tabCouleurs = produit.colors.map(couleur => `<option value="${couleur}">${couleur}</option>`);
    let s = '<option value="">--SVP, choisissez une couleur --</option>' + tabCouleurs.reduce((total, valeur) => total + valeur);
    document.querySelector("#colors").innerHTML = s;
}


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
    const quantite = parseInt(document.querySelector("#quantity").value, 10);
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

/* Récupérer le produit de l'API en question (via get() de requestAPI.js) 
 - Met à jour le DOM avec les caractéristiques du produit
*/
async function afficherLeProduit(produitId) {

    const produit = await get(`http://localhost:3000/api/products/${produitId}`); // alert(produit._id);

    if (produit === -1) { alert("Problème du serveur. Veuillez nous contacter à support@name.com"); exit; }
    if (produit._id == undefined) {
        alert("Ce produit n'existe pas ! Vous allez être redirigé sur la page d'accueil.");
        window.location.href = 'index.html';
    }
    else {
        updateDomLeProduit(produit);
    }
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
    // Récupérer le Panier à partir du localStorage 
    let panier = JSON.parse(localStorage.getItem("panierZ")); // JSON.parse() reforme l’objet à partir de la chaîne

    let s = 'Panier avant: \n';
    /* panier.forEach( value =>  s += `(${value.id};${value.couleur};${value.quantite})` ); alert(s); */
    s += panierToString(panier);
    let ajout = true;
    if (panier === null) {
        panier = new Array(); panier.push(produitPanier);
    } else {
        const trouve = panier.find(element => element.id == produitPanier.id && element.couleur == produitPanier.couleur);
        // trouve === undefined ? panier.push(produitPanier) : trouve.quantite += produitPanier.quantite;
        if (trouve === undefined)
            panier.push(produitPanier);
        else if (trouve.quantite + produitPanier.quantite <= 100) {
            trouve.quantite += produitPanier.quantite;
        } else {
            ajout = false;
            alert(`Désolé on ne peut ajouter un tel nombre ! (On a en déjà ${trouve.quantite} dans le panier)`);
        }
    }

    s += '\nPanier après: \n';
    /* panier.forEach( value =>  s += "(" + value.id + ";" + value.couleur + ";" + value.quantite + ")"  ); alert(s); */
    s += panierToString(panier);
    alert(s);

    if (ajout) {
        // Mettre le Panier modifié dans le localStorage
        localStorage.setItem("panierZ", JSON.stringify(panier)); // JSON.stringify() transforme l'objet panier en chaine de caractères
        alert("Ce Produit a été ajouté au Panier. Vous allez être redirigé sur la page Panier.");
        window.location.href = 'cart.html';
    }

}

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

const produitId = getValeurParametreURLpageCourante("id"); // alert(produitId);

/*
 // récupérer (du localStorage) la liste des produits pour avoir la liste des _id
const listeProduits = JSON.parse(localStorage.getItem("listeProduits")); // alert(listeProduits);

const produit = getProduit(listeProduits, produitId); // alert(produit);

if(produit == undefined) alert('Identifiant du produit inexistant');
*/

afficherLeProduit(produitId);

/* Déclenché Au clic sur le bouton "Ajouter au panier" */
document.querySelector("#addToCart").addEventListener('click', (evt) => {
    const couleur = lireCouleur();
    const quantite = lireQuantite();
    const produitPanier = creerProduitPanier(produitId, couleur, quantite); /* alert( produitPanierToString(null) ); */

    ajouterPanier(produitPanier);
});