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

export function getApiUrl(path: string): string {
  return process.env.REACT_APP_API_SERVER_HOST + path;
}

export function formatDate(date: Date, format: string): string {
  const symbol = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };

  const formatted = format.replace(/(M+|d+|h+|m+|s+)/g, (v) =>
    (
      (v.length > 1 ? '0' : '') + symbol[v.slice(-1) as keyof typeof symbol]
    ).slice(-2)
  );

  return formatted.replace(/(y+)/g, (v) =>
    date.getFullYear().toString().slice(-v.length)
  );
}

export function formatPlayedAt(playedAt: Date): string {
  return formatDate(playedAt, 'yyyy/MM/dd hh:mm:ss');
}
