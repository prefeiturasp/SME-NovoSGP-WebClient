import { OrdemProcedimentoRealizadoEnum } from '../enum/ordem-procedimento-realizado-enum';
import { FiltroGraficoBuscaAtivaDto } from './FiltroGraficoBuscaAtivaDto';

export type FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto = {
  tipoProcedimentoTrabalho: OrdemProcedimentoRealizadoEnum;
} & FiltroGraficoBuscaAtivaDto;
