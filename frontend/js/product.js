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
    let listeCouleurs = '';
    produit.colors.forEach(
        (couleur) => {
            listeCouleurs += `<option value="${couleur}">${couleur}</option>`;
        });
    document.querySelector("#colors").innerHTML += listeCouleurs;
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
    let produitPanier = {
        id: produitId,
        couleur: produitCouleur,
        quantite: produitQuantite
    };
    return produitPanier;
}

/* Récupérer le produit de l'API en question (via get() de requestAPI.js) 
 - Met à jour le DOM avec les caractéristiques du produit
*/
const afficherLeProduit = async (produitId) => {
    const produit = await get(`http://localhost:3000/api/products/${produitId}`);

    if (produit === -1) { alert('Problème du serveur'); }
    else {
        updateDomLeProduit(produit);
    }
}

/* Déclenchée Au clic sur le bouton "Ajouter au panier" :
    - lire la couleur
    - lire la quantite
    - créer un produit du panier i.e {produitId, couleur, quantite}
    - ajouter le produit dans le Panier
    - ajouter le Panier dans le localStorage
*/
const ajouterPanier = (produitId) => {
    document.querySelector("#addToCart").addEventListener('click', (evt) => {
        const couleur = lireCouleur();
        const quantite = lireQuantite();
        let produitPanier = creerProduitPanier(produitId, couleur, quantite); alert('Ce Produit a été ajouté au Panier');
    });
}

const produitId = getValeurParametreURLpageCourante("id"); // alert(produitId);

afficherLeProduit(produitId);
ajouterPanier(produitId);