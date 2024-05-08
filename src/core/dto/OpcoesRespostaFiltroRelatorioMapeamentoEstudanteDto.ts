import { OpcaoRespostaSimplesDto } from './OpcaoRespostaSimplesDto';

export interface OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto {
  opcoesRespostaDistorcaoIdadeAnoSerie: OpcaoRespostaSimplesDto[];
  opcoesRespostaPossuiPlanoAEE: OpcaoRespostaSimplesDto[];
  opcoesRespostaAcompanhadoNAAPA: OpcaoRespostaSimplesDto[];
  opcoesRespostaProgramaSPIntegral: OpcaoRespostaSimplesDto[];
  opcoesRespostaHipoteseEscritaEstudante: string[];
  opcoesRespostaAvaliacoesExternasProvaSP: string[];
  opcoesRespostaFrequencia: OpcaoRespostaSimplesDto[];
}
