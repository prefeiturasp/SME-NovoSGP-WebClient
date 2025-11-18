import { GraficoBaseDto } from './GraficoBaseDto';

export type GraficoBuscaAtivaDto = {
  dataUltimaConsolidacao?: string;
  graficos: GraficoBaseDto[];
};
