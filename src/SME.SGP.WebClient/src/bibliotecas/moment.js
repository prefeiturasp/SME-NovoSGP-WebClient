import moment from 'moment';

moment.locale('pt-br');
window.moment = moment;

// eslint-disable-next-line no-extend-native, func-names
Date.prototype.toISOString = function() {
  return moment(this).format('YYYY-MM-DDTHH:mm:ss');
};
