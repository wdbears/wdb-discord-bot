export const DEFAULT_TIMEZONE = 'America/New_York';
export const DEFAULT_TIMEZONE_OFFSET = -5;

export const parseTime = (time: string) => {
  if (time.length < 4 || time.length > 7 || !time.includes(':')) {
    throw Error('Please use the following format: 10:25pm or 22:25');
  }

  const hours = time.split(':')[0];
  const minutes = time.split(':')[1];
  if (!isValidInterval(hours) || !isValidInterval(minutes?.substring(0, 2))) {
    throw Error('Please enter a valid time.');
  }

  let parsedHours = parseInt(hours!);
  const parsedMinutes = parseInt(minutes!);

  // Get am/pm indicator
  if (time.length > 5) {
    parsedHours += getAmPmAdjustment(time, parsedHours);
  }

  // Factor in timezone
  const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (currentTz != DEFAULT_TIMEZONE) {
    // Change from UTC to EST
    parsedHours += DEFAULT_TIMEZONE_OFFSET;
  }

  const parsedDate = new Date();
  parsedDate.setHours(parsedHours);
  parsedDate.setMinutes(parsedMinutes);
  parsedDate.setSeconds(0);

  return parsedDate;
};

const isValidInterval = (interval: string | undefined): boolean => {
  if (interval == null) return false;
  return !(interval.length == 0 || interval.length > 2);
};

const getAmPmAdjustment = (time: string, parsedHours: number): number => {
  const amPmIndicator = time.slice(-2);

  if (amPmIndicator.toLowerCase() === 'pm') {
    // Convert to military time
    if (parsedHours != 12) return 12;
  }

  if (amPmIndicator.toLowerCase() === 'am') {
    if (parsedHours == 12) return 0;
  }

  throw Error('Please enter a valid AM/PM indicator.');
};
