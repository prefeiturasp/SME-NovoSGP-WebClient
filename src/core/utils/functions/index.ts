import dayjs from 'dayjs';

const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

const removerNumeros = (value: any) => `${value}`.replace(/\d+/g, '');

const maskTelefone = (value: string | number | undefined) =>
  `${value}`.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');

const maskCEP = (value: string | number | undefined) =>
  `${value}`.replace(/^(\d{5})(\d{3})+?$/, '$1-$2');

const formatarDataHora = (data: string | undefined) => dayjs(data).format('DD/MM/YYYY HH:mm');
const formatarData = (data: string | undefined) => dayjs(data).format('DD/MM/YYYY');

export {
  maskTelefone,
  removerTudoQueNaoEhDigito,
  maskCEP,
  formatarDataHora,
  formatarData,
  removerNumeros,
};
