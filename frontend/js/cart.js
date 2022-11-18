// ------- Fonctions utilisées par les Règles Métiers du Panier ------------------------

/* Retourne le nombre de produits du Panier */
const getPanierQuantite = (panier) => {
    let quantite = 0;
    for (i = 0; i < panier.length; i++) quantite += panier[i].quantite;
    return quantite;
}

/* Retourne le Prix du Panier */
const getPanierPrix = (panier, listeProduits) => {
    let prix = 0;
    for (i = 0; i < panier.length; i++) {
        // récupérer les caractéristiques du produit
        let produit = getProduit(listeProduits, panier[i].id);
        prix += (produit.price * panier[i].quantite);
    }
    return prix;
}

/* Retourne les Cards du Panier */
const getPanierCards = (panier, listeProduits) => {
    let lesCards = '';
    for (i = 0; i < panier.length; i++) {
        // récupérer les caractéristiques du produit
        let produit = getProduit(listeProduits, panier[i].id);

        lesCards +=
            `<article class="cart__item" data-id="${panier[i].id}" data-color="${panier[i].couleur}">
            <div class="cart__item__img">
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${produit.name}</h2>
                    <p>${panier[i].couleur}</p>
                    <p>${produit.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panier[i].quantite}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;
    }
    // alert(lesCards);
    return lesCards;
}

/* Modifie dans le Panier la quantite du produit 
 ayant pour id idProduit & couleur pCouleur pour la quantite quantiteModifiee passés en argument 
 Puis Modifie le LocalStorage du Panier
 Retourne la quantite avant Modification
*/
const setPanierQuantite = (panier, idProduit, pCouleur, quantiteModifiee) => {
    const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);

    qteAvant = trouve.quantite;
    // Modifie la quantite dans le Panier, puis au LocalStorage du Panier
    trouve.quantite = quantiteModifiee;
    localStorage.setItem("panierZ", JSON.stringify(panier));

    return qteAvant;
}

/* Supprime du Panier le produit dont id = idProduit & couleur = pCouleur (passés en argument) 
Puis Modifie le LocalStorage du Panier
*/
const removePanierProduit = (panier, idProduit, pCouleur) => {
    const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
    /* template : let nbr = 6; var tab = [3, 6, 8]; tab = tab.filter(item => item !== nbr) */
    panier = panier.filter(item => item != trouve);
    localStorage.setItem("panierZ", JSON.stringify(panier));
}

// -------------------------------------------------------------------------------------------------------
// Règles METIERS ----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Afficher le Panier (i.e. ses Produits, sa Quantié, son Prix) */
const afficherPanier = (panier, listeProduits) => {
    // MAJ DOM du Panier
    document.querySelector("#cart__items").innerHTML = getPanierCards(panier, listeProduits);
    document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
    document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits);
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
            setPanierQuantite(panier, idProduit, couleur, quantiteModifiee);

            // MAJ DOM du Panier
            document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
            document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits);
        })
    );
}

/* Retirer du Panier les produits
   Fonction déclenchée au clic sur chaque <p> de classe '.deleteItem'
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
                removePanierProduit(panier, idProduit, couleur);
                // MAJ DOM du Panier
                document.querySelector("#cart__items").innerHTML = getPanierCards(panier, listeProduits);
                document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
                document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits);

                alert("Le produit a été supprimé");
            }
        })
    );
}

// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du Formulaire -----------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Pour chaque <input> du Formulaire de nom nomInput & de valeur val :
    retourne true ssi sa valeur vérfie le pattern correspondant
*/
const inputFormulairePatternOK = (nomInput, val) => {
    if (nomInput == 'firstName' || nomInput == 'lastName' || nomInput == 'city')
        return /^[A-Z][a-z\é\è\ô\-]+$/.test(val); // "[a-zA-Z-éèô -]*"
    if (nomInput == 'address') return true;
    if (nomInput == 'email') return true;
};

/* Fonction de contrôle du champ du formulaire ayant pour nom nomInput (nom du <input> du HTML) passé en argument
     Si sa valeur est invalide : 
        - le <input> passe en rouge & sous le <input> est indiqué 'Champ invalide'
        - retourne true
    Sinon: retourne false    
*/
const inputFormulaireOK = (nomInput) => {
    const valeurInput = document.getElementById(nomInput).value;

    let input = document.querySelector('#' + nomInput);
    if (inputFormulairePatternOK(nomInput, valeurInput)) {
        document.querySelector('#' + nomInput + 'ErrorMsg').textContent = '';
        input.style.backgroundColor = 'white';
        return true;
    } else {
        input.style.backgroundColor = 'red';
        document.querySelector('#' + nomInput + 'ErrorMsg').textContent = 'Champ invalide';
        return false;
    }
}

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

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
let panier = JSON.parse(localStorage.getItem("panierZ"));

if (panier == null) {
    alert('Panier vide');
} else {
    // récupérer (du localStorage) la liste des produits (pour avoir les Prix)
    const listeProduits = JSON.parse(localStorage.getItem("listeProduits"));

    afficherPanier(panier, listeProduits);
    modifierPanierQuantite(panier, listeProduits);
    retirerPanierProduit(panier, listeProduits);
}

// --------- Le Formulaire -------------------------------------------------------------------------------

// Pour les <input> du Formulaire : vérifier les données saisies par l'utilisateur
const inputsForm = ['firstName', 'lastName', 'address', 'city', 'email'];
for (let i = 0; i < inputsForm.length; i++) {
    // au changement de valeur de chaque <input> : tester sa validité 
    document.querySelector('#' + inputsForm[i]).addEventListener('change', (evt) => {
        inputFormulaireOK(inputsForm[i]);
    });
}

// Au clic sur le bouton du formulaire "Commander"
document.querySelector("#order").addEventListener("click", (event) => {

    const b = 'firstName'; // alert('T:' + document.getElementById("firstName").value);
    inputFormulaireOK(b);

    // créer un objet "contact" (à partir des données du formulaire) et un tableau de produits
    const contact = creerContact(
        document.getElementById("firstName").value,
        document.getElementById("lastName").value,
        document.getElementById("address").value,
        document.getElementById("city").value,
        document.getElementById("email").value
    );

});
