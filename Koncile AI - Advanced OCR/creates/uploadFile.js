const https = require('https');
const FormData = require('form-data');

const makeDownloadStream = (url) =>
  new Promise((resolve, reject) => {
    https
      .request(url, (res) => {
        res.pause();
        resolve(res);
      })
      .on('error', reject)
      .end();
  });

const perform = async (z, bundle) => {
  const fileUrl = bundle.inputData.file;
  const fileName = bundle.inputData.fileName || 'uploaded-from-zapier.txt';

  const stream = await makeDownloadStream(fileUrl);

  const form = new FormData();
  form.append('files', stream, {
    filename: fileName
  });

  stream.resume();

  const requestOptions = {
    url: 'https://api.koncile.ai/v1/upload_file/',
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
    uploaded_file_name: fileName
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
        label: 'Folder',
        required: true,
        type: 'string',
        dynamic: 'folderList.id.name',
        helpText: 'Choose a folder from your Koncile account.'
      },
      {
        key: 'template_id',
        label: 'Template',
        required: true,
        type: 'string',
        dynamic: 'templateList.id.name',
        helpText: 'Choose a template based on the selected folder.'
      },
      {
        key: 'file',
        label: 'File URL',
        helpText:
          'A URL to the file you want to upload. In real Zaps, this is often provided by a previous step.',
        required: true,
        type: 'file'
      },
      {
        key: 'fileName',
        label: 'File Name',
        helpText: 'The name of the file, including extension (e.g. "invoice.pdf")',
        required: true,
        type: 'string'
      }
    ],
    perform,
    sample: {
      task_ids: [123, 456],
      uploaded_file_url: 'https://cdn.zapier.com/storage/files/abc123.pdf',
      uploaded_file_name: 'invoice.pdf'
    }
  }
};
