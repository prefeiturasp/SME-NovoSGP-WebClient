import { ModalidadeEnum } from '../enum/modalidade-enum';

export interface FiltroRelatorioMapeamentoEstudantesDto {
  anoLetivo: number;
  dreCodigo: string;
  ueCodigo: string;
  modalidade: ModalidadeEnum;
  semestre: number;
  turmasCodigo: string[];
  alunoCodigo: string;
  pareceresConclusivosIdAnoAnterior: number[];
  opcaoRespostaIdDistorcaoIdadeAnoSerie: number;
  opcaoRespostaIdPossuiPlanoAEE: number;
  opcaoRespostaIdAcompanhadoNAAPA: number;
  participaPAP: boolean;
  opcaoRespostaIdProgramaSPIntegral: number;
  opcaoRespostaHipoteseEscrita: string;
  opcaoRespostaAvaliacaoExternaProvaSP: string;
  opcaoRespostaIdFrequencia: number;
}
