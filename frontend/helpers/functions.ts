function downloadFileData(fileContents: string, name: null | string = null) {
  const file = new Blob([fileContents], { type: 'application/json' });
  const url = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = url;

  let filename = name;
  if (!filename) {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

    filename = `file-${suffix}.json`;
  }

  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}

export { downloadFileData };