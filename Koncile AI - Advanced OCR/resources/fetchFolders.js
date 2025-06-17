const perform = async (z, bundle) => {
  const response = await z.request({
    url: 'http://test-api.koncile.ai:8000/v1/fetch_all_folders/',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`
    }
  });

  if (response.status >= 300) {
    throw new z.errors.Error(
      'Unable to fetch folders',
      'FetchFoldersError',
      response.status
    );
  }

  const folders = response.json.folders;

  return folders.map(folder => ({
    id: folder.id.toString(),
    name: folder.name
  }));
};

module.exports = {
  key: 'folderList',
  noun: 'Folder',

  list: {
    display: {
      label: 'List Koncile Folders',
      description: 'Lists all folders in Koncile'
    },
    operation: { perform }
  }
};
