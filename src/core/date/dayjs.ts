import dayjs, { Dayjs } from 'dayjs';
import localeDayjs from 'dayjs/locale/pt-br';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault('America/sao_paulo');
dayjs.locale(localeDayjs);

export { dayjs, Dayjs };
