import { AlterarParecerConclusivoDto } from '../dto/AlterarParecerConclusivoDto';
import { ParecerConclusivoDto } from '../dto/ParecerConclusivoDto';
import { alterarRegistro, obterRegistro } from './api';

const URL_DEFAULT = '/v1/conselhos-classe';

const obterPareceresConclusivosTurma = (turmaId: number) =>
  obterRegistro<ParecerConclusivoDto[]>(`${URL_DEFAULT}/turma/${turmaId}/pareceres-conclusivos`);

const alterarParecerConclusivo = (params: AlterarParecerConclusivoDto) =>
  alterarRegistro<ParecerConclusivoDto>(`${URL_DEFAULT}/parecer-conclusivo`, params);

export default {
  obterPareceresConclusivosTurma,
  alterarParecerConclusivo,
};
