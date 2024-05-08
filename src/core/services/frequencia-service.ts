import { URL_API_FREQUENCIA } from '../constants/urls-api';
import { obterRegistro } from './api';

const obterFrequenciaGeralAluno = (alunoCodigo: string, turmaCodigo: string) =>
  obterRegistro<number>(
    `${URL_API_FREQUENCIA}/frequencias/alunos/${alunoCodigo}/turmas/${turmaCodigo}/geral`,
  );

export default {
  obterFrequenciaGeralAluno,
};
