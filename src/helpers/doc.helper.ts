export const ToDocBlob = (headers: string[], data: string[][]): Blob => {
  const docString = ToDocString(headers, data);
  return new Blob([docString], { type: 'text/csv' });
};

export const ToDocString = (headers: string[], data: string[][]): string => {
  const docString = [headers, ...data]
    .map((e) =>
      e
        .map((incoding) =>
          incoding ? JSON.stringify(incoding).replace(/\\"/g, '""') : incoding,
        )
        .join(','),
    )
    .join('\n');
  return docString;
};

export const FromDocString = (doc: string): string[][] => {
  return doc.split('\n').map((l) => l.replace(/\r/g, '').split(','));
};
