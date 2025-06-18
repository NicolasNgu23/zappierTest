// creates/uploadCsvToGoogleDrive.js
const { decodeFile } = require('../helpers/decodeFile');  // Correction du chemin

module.exports = {
  key: 'uploadCsvToGoogleDrive',
  noun: 'File',

  display: {
    label: 'Upload CSV to Google Drive',
    description: 'Uploads a CSV file to Google Drive.'
  },

  operation: {
    inputFields: [
      {
        key: 'fileData',  // Le fichier encodé que vous recevez via le Webhook
        type: 'string',
        required: true,
        label: 'CSV Data',
        helpText: 'Provide the CSV data to be uploaded to Google Drive.'
      },
      {
        key: 'fileName',  // Nom du fichier CSV
        type: 'string',
        required: true,
        label: 'File Name',
        helpText: 'Provide the name of the file to upload.'
      }
    ],

    perform: async (z, bundle) => {
      const { fileData, fileName } = bundle.inputData;

      // Si le fichier est encodé en base64, nous le décodons
      const decodedFile = decodeFile(fileData);

      // Préparer les métadonnées du fichier
      const fileMetadata = {
        name: fileName,  // Nom du fichier
        mimeType: 'text/csv',  // Type MIME pour un fichier CSV
      };

      // Corps du fichier à envoyer à Google Drive
      const media = {
        mimeType: 'text/csv',
        body: decodedFile,  // Le fichier décodé (au format binaire)
      };

      // Envoi à Google Drive via l'API de Google Drive
      const response = await z.request({
        url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bundle.authData.api_key}`,
          'Content-Type': 'multipart/related',
        },
        body: media.body,
      });

      // Retourner les informations du fichier envoyé
      return {
        fileName,
        fileId: response.data.id,  // ID du fichier sur Google Drive
        message: 'File uploaded successfully'
      };
    }
  }
};
