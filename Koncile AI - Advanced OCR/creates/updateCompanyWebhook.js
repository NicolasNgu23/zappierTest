const updateCompanyWebhook = {
  key: 'updateCompanyWebhook',
  noun: 'Webhook',

  display: {
    label: 'Update Company Webhook',
    description: 'Updates the webhook URL and output format for a company.',
  },

  operation: {
    inputFields: [
      { key: 'company_id', required: true, type: 'integer', label: 'Company ID' },
      { key: 'web_hook_url', required: true, type: 'string', label: 'Webhook URL' },
      {
        key: 'webhook_output_format',
        required: false,
        type: 'string',
        choices: { json: 'JSON', csv: 'CSV' },
        default: 'json',
        label: 'Output Format'
      },
    ],

    perform: async (z, bundle) => {
      const { company_id, web_hook_url, webhook_output_format } = bundle.inputData;

      const url = `https://api.koncile.ai/company/${company_id}/web-hook/`;
      const params = new URLSearchParams();

      if (web_hook_url) params.append('web_hook_url', web_hook_url);
      if (webhook_output_format) params.append('webhook_output_format', webhook_output_format);

      const response = await z.request({
        method: 'PUT',
        url: `${url}?${params.toString()}`,
        headers: {
          Authorization: `Bearer ${bundle.authData.api_key}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 400) {
        throw new z.errors.HaltedError(`Request failed: ${response.statusText}`);
      }

      return response.json;
    },
  },
};

module.exports = updateCompanyWebhook;
