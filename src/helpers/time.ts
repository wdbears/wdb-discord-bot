export const parseTime = (time: string) => {
  if (time.length < 4 || time.length > 7 || !time.includes(':')) {
    throw Error('Please enter a valid time.');
  }

  const hours = time.split(':')[0];
  const minutes = time.split(':')[1];
  if (!isValidInterval(hours) || !isValidInterval(minutes)) {
    throw Error('Please enter a valid time.');
  }

  const parsedDate = new Date();
  parsedDate.setHours(parseInt(hours!));
  parsedDate.setMinutes(parseInt(minutes!));
  parsedDate.setSeconds(0);

  return parsedDate;
};

const isValidInterval = (interval: string | undefined): boolean => {
  if (interval == null) return false;
  return !(interval.length == 0 || interval.length > 2);
};
