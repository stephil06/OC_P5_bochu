// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du LocalStorage ---------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
function realTypeof(obj) {
    return Object.prototype.toString.apply(obj);
}

/* Retourne à partir du localStorage l'objet stocké de nom element */
const getLocalStorage = (nomObjet) => {
    return JSON.parse(localStorage.getItem(nomObjet));
    //  return panier = JSON.parse(localStorage.getItem('panierZ'));
}

/* Met dans le localStorage l'objet de nom nomObjet */
const setLocalStorage = (objet, nomObjet) => {
    /* let nomObjet = Object.prototype.toString(objet); 
     if( nomObjet == "panier" ) nomObjet = nomObjet + 'Z'; */
    localStorage.setItem(nomObjet, JSON.stringify(objet));
    // localStorage.setItem("panierZ", JSON.stringify(panier));
}

// ------- Fonctions utilisées par les Règles Métiers du Panier ------------------------

/* Retourne true ssi le panier est vide
   Si le panier est vide : affiche un message et redirige sur la homepage 
*/
const panierVide = (panier) => {
    let vide = false;
    if (panier.length == 0) {
        vide = true;
        alert("Panier vide ! Vous allez être redirigé sur la page d'accueil."); window.location.href = 'index.html';
    }
    return vide;
}

/* Retourne le nombre de produits du Panier */
const getPanierQuantite = (panier) => {
    /* let quantite = 0;
     for (i = 0; i < panier.length; i++) quantite += panier[i].quantite; */

    let qteTotal = (panier.length >= 1) ? panier.map(produitPanier => produitPanier.quantite).reduce((total, quantite) => total += quantite)
        : 0;
    alert(`Quantité totale: ${qteTotal}`);
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
    alert(`Prix total: ${prixTotal}`);
    return prixTotal;
}

const getProduitPanier = (panier, idProduit, pCouleur) => {
    const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
    return trouve;
}

/* Retourne le Card du Panier */
const getPanierCard = (panier, listeProduits, idProduit, pCouleur) => {
    let leCard = '';
    // récupérer les caractéristiques du produit
    let produit = getProduit(listeProduits, idProduit);
    let produitPanier = getProduitPanier(panier, idProduit, pCouleur);

    leCard =
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
    // }
    // alert(leCard);
    return leCard;
}

/* Retourne les Cards du Panier */
const getPanierCards = (panier, listeProduits) => {
    let lesCards = '';

    panier.forEach(
        produitPanier => {
            // récupérer les caractéristiques du produit
            let produit = getProduit(listeProduits, produitPanier.id);
            lesCards +=
                `<article class="cart__item" data-id="${produitPanier.id}" data-color="${produitPanier.couleur}">
            <div class="cart__item__img">
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${produit.name}</h2>
                    <p>${produitPanier.couleur}</p>
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
        }
    );
    // alert(lesCards);
    return lesCards;
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
    setLocalStorage(panier, "panierZ");
    return panier; // qteAvant;
}

/* Supprime du Panier le produit dont id = idProduit & couleur = pCouleur (passés en argument) 
Puis Modifie le LocalStorage du Panier
*/
const removePanierProduit = (panier, idProduit, pCouleur) => {
    const trouve = panier.find(element => element.id == idProduit && element.couleur == pCouleur);
    /* template : let nbr = 6; var tab = [3, 6, 8]; tab = tab.filter(item => item !== nbr) */
    panier = panier.filter(item => item != trouve);
    // localStorage.setItem("panierZ", JSON.stringify(panier));
    setLocalStorage(panier, "panierZ");
    return panier;
}

// -------------------------------------------------------------------------------------------------------
// Règles METIERS ----------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Afficher le Panier (i.e. ses Produits, sa Quantié, son Prix) */
const afficherPanier = (panier, listeProduits) => {
    // MAJ DOM du Panier
    /* document.querySelector("#cart__items").innerHTML = getPanierCards(panier, listeProduits);
     document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
     document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits); */

    alert("AVANT");
    let listProduits = document.querySelector("#cart__items");
    /*
    for (i = 0; i < panier.length; i++) {
        let s = getPanierCard(panier, listeProduits, panier[i].id, panier[i].couleur);
        listProduits.insertAdjacentHTML("beforeend", s);
    }*/

    panier.forEach(
        (produitPanier) => {
            const s = getPanierCard(panier, listeProduits, produitPanier.id, produitPanier.couleur);
            listProduits.insertAdjacentHTML("beforeend", s);
        });

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
            let panier3 = setPanierQuantite(panier, idProduit, couleur, quantiteModifiee); panier = panier3;

            alert('Qte:' + getPanierQuantite(panier));
            // MAJ DOM du Panier
            document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
            document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits);
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

                // setTimeout(() => div.remove(), 1000);
                // setTimeout(() => event.target.closest(".cart__item").remove(), 1000);


                alert('Qte:' + getPanierQuantite(panier));
                // document.querySelector("#cart__items").innerHTML = getPanierCards(panier, listeProduits);
                document.querySelector("#totalQuantity").innerHTML = getPanierQuantite(panier);
                document.querySelector("#totalPrice").innerHTML = getPanierPrix(panier, listeProduits);

                panierVide(panier);
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
    switch (nomInput) {
        case 'firstName': return /^[A-Z][a-z\é\è\ô\-]+$/.test(val); // "[a-zA-Z-éèô -]*"
            break;
        case 'lastName': return /^[A-Z][a-z\é\è\ô\-\' ]+$/.test(val);
            break;
        case 'city': return /^[A-Z][a-z\é\è\ô\à\-\' ]+$/.test(val); // [a-zA-Z-éèà]*
            break;
        case 'address': return /^([0-9a-z0-9'àâéèêôùûçÀÂÉÈÔÙÛÇ.°\s-]{8,100})$/.test(val);
            // return /^[A-Za-z0-9.,- ]{4,20}[ ]{0,2}$/.test(val);
            break;
        case 'email':
            // cf. https://www.journaldunet.fr/web-tech/developpement/1202967-comment-verifier-une-adresse-mail-en-javascript/
            return /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/.test(val); break;
        default: return false;
    }
}

/* Fonction de contrôle du champ du formulaire ayant pour nom nomInput (nom du <input> du HTML) passé en argument
     Si sa valeur est invalide : 
        - le <input> passe au rouge & sous le <input> est indiqué le message 'Champ invalide' (avec un exemple de donnée valide)
        - retourne false
    Sinon :
        - le <input> passe au vert & le message est vidé
        - retourne true    
*/
const inputFormulaireOK = (nomInput) => {
    const valeurInput = document.getElementById(nomInput).value;

    let input = document.querySelector('#' + nomInput);
    if (inputFormulairePatternOK(nomInput, valeurInput)) {
        input.style.backgroundColor = 'green';
        document.querySelector('#' + nomInput + 'ErrorMsg').textContent = '';
        return true;
    } else {
        input.style.backgroundColor = 'red';
        let message = "(Exemple valide : ";
        switch (nomInput) {
            case 'firstName': message += "Pierre-jérôme)";
                break;
            case 'lastName': message += "Giscard d'estaing de-la-tour)";
                break;
            case 'address': message += "14bis rue de tassigny résidence le parc bât. b3 appart. n°3)";
                break;
            case 'city': message += "Morne-à-l'eau)";
                break;
            case 'email': message += "jl.dupont-virto51@gmail.com)";
                break;
            default: message = "champ inconnu";
                break;
        }
        document.querySelector('#' + nomInput + 'ErrorMsg').textContent = 'Champ invalide ' + message;
        return false;
    }
}

/* Retourne la liste des noms des <input> du formulaire (sous forme de tableau) 
    i.e. par eg. pour <input name="firstName" retourne "firstName"
    => ['firstName', 'lastName', 'address', 'city', 'email']
*/
const getNomInputsFormulaire = () => {
    // récupérer la liste des <input> du formulaire
    let listeInputsForm = document.querySelectorAll(".cart__order__form__question input");

    let nomInputsFormulaire = [];
    listeInputsForm.forEach(
        // récupérer pour chaque <input> du formulaire, la valeur de l'attribut name
        input => {
            nomInputsFormulaire.push(input.attributes.item(1).nodeValue);
            // alert(input.attributes.item(1).nodeValue);
        }
    );
    return nomInputsFormulaire;
}

/* Retourne true ssi tous les <input> du formulaire sont valides */
const inputsFormulaireTousOK = () => {
    const nomInputsFormulaire = getNomInputsFormulaire();

    let ok = true;
    nomInputsFormulaire.forEach(
        nom => { ok = inputFormulaireOK(nom); if (!ok) return ok; }
    );
    return ok;

    /*       return inputFormulaireOK('firstName') && inputFormulaireOK('lastName') && inputFormulaireOK('address')
                && inputFormulaireOK('city') && inputFormulaireOK('email'); */
}

/* Fonction déclenchée au changement de valeur de chaque <input> du formulaire
    Pour les <input> du Formulaire : vérifier les données saisies par l'utilisateur */
const trigger_change_input_form_verifier_valeur = () => {

    const nomInputsFormulaire = getNomInputsFormulaire(); // ['firstName', 'lastName', 'address', 'city', 'email'];

    nomInputsFormulaire.forEach(
        input => {
            // alert(input);
            // au changement de valeur de chaque <input> : tester sa validité 
            document.querySelector('#' + input).addEventListener('change', (evt) => {
                inputFormulaireOK(input);
            });
        });
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

// --------- Le Panier -------------------------------------------------------------------------------

// récupérer (du localStorage) le panier
let panier = getLocalStorage("panierZ");

if (!panierVide(panier)) { // Si panierVide(), redirection vers la homepage
    // récupérer (du localStorage) la liste des produits (pour avoir les Prix)
    const listeProduits = getLocalStorage("listeProduits");
    // alert(getPanierCards(panier, listeProduits));
    afficherPanier(panier, listeProduits);
    modifierPanierQuantite(panier, listeProduits);
    retirerPanierProduit(panier, listeProduits);
}

// --------- Le Formulaire ------------------------------------------------------------------------
// document.querySelector("#order").style.backgroundColor = 'red';
// document.querySelector("#order").disabled = true; 

// A chaque changement de valeur d'un <input> du formulaire : vérifier sa valeur
trigger_change_input_form_verifier_valeur();


// Au clic sur le bouton du formulaire "Commander"
document.querySelector("#order").addEventListener(// "click", (event) => {
    "click", async function (event) {
        event.preventDefault();
        alert('IN');
        if (!inputsFormulaireTousOK()) alert("Désolé, impossible de commander s'il y a un champ invalide !");
        else {
            // créer un objet "contact" (à partir des données du formulaire) et un tableau de produits
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
