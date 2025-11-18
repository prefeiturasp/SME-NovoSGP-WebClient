import { URL_API_PROFESSORES } from '../constants/urls-api';
import { ProfessorResumoDto } from '../dto/ProfessorResumoDto';
import { obterRegistro } from './api';

const obterResumoPorRFUeDreAnoLetivo = (
  codigoRF: string,
  anoLetivo: number,
  dreId?: number,
  ueId?: number,
  buscarOutrosCargos?: boolean,
  buscarPorTodasDre?: boolean,
) =>
  obterRegistro<ProfessorResumoDto>(`${URL_API_PROFESSORES}/${codigoRF}/resumo/${anoLetivo}`, {
    params: {
      dreId,
      ueId,
      buscarOutrosCargos,
      buscarPorTodasDre,
    },
  });

const obterProfessorAutoComplete = (
  anoLetivo: number,
  dreId: number,
  ueId?: number,
  nomeProfessor?: string,
) =>
  obterRegistro<ProfessorResumoDto[]>(`${URL_API_PROFESSORES}/${anoLetivo}/autocomplete/${dreId}`, {
    params: {
      ueId,
      nomeProfessor,
    },
  });

export default {
  obterProfessorAutoComplete,
  obterResumoPorRFUeDreAnoLetivo,
};
