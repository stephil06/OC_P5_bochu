// ------- Fonctions utilisées par les Règles Métiers du Panier ------------------------

/* Retourne true ssi le panier est vide
   Si le panier est vide : affiche un message et redirige sur la homepage 
*/
const panierVide = (panier) => {
    let vide = false;
    if (panier.length == 0) {
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

/* Retourne le produit du Panier ayant pour id idProduit & pour couleur pCouleur (passés en argument) */
const getProduitPanier = (panier, idProduit, pCouleur) => {
    const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
    return trouve;
}

/* Retourne le Card du Panier */
const getPanierCard = (panier, listeProduits, idProduit, pCouleur) => {
    // récupérer les caractéristiques du produit
    let produit = getProduit(listeProduits, idProduit);
    let produitPanier = getProduitPanier(panier, idProduit, pCouleur);

    const leCard =
        `<article class="cart__item" data-id="${produit._id}" data-color="${pCouleur}">
            <div class="cart__item__img">
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${produit.name}</h2>
                    <p>${pCouleur}</p>
                    <p>${produit.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produitPanier.quantite}">
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
    let trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);

    qteAvant = trouve.quantite;
    // Modifie la quantite dans le Panier, puis au LocalStorage du Panier
    trouve.quantite = quantiteModifiee;
    // localStorage.setItem("panierZ", JSON.stringify(panier));
    setLocalStorage(panier, panierLS);
    return panier; // qteAvant;
}

/* Supprime du Panier le produit dont id = idProduit & couleur = pCouleur (passés en argument) 
Puis Modifie le LocalStorage du Panier
*/
const removePanierProduit = (panier, idProduit, pCouleur) => {
    const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
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
const afficherTotauxPanier = (panier, listeProduits) => {
    document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
    document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits);
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
            let s = getPanierCard(panier, listeProduits, produitPanier.id, produitPanier.couleur);
            listeProduitsDOM.insertAdjacentHTML("beforeend", s);
        });
    afficherTotauxPanier(panier, listeProduits);
}

/* Modifier dans le Panier la quantité de chaque produit
  Fonction déclenchée au changement de valeur de chaque <input> de classe '.itemQuantity'
*/
const modifierPanierQuantite = (panier, listeProduits) => {
    // Pour chaque <input> de classe '.itemQuantity'
    document.querySelectorAll('.itemQuantity').forEach(input =>
        // au changement de valeur de chaque <input> '.itemQuantity'
        input.addEventListener("change", event => {

            // récupérer la quantité modifiée
            const quantiteModifiee = parseInt(event.target.value); // alert(quantiteModifiee);
            if (quantiteModifiee <= 0 || quantiteModifiee > 100) {
                alert("Merci de renseigner un nombre d'article(s) (compris entre 1 & 100)"); exit;
            }

            // identifier le idProduit & la couleur du Produit Panier dont on souhaite modifier la quantité
            const idProduit = event.target.closest(".cart__item").dataset.id; // alert(idProduit);
            const couleur = event.target.closest(".cart__item").dataset.color; // alert(couleur);

            // modifier dans le Panier pour le produit & couleur en question la quantité modifiée
            let panier3 = setPanierQuantite(panier, idProduit, couleur, quantiteModifiee); //  panier = panier3;

            alert('Qte:' + getPanierQuantite(panier));
            afficherTotauxPanier(panier, listeProduits); // MAJ DOM du Panier pour les totaux

        })
    );
}

/* Retirer du Panier les produits
   Fonction déclenchée au clic sur chaque <p> de classe '.deleteItem'
   cf. https://fr.javascript.info/modifying-document
*/
const retirerPanierProduit = (panier, listeProduits) => {
    // Pour chaque <p> de classe '.deleteItem'
    document.querySelectorAll('.deleteItem').forEach(input =>
        // au clic sur chaque <p> '.deleteItem'
        input.addEventListener("click", event => {

            // identifier le idProduit & la couleur du Produit que l'on veut supprimer du Panier 
            const idProduit = event.target.closest(".cart__item").dataset.id; // alert(idProduit);
            const couleur = event.target.closest(".cart__item").dataset.color; // alert(couleur);

            let suppression = confirm("Souhaitez-vous supprimer ce produit ?");
            if (suppression) {
                let panier2 = removePanierProduit(panier, idProduit, couleur); panier = panier2;

                // let a = getPanierCard(panier, listeProduits, idProduit, couleur); // alert(a);
                // MAJ DOM du Panier

                event.target.closest(".cart__item").remove();

                alert('Qte:' + getPanierQuantite(panier));
                afficherTotauxPanier(panier, listeProduits);
                panierVide(panier);
            }
        })
    );
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

const initPanier = () => {
    // ---------------------------------------------------------------------------------------------------
    // --------- Le Panier -------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    // récupérer (du localStorage) le panier
    let panier = getLocalStorage(panierLS);

    if (!panierVide(panier)) { // Si panierVide(), redirection vers la homepage
        // récupérer (du localStorage) la liste des produits (pour avoir les Prix)
        const listeProduits = getLocalStorage(listeProduitsLS);
        // alert(getPanierCards(panier, listeProduits));
        afficherPanier(panier, listeProduits);

        // Au changement de valeur de chaque <input> de classe '.itemQuantity' : MODIFIER DANS LE PANIER LA QUANTITE de chaque produit
        // modifierPanierQuantite(panier, listeProduits);
        document.querySelectorAll('.itemQuantity').forEach(input =>
            // au changement de valeur de chaque <input> '.itemQuantity'
            input.addEventListener('change', event => {

                // récupérer la quantité modifiée
                const quantiteModifiee = parseInt(event.target.value); // alert(quantiteModifiee);
                if (quantiteModifiee <= 0 || quantiteModifiee > 100) {
                    alert("Merci de renseigner un nombre d'article(s) (compris entre 1 & 100)"); exit;
                }

                // identifier le idProduit & la couleur du Produit Panier dont on souhaite modifier la quantité
                const idProduit = event.target.closest(".cart__item").dataset.id; // alert(idProduit);
                const couleur = event.target.closest(".cart__item").dataset.color; // alert(couleur);

                // modifier dans le Panier pour le produit & couleur en question la quantité modifiée
                let panier3 = setPanierQuantite(panier, idProduit, couleur, quantiteModifiee); // panier = panier3;

                // alert(`Quantité du panier: ${getPanierQuantite(panier)}`);
                afficherTotauxPanier(panier, listeProduits); // MAJ DOM du Panier pour les totaux
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
                    let panier2 = removePanierProduit(panier, idProduit, couleur); panier = panier2;

                    event.target.closest(".cart__item").remove();

                    // alert(`Quantité du panier: ${getPanierQuantite(panier)}`);
                    getPanierQuantite(panier) != 0 ? afficherTotauxPanier(panier, listeProduits) : window.location.href = 'cart.html';
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
            alert('IN');
            if (!inputsFormulaireTousOK()) alert("Désolé, impossible de commander s'il y a un champ invalide !");
            else {
                // créer un objet "contact" (à partir des données du formulaire) et un tableau des idProduits du Panier
                const leContact = creerContact(
                    document.getElementById("firstName").value,
                    document.getElementById("lastName").value,
                    document.getElementById("address").value,
                    document.getElementById("city").value,
                    document.getElementById("email").value
                );
                alert('toto');
                // récupérer les id des produits du panier pour envoi à l'API
                let idProduitsPanier = panier.map(produitPanier => produitPanier.id);

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

                let response = await fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({ // contact: leContact 
                        contact: {
                            firstName: document.getElementById("firstName").value,
                            lastName: document.getElementById("lastName").value,
                            address: document.getElementById("address").value,
                            city: document.getElementById("city").value,
                            email: document.getElementById("email").value
                        },
                        produits: idProduitsPanier
                    })
                }); alert('ZAZ');

                let result = await response.json(); alert(result);
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

