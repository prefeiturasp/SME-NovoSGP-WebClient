import { SituacaoMatriculaAlunoEnum } from '../enum/situacao-matricula-aluno-enum';
import { MarcadorFrequenciaDto } from './MarcadorFrequenciaDto';

export type AlunoDadosBasicosDto = {
  nome: string;
  numeroChamada: string;
  dataNascimento: string;
  codigoEOL: string;
  situacaoCodigo: SituacaoMatriculaAlunoEnum;
  situacao: string;
  dataSituacao: string;
  frequencia: number;
  marcador: MarcadorFrequenciaDto;
  nomeResponsavel: string;
  ehAtendidoAEE: boolean;
  ehMatriculadoTurmaPAP: boolean;
  tipoResponsavel: string;
  celularResponsavel: string;
  dataAtualizacaoContato?: string;
  marcadorDiasSemRegistroExibir: boolean;
  marcadorDiasSemRegistroTexto: boolean;
  dataMatricula: string;
  processoConcluido: boolean;
  desabilitado: boolean;
  exibirIconeCustomizado?: boolean;
};
