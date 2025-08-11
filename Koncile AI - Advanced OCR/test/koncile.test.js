require('dotenv').config();

const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);

const TEST_FILE_URL =
  'https://cdn.zapier.com/storage/files/f6679cf77afeaf6b8426de8d7b9642fc.pdf';

describe('Koncile.ai Integration', () => {
  const TEST_API_KEY = process.env.API_KEY;
  if (!TEST_API_KEY) {
    throw new Error('Missing API_KEY in environment variables! Provide one before testing.');
  }

  test('should authenticate successfully with a valid API key', async () => {
    const bundle = {
      authData: {
        api_key: TEST_API_KEY
      }
    };

    const result = await appTester(App.authentication.test, bundle);
    expect(result).toBeDefined();

  });

  test('should download a file and upload it', async () => {

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Missing API_KEY env var in the test environment!');
    }

    const bundle = {
      authData: {
        api_key: apiKey
      },
      inputData: {
        folder_id: 453,
        template_id: 3744,
        file: TEST_FILE_URL,
      }
    };

    const result = await appTester(
      App.creates.uploadFile.operation.perform,
      bundle
    );

    expect(result.task_ids).toBeTruthy()

  });
});
