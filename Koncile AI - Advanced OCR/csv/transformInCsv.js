const fs = require('fs'); // Optionnel si vous souhaitez enregistrer le fichier CSV

/**
 * Fonction pour transformer un objet JSON en format CSV.
 * @param {Object} jsonData - L'objet JSON à transformer en CSV.
 * @param {string} outputFileName - Le nom du fichier CSV à générer.
 * @returns {string} - Le contenu du CSV sous forme de chaîne de caractères.
 */
function transformJsonToCsv(jsonData, outputFileName) {
    let csvContent = [];

    // Étape 1: Créer dynamiquement les entêtes (headers) à partir des clés du JSON
    let headers = [];
    function extractKeys(obj, parentKey = '') {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let fullKey = parentKey ? `${parentKey}.${key}` : key;
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
                    // Recursion pour objets imbriqués
                    extractKeys(obj[key], fullKey);
                } else {
                    // Ajouter la clé dans les entêtes
                    if (!headers.includes(fullKey)) {
                        headers.push(fullKey);
                    }
                }
            }
        }
    }

    // Extraire les entêtes du JSON
    extractKeys(jsonData);
    csvContent.push(headers.join(",")); // Ajouter la ligne d'entête dans le CSV

    // Étape 2: Créer une ligne avec les valeurs pour chaque objet dans les données
    function extractValues(obj, parentKey = '') {
        let row = [];
        headers.forEach(header => {
            let keys = header.split('.');
            let value = obj;
            keys.forEach(k => {
                if (value && value.hasOwnProperty(k)) {
                    value = value[k];
                } else {
                    value = ''; // Si la clé n'existe pas, ajouter une valeur vide
                }
            });
            row.push(value);
        });
        return row;
    }

    // Créer les lignes de données
    if (Array.isArray(jsonData)) {
        // Si c'est un tableau d'objets (par exemple, plusieurs lignes de facture)
        jsonData.forEach(item => {
            let row = extractValues(item);
            csvContent.push(row.join(","));
        });
    } else {
        // Si c'est un seul objet
        let row = extractValues(jsonData);
        csvContent.push(row.join(","));
    }

    // Étape 3: Retourner le contenu CSV en chaîne de caractères
    const csvString = csvContent.join("\n");

    // Optionnel : Vous pouvez enregistrer le CSV dans un fichier
    // fs.writeFileSync(outputFileName, csvString, 'utf8');

    return csvString;
}

module.exports = { transformJsonToCsv };
