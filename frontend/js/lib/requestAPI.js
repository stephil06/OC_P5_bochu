
const get = async (url) => {
    
  /* - Récupérer les datas dans la variable result de l'API en question (via fetch) 
   - Met à jour le DOM avec les caractéristiques des produits (contenus dans result)
    */
    try {

    const reponse = await fetch(url);
    return await reponse.json();
    }
    catch (exception) {
        return -1;
    }

}


/* Concernant l'URL de la page courante (i.e "window.location.href"):
    Retourne:   la valeur du paramètre de nom passé en argument 
                null si le paramètre en argument n'existe pas dans l'URL
*/
const getValeurParametreURLpageCourante = nomParametre => (new URL(window.location.href)).searchParams.get(nomParametre);