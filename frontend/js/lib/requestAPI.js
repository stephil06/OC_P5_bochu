/* Retourne : les datas de l'API dont l'url est passé en argument, sous forme d'un objet JSON
   Retourne : -1 si problème
*/
const get = async (url) => {
    try {
        // interrogation de l’API ayant pour URL url passé en argument et retourne les data dans la constante reponse.
        const reponse = await fetch(url); 
        // retourne la réponse sous forme d’un objet JSON
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
const getValeurParametreURLpageCourante = (nomParametre) => (new URL(window.location.href)).searchParams.get(nomParametre);