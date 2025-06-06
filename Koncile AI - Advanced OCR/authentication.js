const options = {
  url: 'https://api.koncile.ai/v1/check_api_key/',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${bundle.authData.api_key}`
  },
  params: {

  },
  body: {

  },
  removeMissingValuesFrom: {
    'body': false,
    'params': false
  },
}

return z.request(options)
  .then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });