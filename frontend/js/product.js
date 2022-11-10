/* Fichier JS de la page "product.html?id=valeur" 
    - pour afficher les caractéristiques du produit ayant pour id valeur
    - Au clic sur le bouton "Ajouter au panier": ajouter le produit (id - couleur - quantité) dans le Panier
*/

/* Concernant l'URL de la page courante (i.e "window.location.href"):
    Retourne:   la valeur du paramètre de nom passé en argument 
                null si le paramètre en argument n'existe pas dans l'URL
*/
const getValeurParametreURLpageCourante = nomParametre => (new URL(window.location.href)).searchParams.get(nomParametre);

/* URL de l'API du produit ayant pour id celui de l'URL de la page courante */

const PRODUIT_ID = getValeurParametreURLpageCourante("id"); // alert(PRODUIT_ID);

const URL_API_PRODUIT = `http://localhost:3000/api/products/${PRODUIT_ID}`; // alert(URL_API_PRODUIT);



/* Met à jour le DOM avec les caractéristiques du produit de l'API passé en paramètre */
const updateDOMleProduitAPI = leProduitAPI => {
    /* <div class="item__img">
          <!-- <img src="../images/logo.png" alt="Photographie d'un canapé"> --></img> */
    document.querySelector(".item__img").innerHTML += `<img src="${leProduitAPI.imageUrl}" alt="${leProduitAPI.altTxt}">`;

    /* <h1 id="title"><!-- Nom du produit --></h1> */
    document.querySelector("#title").innerHTML += `${leProduitAPI.name}`;

    /* <p>Prix : <span id="price"><!-- 42 --></span>€</p> */
    document.querySelector("#price").innerHTML += `${leProduitAPI.price}`;

    /* <p id="description"><!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. --></p> */
    document.querySelector("#description").innerHTML += `${leProduitAPI.description}`;

    /* <select name="color-select" id="colors">
                  <option value="">--SVP, choisissez une couleur --</option>
    <!--          <option value="vert">vert</option>
                  <option value="blanc">blanc</option> --> */
    leProduitAPI.colors.forEach(
        (couleur) => {
            document.querySelector("#colors").innerHTML += `<option value="${couleur}">${couleur}</option>`;
        });
}

/* TEMPLATE :
fetch(url, options)
.then(response => response.json())
.then(result =>  process result ); 
.catch(function (error) {
    alert("Problème du serveur");
});
*/

/* Récupérer les datas dans la variable result de l'API en question (via fetch) 
 - Met à jour le DOM avec les caractéristiques du produit (contenu dans result)

 - Au clic sur le bouton "Ajouter au panier":
    - créer un ProduitPanier
    - l'ajouter au Panier
*/
fetch(URL_API_PRODUIT)
    .then(response => response.json())
    .then(result => {
        updateDOMleProduitAPI(result);

        // Au clic sur le bouton "Ajouter au panier"
        document.querySelector("#addToCart").addEventListener('click', (evt) => {

            // créer un produit du panier
            const COULEUR = document.querySelector("#colors").value;
            if (COULEUR == '') { alert("Merci de renseigner une couleur"); exit; }

            const QUANTITE = parseInt(document.querySelector("#quantity").value, 10);
            if (QUANTITE <= 0 || QUANTITE > 100) { alert("Merci de renseigner un nombre d'article(s) (compris entre 1 & 100)"); exit; }

            let produitPanier = {
                id: `${result._id}`,
                couleur: COULEUR,
                quantite: QUANTITE
            };

        });

    }
    
    )
    .catch(function (error) {
        alert("Problème du serveur !");
    });