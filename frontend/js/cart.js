// ------- Fonctions utilisées par les Règles Métiers du Panier ------------------------

/* Retourne true ssi le panier est vide
   Si le panier est vide : affiche un message et redirige sur la homepage 
*/
debugger;

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
const getPanierPrix = (panier, listeProduits) => {
    /* let prix = 0;
     for (i = 0; i < panier.length; i++) {
         // récupérer les caractéristiques du produit
         let produit = getProduit(listeProduits, panier[i].id);
         prix += (produit.price * panier[i].quantite);
     }*/

    let prixTotal = 0;
    panier.forEach(
        (produitPanier) => {
            let produit = getProduit(listeProduits, produitPanier.id);
            prixTotal += (produit.price * produitPanier.quantite);
        });
    // alert(`Prix total: ${prixTotal}`);
    return prixTotal;
}

/* Retourne à partir du Panier le Card HTML du produitPanier ayant pour id = idProduit & pour couleur = pCouleur */
const getPanierCardHTML = (panier, listeProduits, idProduit, pCouleur) => {
    // récupérer les caractéristiques du produit
    const produit = getProduit(listeProduits, idProduit);
    const produitPanier = getProduitPanier(panier, idProduit, pCouleur);

    const prix_format = new Intl.NumberFormat().format(produit.price); // formater le prix

    // const prix = produit.price;
    // const prix_format = prix.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });


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
    setLocalStorage(panier, panierLS);
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
    setLocalStorage(panier2, panierLS);
    return panier2;
}

// -------------------------------------------------------------------------------------------------------
// Règles METIERS ----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Afficher les totaux du Panier (i.e Quantité totale & Prix Total du panier */
const afficherPanierTotaux = (panier, listeProduits) => {

    const qte = getPanierQuantite(panier);
    const qte_format = new Intl.NumberFormat().format(qte); // formater la quantité

    const prix = getPanierPrix(panier, listeProduits);
    const prix_format = new Intl.NumberFormat().format(prix); // formater le prix

    document.querySelector("#totalQuantity").innerHTML = qte_format;
    document.querySelector("#totalPrice").innerHTML = prix_format;
}

/* Afficher le Panier (i.e. ses Produits) & ses totaux (Quantité totale &  Prix total) 
 cf. https://fr.javascript.info/modifying-document
*/
const afficherPanier = (panier, listeProduits) => {
    // MAJ DOM du Panier
    /* document.querySelector("#cart__items").innerHTML = getPanierCards(panier, listeProduits);
     document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
     document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits); */

    let listeProduitsDOM = document.querySelector("#cart__items");
    /*
    for (i = 0; i < panier.length; i++) {
        let s = getPanierCard(panier, listeProduits, panier[i].id, panier[i].couleur);
        listProduitsDOM.insertAdjacentHTML("beforeend", s);
    }*/

    panier.forEach(
        (produitPanier) => {
            let s = getPanierCardHTML(panier, listeProduits, produitPanier.id, produitPanier.couleur);
            listeProduitsDOM.insertAdjacentHTML("beforeend", s);
        });
    afficherPanierTotaux(panier, listeProduits);
}

/* Modifier dans le Panier la quantité de chaque produit
  Fonction déclenchée au changement de valeur de chaque <input> de classe '.itemQuantity'
*/
/*
const modifierPanierQuantite = (panier, listeProduits) => {
    // Pour chaque <input> de classe '.itemQuantity'
    document.querySelectorAll('.itemQuantity').forEach(input =>
        // au changement de valeur de chaque <input> '.itemQuantity'
        input.addEventListener("change", event => {
        })
    );
}*/

/* Retirer du Panier les produits
   Fonction déclenchée au clic sur chaque <p> de classe '.deleteItem'
   cf. https://fr.javascript.info/modifying-document
*/
/*
const retirerPanierProduit = (panier, listeProduits) => {
    // Pour chaque <p> de classe '.deleteItem'
    document.querySelectorAll('.deleteItem').forEach(input =>
        // au clic sur chaque <p> '.deleteItem'
        input.addEventListener("click", event => {
        })
    );
}*/

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

const initPanier = () => {
    // ---------------------------------------------------------------------------------------------------
    // --------- Le Panier -------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    // récupérer (du localStorage) le panier 
    let panier = getLocalStorage(panierLS);

    let s = 'listeProduits'; let o = localStorage.getItem('listeProduits'); alert("o: " + o);
    const listeProduits = JSON.parse(o);; alert("produits:" + listeProduits);


    // const listeProduits = JSON.parse(localStorage.getItem("listeProduits")); alert("produits:" + listeProduits);

    // let panier4 = JSON.parse(localStorage.getItem('panierZ'));
    alert("toto:" + panier); // let panier = panier4;

    if (!panierVide(panier)) { // Si panierVide(), redirection vers la homepage
        // récupérer (du localStorage) la liste des produits (pour avoir les Prix)
        const listeProduits = getLocalStorage(listeProduitsLS);
        afficherPanier(panier, listeProduits);

        // Au changement de valeur de chaque <input> de classe '.itemQuantity' : MODIFIER DANS LE PANIER LA QUANTITE de chaque produit
        // modifierPanierQuantite(panier, listeProduits);
        document.querySelectorAll('.itemQuantity').forEach(input =>
            // au changement de valeur de chaque <input> '.itemQuantity'
            input.addEventListener('change', event => {

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
                afficherPanierTotaux(panier, listeProduits); // MAJ DOM du Panier pour les totaux
            })
        );

        // Au clic sur chaque <p> de classe '.deleteItem' : SUPPRIMER DU PANIER LE PRODDUIT en question
        // cf. https://fr.javascript.info/modifying-document
        // retirerPanierProduit(panier, listeProduits);
        document.querySelectorAll('.deleteItem').forEach(input =>
            // au clic sur chaque <p> '.deleteItem'
            input.addEventListener('click', event => {

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
                            getPanierQuantite(panier) != 0 ? afficherPanierTotaux(panier, listeProduits) : window.location.href = 'cart.html';
                        }
                    }
                    else {
                        let panier2 = removePanierProduit(panier, idProduit, couleur); panier = panier2;
                        event.target.closest(".cart__item").remove();
                        // alert(`Quantité du panier: ${getPanierQuantite(panier)}`);
                        getPanierQuantite(panier) != 0 ? afficherPanierTotaux(panier, listeProduits) : window.location.href = 'cart.html';
                    }
                }
            })
        );
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
                alert("contact:" + contactToString(contact));

                // créer un tableau contenant les id des produits du panier
                const tableauIdProduitsPanier = panier.map(produitPanier => produitPanier.id);

                let s = '';
                tableauIdProduitsPanier.forEach(id => { s += id + ","; });
                alert("tableauIdProduitsPanier:" + s);

                // créer un objet "commande"
                const commande = creerCommande(contact, tableauIdProduitsPanier);

                // faire une requête POST cf. https://fr.javascript.info/fetch#requetes-post
                /* TEMPLATE */
                /*
                let user = {
                    name: 'John',
                    surname: 'Smith'
                };
        
                let response = await fetch('/article/fetch/post/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(user)
                });
        
                let result = await response.json();
                alert(result.message);
                */

                //  Envoi à l'API de l'objet "commande"

                // cf. backend\controllers\product.js
                /* return res.status(201).json({
                    contact: req.body.contact,
                    products: products,
                    orderId: orderId
                */

                /*
                try {
                    let response = await fetch("http://localhost:3000/api/products/order", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        // body: JSON.stringify({
                        //     contact: contact,
                        //     products: tableauIdProduitsPanier
                        //  })
                        body: JSON.stringify(commande)
                    });

                    let result = await response.json();
                    window.location.href = `confirmation.html?id=${result.orderId}`;

                }
                catch (exception) {
                    alert("Problème du serveur. Veuillez nous contacter à support@name.com\nLa commande n'est pas validée.");
                }
                */

                const orderId = await envoyerAPICommande(commande);
                (orderId == -1) ? alert("Problème du serveur. Veuillez nous contacter à support@name.com\nDésolé, votre commande n'est pas validée.")
                    : window.location.href = `confirmation.html?id=${orderId}`;

            }
        });
}

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
debugger;

initPanier();


// --------- Le Formulaire ------------------------------------------------------------------------
// document.querySelector("#order").style.backgroundColor = 'red';
// document.querySelector("#order").disabled = true;

// A chaque changement de valeur d'un <input> du formulaire : vérifier sa valeur
// trigger_change_input_form_verifier_valeur();

