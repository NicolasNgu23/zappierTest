const https = require('https');
const FormData = require('form-data');

// Node v10+ approach for downloading a file URL as a stream
const makeDownloadStream = (url) =>
  new Promise((resolve, reject) => {
    https
      .request(url, (res) => {
        // Pause the stream so we can attach it to form-data before it starts sending
        res.pause();
        resolve(res);
      })
      .on('error', reject)
      .end();
  });

const perform = async (z, bundle) => {
  // 1) bundle.inputData.file is assumed to be a URL for the file
  //    that we need to download first
  const stream = await makeDownloadStream(bundle.inputData.file);

  // 2) Build multipart/form-data
  const form = new FormData();
  // If Koncile expects the file field name as "files":
  form.append('files', stream, {
    // Optionally give it a filename:
    filename: 'uploaded-from-zapier.txt'
    // If needed, you can pass contentType too, e.g. { contentType: 'text/plain' }
  });

  // Start piping the stream
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
      // Don’t set Content-Type manually, or you'll break the form-data boundary
      Authorization: `Bearer ${bundle.authData.api_key}`
    }
  };

  // 3) Perform the request
  const response = await z.request(requestOptions);

  if (response.status >= 300) {
    throw new z.errors.Error(
      `File upload failed: ${response.status}`,
      'UploadFailed',
      response.status
    );
  }

  // 4) Return the parsed JSON response (assuming Koncile returns JSON)
  return response.json;
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
        helpText:
          'A URL to the file you want to upload. In real Zaps, this is often provided by a previous step.',
        required: true,
        type: 'file'
      }
    ],
    perform,
    // Example sample output
    sample: {
      // Adjust to whatever Koncile returns, e.g.
      task_ids : [123, 456]
    }
  }
};
