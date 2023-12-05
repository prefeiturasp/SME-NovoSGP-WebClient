import { SituacaoMatriculaAlunoEnum } from '../enum/situacao-matricula-aluno-enum';
import { DadosResponsavelFiliacaoAlunoDto } from './DadosResponsavelFiliacaoAlunoDto';

export type AlunoReduzidoDto = {
  codigoAluno: string;
  nome: string;
  numeroAlunoChamada: number;
  dataNascimento: string;
  dataSituacao: string;
  codigoSituacaoMatricula: SituacaoMatriculaAlunoEnum;
  situacao: string;
  turmaEscola: string;
  codigoTurma: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  cpfResponsavel: string;
  tipoResponsavel: string;
  celularResponsavel: string;
  dataAtualizacaoContato?: string;
  ehAtendidoAEE: boolean;
  ehMatriculadoTurmaPAP: boolean;
  dadosResponsavelFiliacao: DadosResponsavelFiliacaoAlunoDto;
  frequencia?: string;
};
