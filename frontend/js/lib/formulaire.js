// -------------------------------------------------------------------------------------------------------
// ------- Fonctions du Formulaire -----------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

/* Retourne la liste des noms des <input> du formulaire (sous forme de tableau) 
    i.e. par eg. pour <input name="firstName" retourne "firstName"
    => ['firstName', 'lastName', 'address', 'city', 'email']
*/
const getNomInputsFormulaire = () => {
    // récupérer la liste des <input> du formulaire
    const listeInputsForm = document.querySelectorAll(".cart__order__form__question input");

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

/* Retourne true ssi tous les <input> du formulaire sont valides */
const inputsFormulaireTousOK = () => {
    const nomInputsFormulaire = getNomInputsFormulaire();

    let ok = true;
    nomInputsFormulaire.forEach(
        nom => { if (!inputFormulaireOK(nom)) ok = false; }
    );
    return ok;
    /*       return inputFormulaireOK('firstName') && inputFormulaireOK('lastName') && inputFormulaireOK('address')
                && inputFormulaireOK('city') && inputFormulaireOK('email'); */
}


/* Retourne true ssi un <input> du formulaire comporte une valeur */
const isInputFormulaireSaisie = () => {
    const nomInputsFormulaire = getNomInputsFormulaire();

    let saisie = false;
    nomInputsFormulaire.forEach(
        nom => {
            if (document.getElementById(nom).value != '') saisie = true;
        }
    );
    // alert(saisie);
    return saisie;
}