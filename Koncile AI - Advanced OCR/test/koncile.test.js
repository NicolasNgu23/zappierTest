require('dotenv').config();
/* globals describe, test, expect */
const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);

// Example file to test streaming
const TEST_FILE_URL =
  'https://cdn.zapier.com/storage/files/f6679cf77afeaf6b8426de8d7b9642fc.pdf';

describe('Koncile.ai Integration', () => {
  const TEST_API_KEY = process.env.API_KEY;
  if (!TEST_API_KEY) {
    throw new Error('Missing API_KEY in environment variables! Provide one before testing.');
  }

  // 1) Authentication Test
  test('should authenticate successfully with a valid API key', async () => {
    const bundle = {
      authData: {
        api_key: TEST_API_KEY
      }
    };

    const result = await appTester(App.authentication.test, bundle);
    expect(result).toBeDefined();
    // Adjust this assertion based on your check_api_key response
    // Example: expect(result.success).toBe(true);
  });

  test('should download a file and upload it', async () => {
    // Make sure you set process.env.API_KEY or use a .env file
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Missing API_KEY env var in the test environment!');
    }

    const bundle = {
      authData: {
        api_key: apiKey
      },
      inputData: {
        folder_id: 453, // Replace with a valid folder_id for your Koncile account
        template_id: 1776, // Replace with a valid template_id
        file: TEST_FILE_URL, // The file to download + re-upload
      }
    };

    const result = await appTester(
      App.creates.uploadFile.operation.perform,
      bundle
    );

    // Check the response from Koncile
    // Print the result to see what it looks like
    console.log(result);
    expect(result.task_ids).toBeTruthy()

    // If Koncile returns something like { upload_id: "abc123", success: true }
    // then you can test:
    // expect(result.success).toBe(true);
    // expect(result.upload_id).toBeTruthy();
  });
});
