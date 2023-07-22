export function getFileBasename(path: string): string {
  let fileName = path.split('/').pop();
  if (fileName === undefined) {
    return '';
  }
  let fileBaseName = fileName.split('.').shift();
  if (fileBaseName === undefined) {
    return '';
  }
  return fileBaseName;
}
