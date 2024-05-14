import { URL_API_RELATORIOS } from '../constants/urls-api';
import { FiltroRelatorioBuscasAtivasDto } from '../dto/FiltroRelatorioBuscasAtivasDto';
import { FiltroRelatorioMapeamentoEstudantesDto } from '../dto/FiltroRelatorioMapeamentoEstudantesDto';
import { inserirRegistro } from './api';

const mapeamentoEstudante = (params: FiltroRelatorioMapeamentoEstudantesDto) =>
  inserirRegistro<boolean>(`${URL_API_RELATORIOS}/mapeamento-estudante`, params);

const buscaAtiva = (params: FiltroRelatorioBuscasAtivasDto) =>
  inserirRegistro<boolean>(`${URL_API_RELATORIOS}/busca-ativa`, params);

export default {
  mapeamentoEstudante,
  buscaAtiva,
};
