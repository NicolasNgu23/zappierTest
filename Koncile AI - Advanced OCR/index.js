// index.js
const uploadFileV10 = require('./creates/uploadFile');
const fetchFolders = require('./resources/fetchFolders');
const fetchTemplates = require('./resources/fetchTemplates');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: {
    type: 'custom',
    test: {
      url: 'https://api.koncile.ai/v1/check_api_key/',
      method: 'POST',
      headers: {
        Authorization: 'Bearer {{bundle.authData.api_key}}'
      }
    },
    fields: [
      {
        key: 'api_key',
        label: 'Koncile API Key',
        required: true,
        helpText:
          'Enter your Koncile **API Key**. [Click here](https://app.koncile.ai/dashboard/settings?tab=API) to go to the **API Keys** page in Koncile. Copy an existing **API Key** or generate a new one, then paste it here.'
      }
    ]

  },

  resources: {
    folderList: fetchFolders,
    templateList: fetchTemplates
  },

  creates: {
    [uploadFileV10.key]: uploadFileV10,
  },

  // If you have triggers/searches, they'd go here
};
