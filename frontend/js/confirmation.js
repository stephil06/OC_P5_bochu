/* Fichier JS de la page "confirmation.html?id=orderId" 
    - pour afficher le numéro de commande orderId
*/

/* récupérer dans l'URL, le n° de commande pour affichage dans le <span id="orderId"> */
const initConfirmationCommande = () => {
    // const parametre = new URLSearchParams(window.location.search);
    // const orderId = parametre.get("id");
    const orderId = getValeurParametreURLpageCourante("id");
    if (orderId === null || orderId === '') {
        alert("Désolé. Ce numéro de commande n'existe pas !");
        // <div class="confirmation">
        document.querySelector(".confirmation p").innerHTML = 'Commande non validée !';
    }
    else {
       // document.querySelector(".confirmation p:not(#orderId)").innerHTML = 'Commande validée !<br> MERCI pour votre commande !<br>';
       alert("MERCI pour votre commande !");
       document.getElementById("orderId").innerHTML = orderId;
    }
}

// -------------------------------------------------------------------------------------------------------
// CORPS -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------
initConfirmationCommande();