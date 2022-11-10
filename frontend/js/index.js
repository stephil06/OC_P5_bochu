/* Fichier JS de la page d'accueil :
    - pour afficher tous les produits de l'API 
*/

/* URL de l'API de tous les produits */
const URL_API_PRODUITS = `http://localhost:3000/api/products`;

/* Met à jour le DOM avec les caractéristiques des produits de l'API passés en paramètre 
    dans la <section class="items" id="items"> 
*/
const updateDOMlesProduitsAPI = lesProduitsAPI => {

    let lesCards = ``;
    lesProduitsAPI.forEach((produit) => {

        /* <section> de la page d'accueil affichant les produits de l'API */
        /* <section class="items" id="items">
        <a href="./product.html?id=42">
            <article>
            <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">Kanap name1</h3>
            <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
            </article>
        </a> */

        lesCards +=
            `<a href="./product.html?id=${produit._id}">          
            <article>
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
                <h3 class="productName">${produit.name}</h3>
                <p class="productDescription">${produit.description}</p>
            </article>
        </a>`;

    });
    document.querySelector(".items").innerHTML = lesCards;
}

/* TEMPLATE :
fetch(url, options)
.then(response => response.json())
.then(result =>  process result ); 
.catch(function (error) {
    alert("Problème du serveur");
});
*/

/* - Récupérer les datas dans la variable result de l'API en question (via fetch) 
   - Met à jour le DOM avec les caractéristiques des produits (contenus dans result)
*/
fetch(URL_API_PRODUITS)
    .then(response => response.json())
    .then(result => // process result
    { updateDOMlesProduitsAPI(result); }
    )
    .catch(function (error) {
        alert("Problème du serveur !");
    });
