import { FiltroGraficoBuscaAtivaDto } from '../dto/FiltroGraficoBuscaAtivaDto';
import { FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto } from '../dto/FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto';
import { FiltroGraficoReflexoFrequenciaBuscaAtivaDto } from '../dto/FiltroGraficoReflexoFrequenciaBuscaAtivaDto';
import { GraficoBuscaAtivaDto } from '../dto/GraficoBuscaAtivaDto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/dashboard/busca-ativa';

const obterQuantidadeBuscaAtivaPorMotivosAusencia = (params: FiltroGraficoBuscaAtivaDto) =>
  obterRegistro<GraficoBuscaAtivaDto>(`${URL_DEFAULT}/motivos-ausencia`, { params });

const obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre = (
  params: FiltroGraficoProcedimentoTrabalhoBuscaAtivaDto,
) => obterRegistro<GraficoBuscaAtivaDto>(`${URL_DEFAULT}/procedimentos-trabalho`, { params });

const obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes = (
  params: FiltroGraficoReflexoFrequenciaBuscaAtivaDto,
) => obterRegistro<GraficoBuscaAtivaDto>(`${URL_DEFAULT}/reflexo-frequencia`, { params });

export default {
  obterQuantidadeBuscaAtivaPorMotivosAusencia,
  obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre,
  obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes,
};
