const perform = async (z, bundle) => {
  const folderId = bundle.inputData.folder_id;

  if (!folderId) {
    throw new z.errors.HaltedError('You must select a folder first to see templates.');
  }

  const response = await z.request({
    url: `https://api.koncile.ai/v1/fetch_all_folders/`,
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
  const folder = folders.find(f => f.id.toString() === folderId.toString());

  if (!folder || !folder.templates) {
    return [];
  }

  return folder.templates.map(template => ({
    id: template.id.toString(), // Important: string type
    name: template.name
  }));
};

module.exports = {
  key: 'templateList',
  noun: 'Template',

  list: {
    display: {
      label: 'List Templates by Folder',
      description: 'Lists templates available in a selected folder',
      hidden: true
    },
    operation: {
      inputFields: [
        {
          key: 'folder_id',
          required: true,
          type: 'string',
          helpText: 'The ID of the folder to fetch templates from.'
        }
      ],
      perform
    }
  }
};
