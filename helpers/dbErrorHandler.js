"use strict";

/**
 * Get unique error field name
 */

const uniqueMessage = error =>{
    let output;
    try{
        let fieldName = error.message.substring(
            error.message.lastIndexOf(".$") + 2,
            error.message.lastIndexOf("_1")
        );
        output =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) +
            " Déja existé";
    } catch (ex) {
        output = "Unique champ existe déja";
    }
    return output;
};

/**
 * Get the error message from error objet
 */

exports.errorHandler = error =>{
    let message = "";

    if (error.code){
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Un problème est survenu";
        }
    } else{
        for (let errorName in error.errorors){
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }
    return message;
}
