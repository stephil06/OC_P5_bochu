/* Retourne le Produit de la listeProduits ayant pour id = idProduit passé en argument 
    pour récupérer ses caractéristiques dont le Prix
*/
const getProduit = (listeProduits, idProduit) => {
    return listeProduits.find(element => element._id == idProduit);
}