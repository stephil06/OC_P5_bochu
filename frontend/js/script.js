/* Fichier JS de la page d'accueil : pour afficher tous les produits de l'API 
*/

/* Met à jour le DOM avec les caractéristiques des produits de l'API passés en paramètre 
    dans la <section class="items" id="items"> 
*/
const updateDomListeProduits = listeProduits => {

    let lesCards = '';
    listeProduits.forEach((produit) => {

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

const afficherTousLesProduits = async () => {
    // URL de l'API de tous les produits
    const listeProduits = await get('http://localhost:3000/api/products');

    if (listeProduits === -1) { alert('Problème du serveur. Veuillez nous contacter à support@name.com'); }
    else {
        updateDomListeProduits(listeProduits);

        // Mettre la liste des Produits dans le localStorage
        //  localStorage.setItem("listeProduits", JSON.stringify(listeProduits));
        setLocalStorage(listeProduits, listeProduitsLS);
    }
}

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
afficherTousLesProduits();