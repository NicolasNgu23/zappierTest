// index.js
const uploadFileV10 = require('./creates/uploadFile');

module.exports = {
  // typical package + platform version
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  // if you have an auth block, it might look like this:
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

  // The important part is exposing `uploadFile_v10` in "creates"
  creates: {
    [uploadFileV10.key]: uploadFileV10
  },

  // If you have triggers/searches, they'd go here
};
