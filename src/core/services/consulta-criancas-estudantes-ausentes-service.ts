import { AlunosAusentesDto } from '../dto/AlunosAusentesDto';
import { EnumeradoRetornoDto } from '../dto/EnumeradoRetornoDto';
import { FiltroObterAlunosAusentesDto } from '../dto/FiltroObterAlunosAusentesDto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/busca-ativa/criancas-estudantes/ausentes';

const obterTurmasAlunosAusentes = (params: FiltroObterAlunosAusentesDto) =>
  obterRegistro<AlunosAusentesDto[]>(`${URL_DEFAULT}/turma/alunos`, {
    params,
  });

const obterAusencias = () => obterRegistro<EnumeradoRetornoDto[]>(`${URL_DEFAULT}/ausencias`);

export default {
  obterTurmasAlunosAusentes,
  obterAusencias,
};
