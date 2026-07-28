import { Dayjs, dayjs } from './dayjs';

type DateInput = string | number | Date | Dayjs | null | undefined;

const parse = (value?: DateInput, format?: string) => {
  if (format) {
    return dayjs(value as string, format);
  }

  return dayjs(value);
};

const now = () => dayjs();

const utc = (value?: DateInput) => {
  if (typeof value === 'undefined') {
    return dayjs.utc();
  }

  return dayjs.utc(value);
};

const format = (value: DateInput, outputFormat: string) => dayjs(value).format(outputFormat);

export const dateAdapter = {
  dayjs,
  now,
  parse,
  utc,
  format,
};

export type { Dayjs, DateInput };
