/* Fichier JS de la page "product.html?id=valeur" 
    - pour afficher les caractéristiques du produit ayant pour id valeur
    - Au clic sur le bouton "Ajouter au panier": ajouter le produit {id, couleur, quantité} dans le Panier
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
    const s = '<option value="">--SVP, choisissez une couleur --</option>' + tabCouleurs.reduce((total, valeur) => total + valeur);
    document.querySelector("#colors").innerHTML = s;
}

/* Récupérer le produit de l'API en question (via get() de requestAPI.js) 
 - Met à jour le DOM avec les caractéristiques du produit
*/
const afficherLeProduit = async (produitId) => {

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

const initProduitDetail = () => {

    const produitId = getValeurParametreURLpageCourante("id"); // alert(produitId);

    afficherLeProduit(produitId);

    // ajouterPanierIhm(produitId); // fonction du fichier lib/panier.js

    // déclenché Au clic sur le bouton "Ajouter au panier"
    document.querySelector("#addToCart").addEventListener('click', (evt) => {
        const couleur = lireCouleur();
        const quantite = lireQuantite();
        const produitPanier = creerProduitPanier(produitId, couleur, quantite); // alert( produitPanierToString(null) );
        ajouterPanier(produitPanier);
    });
}

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
initProduitDetail();