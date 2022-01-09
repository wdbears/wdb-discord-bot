export const parseTime = (time: string) => {
  if (time.length < 4 || time.length > 7 || !time.includes(':')) {
    throw Error('Please enter a valid time.');
  }

  const hours = time.split(':')[0];
  const minutes = time.split(':')[1];

  const parsedDate = new Date();
  parsedDate.setHours(parseInt(hours!));
  parsedDate.setMinutes(parseInt(minutes!));
  parsedDate.setSeconds(0);

  return parsedDate;
};
