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
      url: 'http://test-api.koncile.ai:8000/v1/check_api_key/',
      method: 'POST',
      headers: {
        Authorization: 'Bearer {{bundle.authData.api_key}}'
      }
    },
    fields: [
      { key: 'api_key', label: 'API Key', required: true }
    ]
  },

  resources: {
    folderList: fetchFolders,
    templateList: fetchTemplates
  },



  creates: {
    [uploadFileV10.key]: uploadFileV10
  },

  // If you have triggers/searches, they'd go here
};
