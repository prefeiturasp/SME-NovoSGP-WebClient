import { URL_API_CONSELHOS_CLASSE } from '../constants/urls-api';
import { AlterarParecerConclusivoDto } from '../dto/AlterarParecerConclusivoDto';
import { ParecerConclusivoDto } from '../dto/ParecerConclusivoDto';
import { ModalidadeEnum } from '../enum/modalidade-enum';
import { alterarRegistro, obterRegistro } from './api';

const alterarParecerConclusivo = (params: AlterarParecerConclusivoDto) =>
  alterarRegistro<ParecerConclusivoDto>(`${URL_API_CONSELHOS_CLASSE}/parecer-conclusivo`, params);

const obterPareceresConclusivosTurma = (turmaId: number, anoLetivoAnterior?: boolean) =>
  obterRegistro<ParecerConclusivoDto[]>(
    `${URL_API_CONSELHOS_CLASSE}/turma/${turmaId}/pareceres-conclusivos`,
    {
      params: { anoLetivoAnterior },
    },
  );

const obterPareceresConclusivosAnoLetivoModalidade = (
  anoLetivo: number,
  modalidade: ModalidadeEnum,
) =>
  obterRegistro<ParecerConclusivoDto[]>(
    `${URL_API_CONSELHOS_CLASSE}/anos-letivos/${anoLetivo}/modalidades/${modalidade}/pareceres-conclusivos`,
  );

export default {
  alterarParecerConclusivo,
  obterPareceresConclusivosTurma,
  obterPareceresConclusivosAnoLetivoModalidade,
};
