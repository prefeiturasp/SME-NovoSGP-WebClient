import { dateAdapter } from '@/core/date/adapter';

const momentCompat = (...args) => dateAdapter.parse(args[0], args[1]);

Object.assign(momentCompat, dateAdapter.dayjs, {
  utc: (...args) => dateAdapter.utc(args[0]),
  isMoment: (valor) => dateAdapter.dayjs.isDayjs(valor),
});

window.moment = momentCompat as any;

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.toISOString = function () {
  return dateAdapter.format(this, 'YYYY-MM-DDTHH:mm:ss');
};
