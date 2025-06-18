// helpers/decodeFile.js
const atob = require('atob');  // Décodage base64

/**
 * Fonction pour décoder une chaîne encodée (base64 ou autre format).
 * @param {string} encodedString - La chaîne encodée à décoder.
 * @returns {Buffer} - Le fichier décodé sous forme de Buffer.
 */
function decodeFile(encodedString) {
    // Décoder la chaîne base64
    const decodedString = atob(encodedString);

    // Convertir en Buffer pour manipulation binaire
    const buffer = Buffer.from(decodedString, 'binary');

    return buffer;
}

module.exports = { decodeFile };
