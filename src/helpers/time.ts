export const DEFAULT_TIMEZONE = 'America/New_York';
export const DEFAULT_TIMEZONE_OFFSET = -5;
export const MS_PER_HOUR = 3600000;

export const parseTime = (time: string) => {
  checkFormat(time);

  const intervals = time.split(':');
  const hours = intervals[0];
  const minutes = intervals[1]?.substring(0, 2);
  if (!isValidInterval(hours) || !isValidInterval(minutes)) {
    throw Error('Please enter a valid time.');
  }

  let parsedHours = parseInt(hours!);
  const parsedMinutes = parseInt(minutes!);

  // Get am/pm indicator
  if (time.length > 5) {
    parsedHours = getAmPmAdjustment(time, parsedHours);
  }

  const parsedDate = new Date();
  parsedDate.setHours(parsedHours + 5);
  parsedDate.setMinutes(parsedMinutes);
  parsedDate.setSeconds(0);
  parsedDate.setDate(parsedDate.getDate() - 1);

  return parsedDate;
};

const checkFormat = (time: string) => {
  if (time.length < 4 || time.length > 7 || !time.includes(':')) {
    throw Error('Please use the following format: 22:00 or 8:00.');
  }
};

const isValidInterval = (interval: string | undefined): boolean => {
  if (interval == null) return false;
  return interval.length == 1 || interval.length == 2;
};

export const getFormattedTime = (date: Date) => {
  return Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: DEFAULT_TIMEZONE
  }).format(date);
};

export const getZoneAdjustedTime = (millis: number, timeZoneOffset: number) => {
  const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let adjustment = 0;
  if (currentTz != DEFAULT_TIMEZONE) {
    adjustment = timeZoneOffset * MS_PER_HOUR;
  }
  return new Date(millis + adjustment);
};

// Convert to military time
const getAmPmAdjustment = (time: string, parsedHours: number): number => {
  const amPmIndicator = time.slice(-2).toLowerCase();

  if (amPmIndicator != 'am' && amPmIndicator != 'pm') {
    throw Error('Please enter a valid AM/PM indicator.');
  }

  if (amPmIndicator === 'pm') {
    if (parsedHours != 12) return parsedHours + 12;
  }

  if (amPmIndicator === 'am') {
    if (parsedHours == 12) return 0;
  }

  return parsedHours;
};
