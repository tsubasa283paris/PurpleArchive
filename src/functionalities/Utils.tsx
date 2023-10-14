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

export const dateToISOStringWithTZ = (date: Date): string => {
  // assume that the given Date is in UTC.
  const pad = function (str: string): string {
    return ('0' + str).slice(-2);
  };
  const year = date.getFullYear().toString();
  const month = pad((date.getMonth() + 1).toString());
  const day = pad(date.getDate().toString());
  const hour = pad(date.getHours().toString());
  const min = pad(date.getMinutes().toString());
  const sec = pad(date.getSeconds().toString());
  const tz = -date.getTimezoneOffset();
  const sign = tz >= 0 ? '+' : '-';
  const tzHour = pad((tz / 60).toString());
  const tzMin = pad((tz % 60).toString());
  return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHour}:${tzMin}`;
};

export const dateToGpName = (date: Date): string => {
  // album_2023-10-08_00-35-34.gif
  return 'album_' + formatDate(date, 'yyyy-MM-dd_hh-mm-ss') + '.gif';
};

export const gpNameToDate = (fileName: string): Date | null => {
  // album_2023-10-08_00-35-34.gif
  let work = '';
  if (fileName.length !== 29) {
    return null;
  }
  work = fileName.split('.')[0];
  if (work.split('_').length !== 3) {
    return null;
  }
  const date = work.split('_')[1];
  const [yearS, monthS, dayS] = date.split('-');
  const [year, month, day] = [Number(yearS), Number(monthS), Number(dayS)];
  const time = work.split('_')[2];
  const [hourS, minuteS, secondS] = time.split('-');
  const [hour, minute, second] = [
    Number(hourS),
    Number(minuteS),
    Number(secondS),
  ];
  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hour) ||
    isNaN(minute) ||
    isNaN(second)
  ) {
    return null;
  }
  return new Date(year, month - 1, day, hour, minute, second);
};

export const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string>((resolve) => {
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        resolve('');
      } else {
        resolve(reader.result.split(',')[1]);
      }
    };
  });
};
