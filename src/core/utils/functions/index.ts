import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { OPCAO_TODOS } from '~/constantes';

const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

const removerNumeros = (value: any) => `${value}`.replace(/\d+/g, '');

const maskTelefone = (value: string | number | undefined) => {
  const newValue = removerTudoQueNaoEhDigito(value);
  if (newValue) {
    return `${newValue}`.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');
  }
  return newValue;
};

const maskCEP = (value: string | number | undefined) =>
  `${value}`.replace(/^(\d{5})(\d{3})+?$/, '$1-$2');

const formatarDataHora = (data: string | undefined) => dayjs(data).format('DD/MM/YYYY HH:mm');

const formatarData = (data: string | undefined) => (data ? dayjs(data).format('DD/MM/YYYY') : '');

const onChangeMultiSelectLabelInValueOpcaoTodos = (valores: any[], valorAtual: any[]) => {
  let valorParaSetar = valores;
  const valorAtualTemOpcaoTodos = valorAtual?.find((item) => item?.value === OPCAO_TODOS);
  const valoresTemOpcaoTodos = valores?.find((item) => item?.value === OPCAO_TODOS);

  if (valorAtualTemOpcaoTodos) {
    const listaSemOpcaoTodos = cloneDeep(valores).filter((item) => item?.value !== OPCAO_TODOS);

    valorParaSetar = listaSemOpcaoTodos;
  }
  if (!valorAtualTemOpcaoTodos && valoresTemOpcaoTodos) {
    valorParaSetar = [valoresTemOpcaoTodos];
  }

  return valorParaSetar;
};

export {
  maskTelefone,
  removerTudoQueNaoEhDigito,
  maskCEP,
  formatarDataHora,
  formatarData,
  removerNumeros,
  onChangeMultiSelectLabelInValueOpcaoTodos,
};
