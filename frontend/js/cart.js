// ------- Fonctions utilisées par les Règles Métiers du Panier ------------------------
// Récupération des produits de l'API

/* A partir de l'API en question : récupérer le produit ayant pout idProduit produitId (passé en argument) */
// const getProductById = async (produitId) => {
/* return fetch(`http://localhost:3000/api/products/${produitId}`)
    .then(function (res) {
        return res.json();
    })
    .catch((err) => {
        // Erreur serveur
        console.log("erreur");
    })
    .then(function (response) {
        return response;
    });
    */
/* const produit = await get(`http://localhost:3000/api/products/${produitId}`); // alert(produit._id);

if (produit === -1) { alert("Problème du serveur. Veuillez nous contacter à support@name.com"); exit; }
else {
    return produit;
}
}*/

/* A partir de l'API en question : récupérer le produit ayant pout idProduit produitId (passé en argument) 
 (via get() de requestAPI.js) 
*/
const getProduitAPI = async (produitId) => {
    const produit = await get(`http://localhost:3000/api/products/${produitId}`); // alert(produit._id);

    if (produit === -1) { alert("Problème du serveur. Veuillez nous contacter à support@name.com"); exit; }
    else {
        return produit;
    }
}


/* Retourne true ssi le panier est vide
   Si le panier est vide : affiche un message et redirige sur la homepage 
*/
const panierVide = (panier) => {
    let vide = false;
    if (panier == null || panier.length == 0) {
        vide = true;
        alert("Panier vide ! Vous allez être redirigé sur la page d'accueil.");
        window.location.href = 'index.html';
    }
    return vide;
}

/* Retourne le nombre de produits du Panier */
const getPanierQuantite = (panier) => {
    /* let quantite = 0;
     for (i = 0; i < panier.length; i++) quantite += panier[i].quantite; */

    let qteTotal = (panier.length >= 1) ? panier.map(produitPanier => produitPanier.quantite).reduce((total, quantite) => total += quantite)
        : 0;
    // alert(`Quantité totale: ${qteTotal}`);
    return qteTotal;
}

/* Retourne le nombre de références du Panier */
const getPanierNombreReferences = (panier) => {
    return panier.length;
}

/* Retourne le Prix du Panier */
const getPanierPrix = async (panier) => {
    let prixTotal = 0;
    for (i = 0; i < panier.length; i++) {
        const produit = await getProduitAPI(panier[i].id);
        prixTotal += parseFloat(produit.price * panier[i].quantite);
    }
    alert(`Prix total: ${prixTotal}`);
    return prixTotal;
}

/* Retourne à partir du Panier le Card HTML du produitPanier ayant pour id = idProduit & pour couleur = pCouleur */
const getPanierCardHTML = (panier, produit, idProduit, pCouleur, prix) => {

    const produitPanier = getProduitPanier(panier, idProduit, pCouleur); // pour récupérer la quantité du produit du Panier
    const prix_format = new Intl.NumberFormat().format(prix); // formater le prix

    // const prix = produit.price;

    const leCard =
        `<article class="cart__item" data-id="${produit._id}" data-color="${pCouleur}">
            <div class="cart__item__img">
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${produit.name}</h2>
                    <p>${pCouleur}</p>
                    <p>${prix_format} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="${quantiteMaxiPanier}" value="${produitPanier.quantite}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;
    // alert(leCard);
    return leCard;
}

/* Modifie dans le Panier la quantite du produit 
 ayant pour id idProduit & couleur pCouleur pour la quantite quantiteModifiee passés en argument 
 Puis Modifie le LocalStorage du Panier
 Retourne le Panier après Modification
*/
const setPanierQuantite = (panier, idProduit, pCouleur, quantiteModifiee) => {
    // let trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
    let trouve = getProduitPanier(panier, idProduit, pCouleur);

    qteAvant = trouve.quantite;
    // Modifie la quantite dans le Panier, puis au LocalStorage du Panier
    trouve.quantite = quantiteModifiee;
    // localStorage.setItem("panierZ", JSON.stringify(panier));
    setLocalStorage(panier, "panierZ");
    return panier;
}

/* Supprime du Panier le produit dont id = idProduit & couleur = pCouleur (passés en argument) 
Puis Modifie le LocalStorage du Panier
*/
const removePanierProduit = (panier, idProduit, pCouleur) => {
    // const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
    const trouve = getProduitPanier(panier, idProduit, pCouleur);

    /* template : let nbr = 6; var tab = [3, 6, 8]; tab = tab.filter(item => item !== nbr) */
    let panier2 = panier.filter(item => item != trouve);
    // localStorage.setItem("panierZ", JSON.stringify(panier));
    setLocalStorage(panier2, "panierZ");
    return panier2;
}

// -------------------------------------------------------------------------------------------------------
// Règles METIERS ----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Afficher les totaux du Panier (i.e Quantité totale & Prix Total du panier */
// const afficherPanierTotaux = (panier, listeProduits) => {
const afficherPanierTotaux = async (panier) => {

    let quantiteTotale = 0;
    let prixTotal = 0;

    for (i = 0; i < panier.length; i++) {
        const produit = await getProduitAPI(panier[i].id);
        quantiteTotale += parseInt(panier[i].quantite);
        prixTotal += parseFloat(produit.price * panier[i].quantite);
    }

    /*
    panier.forEach(
        async (produitPanier) => {
            const produit = await getProduitAPI(produitPanier.id);
            quantiteTotale += parseInt(produitPanier.quantite); alert(`Quantité: ${quantiteTotale}`);
            prixTotal += parseFloat(produit.price * produitPanier.quantite); alert(`Prix: ${prixTotal}`);
        });
    */
    const qte_format = new Intl.NumberFormat().format(quantiteTotale);
    const prix_format = new Intl.NumberFormat().format(prixTotal);

    document.getElementById("totalQuantity").innerHTML = qte_format;
    document.getElementById("totalPrice").innerHTML = prix_format;
}

/* Afficher le Panier (i.e. ses Produits) & ses totaux (Quantité totale &  Prix total) 
 cf. https://fr.javascript.info/modifying-document
*/
const afficherPanier = async (panier) => {
    // debugger;
    let listeProduitsDOM = document.querySelector("#cart__items");

    let s = '';
    for (i = 0; i < panier.length; i++) {
        const product = await getProduitAPI(panier[i].id); const prix2 = product.price; // alert("prix: " + parseFloat(product.price) );
        const totalPriceItem = (product.price *= panier[i].quantity);
        s += getPanierCardHTML(panier, product, panier[i].id, panier[i].couleur, prix2);
    }
    listeProduitsDOM.insertAdjacentHTML("beforeend", s);

    /*
    panier.forEach(
        async (produitPanier) => {
            const product = await getProduitAPI(produitPanier.id); const prix2 = product.price;
            s += getPanierCardHTML(panier, product, produitPanier.id, produitPanier.couleur, prix2); // alert(s);
            listeProduitsDOM.insertAdjacentHTML("beforeend", s);
        });
    */

    afficherPanierTotaux(panier); // alert(`prix panier: {gettPanierPrix(panier)}`);

    // Au changement de valeur de chaque <input> de classe '.itemQuantity' : MODIFIER DANS LE PANIER LA QUANTITE de chaque produit
    // modifierPanierQuantite(panier);
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    quantityInputs.forEach((quantityInput) => {
        quantityInput.addEventListener("change", (event) => {

            const inputValue = event.target.value;

            // récupérer la quantité modifiée
            const quantiteModifiee = parseInt(event.target.value); // alert(quantiteModifiee);
            if (quantiteModifiee <= 0 || quantiteModifiee > quantiteMaxiPanier) {
                // alert("Merci de renseigner un nombre de produit(s) (compris entre 1 & 100)"); exit;
                alert(`Merci de renseigner un nombre de produit(s) (compris entre 1 & ${quantiteMaxiPanier})`); exit;
            }

            // identifier le idProduit & la couleur du Produit Panier dont on souhaite modifier la quantité
            const idProduit = event.target.closest(".cart__item").dataset.id; // alert(idProduit);
            const couleur = event.target.closest(".cart__item").dataset.color; // alert(couleur);

            // modifier dans le Panier pour le produit & couleur en question la quantité modifiée
            let panier3 = setPanierQuantite(panier, idProduit, couleur, quantiteModifiee); // panier = panier3;

            // alert(`Quantité du panier: ${getPanierQuantite(panier)}`);
            afficherPanierTotaux(panier);
        })
    });

    // Au clic sur chaque <p> de classe '.deleteItem' : SUPPRIMER DU PANIER LE PRODDUIT en question
    // cf. https://fr.javascript.info/modifying-document
    // retirerPanierProduit(panier);
    const deleteProduits = document.querySelectorAll(".deleteItem");
    deleteProduits.forEach((input) => {
        // au clic sur chaque <p> '.deleteItem'
        input.addEventListener('click', (event) => {
            // alert("Suppression");

            // identifier le idProduit & la couleur du Produit que l'on veut supprimer du Panier 
            const idProduit = event.target.closest(".cart__item").dataset.id; // alert(idProduit);
            const couleur = event.target.closest(".cart__item").dataset.color; // alert(couleur);

            let suppression = confirm("Souhaitez-vous supprimer ce produit ?");
            if (suppression) {
                if (getPanierNombreReferences(panier) === 1 && isInputFormulaireSaisie()) {
                    const s = "Il n'y a qu'une seule référence dans le panier.\n"
                        + "Si vous supprimez ce produit, vous perdrez les informations saisies dans le formulaire.\n"
                        + "Souhaitez-vous supprimer ce produit ?"
                    suppression = confirm(s);
                    if (suppression) {
                        let panier2 = removePanierProduit(panier, idProduit, couleur); panier = panier2;
                        event.target.closest(".cart__item").remove();
                        // alert(`Quantité du panier: ${getPanierQuantite(panier)}`);
                        getPanierQuantite(panier) != 0 ? afficherPanierTotaux(panier) : window.location.href = 'cart.html';
                    }
                }
                else {
                    let panier2 = removePanierProduit(panier, idProduit, couleur); panier = panier2;
                    event.target.closest(".cart__item").remove();
                    // alert(`Quantité du panier: ${getPanierQuantite(panier)}`);
                    getPanierQuantite(panier) != 0 ? afficherPanierTotaux(panier) : window.location.href = 'cart.html';
                }
            }
        })
    });
}

// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du Formulaire -----------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Créer un objet "contact" (cf. Dossier de SPECIFICATIONS) 
 composé des champs :  firstName, lastName, address, city, email 
*/
const creerContact = (pFirstName, pLastName, pAddress, pCity, pEmail) => {
    return {
        firstName: pFirstName,
        lastName: pLastName,
        address: pAddress,
        city: pCity,
        email: pEmail
    };
}

/* Retourne le produitPanier sous la forme : (id;couleur;quantite) */
const contactToString = (contact) => {
    return contact === null ? '' : `(${contact.firstName};${contact.lastName};${contact.address};${contact.city};${contact.email})`;
}

/* Créer un objet "commande" */
const creerCommande = (pContact, pIdProduitsPanier) => {
    return { contact: pContact, products: pIdProduitsPanier };
}


/* Envoyer à l'API la commande passé en argument 
    Retourne -1 Si problème
    Retourne le n° de commande Sinon
*/
const envoyerAPICommande = async (commande) => {
    try {
        let response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(commande)
        });

        let result = await response.json();
        return result.orderId;
    }
    catch (exception) {
        return -1;
    }
}

// -----------------------------------------------------------------------------------------------------------

const initPanier = () => {
    debugger;

    // ---------------------------------------------------------------------------------------------------
    // --------- Le Panier -------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    // récupérer (du localStorage) le panier 
    // localStorage.removeItem("panierZ"); 
    // localStorage.clear(); 
    alert(localStorage.length);
    let panier = getLocalStorage("panierZ");

    if (!panierVide(panier)) { // Si panierVide(), redirection vers la homepage

        afficherPanier(panier);
    }
    // ------------------------------------------------------------------------------------------------
    // --------- Le Formulaire ------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------

    // A chaque changement de valeur d'un <input> du formulaire : vérifier sa valeur
    const nomInputsFormulaire = getNomInputsFormulaire(); // ['firstName', 'lastName', 'address', 'city', 'email'];

    nomInputsFormulaire.forEach(
        input => {
            // alert(input);
            // au changement de valeur de chaque <input> : tester sa validité 
            document.querySelector('#' + input).addEventListener('change', (evt) => {
                inputFormulaireOK(input);
            });
        });

    // Au clic sur le bouton du formulaire "Commander"
    document.querySelector("#order").addEventListener(// "click", (event) => {
        "click", async function (event) {
            event.preventDefault();

            if (!inputsFormulaireTousOK()) alert("Désolé, impossible de commander s'il y a un champ invalide !");
            else {
                // créer un objet "contact" (à partir des données du formulaire) et un tableau des idProduits du Panier
                const contact = creerContact(
                    document.getElementById("firstName").value,
                    document.getElementById("lastName").value,
                    document.getElementById("address").value,
                    document.getElementById("city").value,
                    document.getElementById("email").value
                );
                // alert("contact:" + contactToString(contact));

                // créer un tableau contenant les id des produits du panier
                const tableauIdProduitsPanier = panier.map(produitPanier => produitPanier.id);

                let s = '';
                tableauIdProduitsPanier.forEach(id => { s += id + ","; });
                // alert("tableauIdProduitsPanier:" + s);

                // créer un objet "commande"
                const commande = creerCommande(contact, tableauIdProduitsPanier);

                // faire une requête POST cf. https://fr.javascript.info/fetch#requetes-post       
                const orderId = await envoyerAPICommande(commande);
                if (orderId == -1) {
                    alert("Problème du serveur. Veuillez nous contacter à support@name.com\nDésolé, votre commande n'est pas validée.");
                }
                else {
                    window.location.href = `confirmation.html?id=${orderId}`;
                    // vider le panier du localStorage
                    localStorage.removeItem("panierZ");
                }
            }
        });
}

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
// debugger;

initPanier();



