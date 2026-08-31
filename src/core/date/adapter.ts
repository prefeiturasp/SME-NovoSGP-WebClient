import { Dayjs, dayjs } from './dayjs';

type DateLike = { toDate: () => Date };
type DateInput = string | number | Date | Dayjs | DateLike | null | undefined;

const parse = (value?: DateInput, format?: string) => {
  if (dayjs.isDayjs(value)) {
    return value;
  }

  if (value && typeof (value as DateLike).toDate === 'function') {
    return dayjs((value as DateLike).toDate());
  }

  if (format) {
    return dayjs(value as string, format);
  }

  return dayjs(value as string | number | Date);
};

const now = () => dayjs();

const utc = (value?: DateInput) => {
  if (typeof value === 'undefined') {
    return dayjs.utc();
  }

  if (value && typeof (value as DateLike).toDate === 'function') {
    return dayjs.utc((value as DateLike).toDate());
  }

  return dayjs.utc(value as string | number | Date | Dayjs);
};

const format = (value: DateInput, outputFormat: string) => parse(value).format(outputFormat);

export const dateAdapter = {
  dayjs,
  now,
  parse,
  utc,
  format,
};

export type { Dayjs, DateInput };
