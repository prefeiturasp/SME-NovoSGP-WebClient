import { TipoRelatorioProdutividadeFrequenciaEnum } from '../enum/tipo-relatorio-produtividade-frequencia-enum';

export interface FiltroRelatorioProdutividadeFrequenciaDto {
  anoLetivo: number;
  codigoDre: string;
  codigoUe: string;
  bimestre: number;
  rfProfessor: string;
  tipoRelatorioProdutividade: TipoRelatorioProdutividadeFrequenciaEnum;
}
