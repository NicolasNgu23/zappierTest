const https = require('https');
const FormData = require('form-data');

// Télécharge un fichier distant en stream
const makeDownloadStream = (url) =>
  new Promise((resolve, reject) => {
    https
      .request(url, (res) => {
        res.pause(); // On prépare le stream pour form-data
        resolve(res);
      })
      .on('error', reject)
      .end();
  });

const perform = async (z, bundle) => {
  const fileUrl = bundle.inputData?.file;
  const originalFilename = bundle.inputData?.filename || 'uploaded-from-zapier.bin';

  const stream = await makeDownloadStream(fileUrl);

  const form = new FormData();
  form.append('files', stream, {
    filename: originalFilename
  });

  stream.resume();

  const requestOptions = {
    url: 'http://test-api.koncile.ai:8000/v1/upload_file/',
    method: 'POST',
    params: {
      folder_id: bundle.inputData.folder_id,
      template_id: bundle.inputData.template_id,
    },
    body: form,
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`
    }
  };

  const response = await z.request(requestOptions);

  if (response.status >= 300) {
    throw new z.errors.Error(
      `File upload failed: ${response.status}`,
      'UploadFailed',
      response.status
    );
  }

  const result = response.json;
  return {
    ...result,
    uploaded_file_url: fileUrl,
    uploaded_filename: originalFilename
  };
};

module.exports = {
  key: 'uploadFile',
  noun: 'File',
  display: {
    label: 'Upload File (Koncile via Streaming)',
    description: 'Downloads a file from a URL and uploads it to Koncile.ai.'
  },
  operation: {
    inputFields: [
      {
        key: 'folder_id',
        label: 'Folder ID',
        required: true,
        type: 'string'
      },
      {
        key: 'template_id',
        label: 'Template ID',
        required: true,
        type: 'string'
      },
      {
        key: 'file',
        label: 'File URL',
        required: true,
        type: 'file',
        helpText: 'URL of the file to upload (e.g. from Google Drive or Slack)'
      },
      {
        key: 'filename',
        label: 'Original Filename',
        required: false,
        type: 'string',
        helpText: 'The real name of the file (e.g. facture.pdf). Used for correct file type.'
      }
    ],
    perform,
    sample: {
      task_ids: [123],
      uploaded_file_url: 'https://cdn.zapier.com/storage/files/fichier.pdf',
      uploaded_filename: 'fichier.pdf'
    }
  }
};
