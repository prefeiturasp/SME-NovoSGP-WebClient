import { SituacaoMatriculaAlunoEnum } from '../enum/situacao-matricula-aluno-enum';

export type AlunoTurmaReduzidoDto = {
  codigoAluno: string;
  nome: string;
  numeroAlunoChamada?: number;
  dataNascimento?: string;
  dataSituacao?: string;
  codigoSituacaoMatricula?: SituacaoMatriculaAlunoEnum;
  situacao?: string;
  turmaEscola?: string;
  codigoTurma?: string;
  nomeResponsavel?: string;
  tipoResponsavel?: string;
  celularResponsavel?: string;
  dataAtualizacaoContato?: string;
  ehAtendidoAEE?: boolean;
  ehMatriculadoTurmaPAP?: boolean;
  frequencia?: string;
};
