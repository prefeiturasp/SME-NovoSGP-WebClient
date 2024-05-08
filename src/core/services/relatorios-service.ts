import { URL_API_RELATORIOS } from '../constants/urls-api';
import { FiltroRelatorioMapeamentoEstudantesDto } from '../dto/FiltroRelatorioMapeamentoEstudantesDto';
import { inserirRegistro } from './api';

const mapeamentoEstudante = (params: FiltroRelatorioMapeamentoEstudantesDto) =>
  inserirRegistro<boolean>(`${URL_API_RELATORIOS}/mapeamento-estudante`, params);

export default {
  mapeamentoEstudante,
};
