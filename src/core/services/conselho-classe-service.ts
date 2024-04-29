import { URL_API_CONSELHOS_CLASSE } from '../constants/urls-api';
import { AlterarParecerConclusivoDto } from '../dto/AlterarParecerConclusivoDto';
import { ParecerConclusivoDto } from '../dto/ParecerConclusivoDto';
import { alterarRegistro, obterRegistro } from './api';

const obterPareceresConclusivosTurma = (turmaId: number, anoLetivoAnterior?: boolean) =>
  obterRegistro<ParecerConclusivoDto[]>(
    `${URL_API_CONSELHOS_CLASSE}/turma/${turmaId}/pareceres-conclusivos`,
    {
      params: { anoLetivoAnterior },
    },
  );

const alterarParecerConclusivo = (params: AlterarParecerConclusivoDto) =>
  alterarRegistro<ParecerConclusivoDto>(`${URL_API_CONSELHOS_CLASSE}/parecer-conclusivo`, params);

export default {
  obterPareceresConclusivosTurma,
  alterarParecerConclusivo,
};
