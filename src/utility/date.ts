import { format, parseISO, parse } from 'date-fns';

const DATE_STRING_FORMAT_SHORT    = 'dd MMM yyyy';
const DATE_STRING_FORMAT_MEDIUM   = 'dd MMM yy h:mma';
const DATE_STRING_FORMAT          = 'dd MMM yyyy h:mma';
const DATE_STRING_FORMAT_POSTGRES = 'yyyy-MM-dd HH:mm:ss';

type AmbiguousTimestamp = number | string;

type Length = 'short' | 'medium' | 'long';

export const formatDate = (date: Date, length: Length = 'long') => {
  switch (length) {
  case 'short':
    return format(date, DATE_STRING_FORMAT_SHORT);
  case 'medium':
    return format(date, DATE_STRING_FORMAT_MEDIUM);
  default:
    return format(date, DATE_STRING_FORMAT);
  }
};

export const formatDateFromPostgresString = (date: string, length?: Length) =>
  formatDate(parse(date, DATE_STRING_FORMAT_POSTGRES, new Date()), length);

export const formatDateForPostgres = (date: Date) =>
  date.toISOString().replace(
    /(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})/,
    '$1-$2-$3 $4',
  );

const dateFromTimestamp = (timestamp?: AmbiguousTimestamp): Date => {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp * 1000)
    : typeof timestamp === 'string'
      ? /.+Z/i.test(timestamp)
        ? new Date(timestamp)
        : new Date(`${timestamp}Z`)
      : undefined;
  return date && !isNaN(date.getTime()) ? date : new Date();
};

const createNaiveDateWithOffset = (
  timestamp?: AmbiguousTimestamp,
  offset = '+00:00',
) => {
  const date = dateFromTimestamp(timestamp);
  const dateString = `${date.toISOString()}`.replace(/\.[\d]+Z/, offset);
  return parseISO(dateString);
};

// Run on the server, when there are date/timestamp/offset inputs

export const convertTimestampWithOffsetToPostgresString = (
  timestamp?: AmbiguousTimestamp,
  offset?: string,
) =>
  formatDateForPostgres(createNaiveDateWithOffset(timestamp, offset));

export const convertTimestampToNaivePostgresString = (
  timestamp?: AmbiguousTimestamp,
) =>
  dateFromTimestamp(timestamp)
    .toISOString().replace(
      /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(.[\d]+Z)*/,
      '$1 $2',
    );

// Run in browser to generate local date time strings

export const generateLocalPostgresString = () =>
  formatDateForPostgres(new Date());

export const generateLocalNaivePostgresString = () =>
  format(new Date(), DATE_STRING_FORMAT_POSTGRES);
