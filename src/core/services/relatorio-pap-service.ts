import { URL_API_RELATORIO_PAP } from '../constants/urls-api';
import { CopiarPapDto } from '../dto/CopiarSecaoDto';
import { TurmasPapDto } from '../dto/TurmasPapDto';
import { inserirRegistro, obterRegistro } from './api';

const obterTurmasPapPorAnoLetivo = (anoLetivo: number, codigoUe: string) =>
  obterRegistro<TurmasPapDto[]>(`${URL_API_RELATORIO_PAP}/turmas-pap/${anoLetivo}/ues/${codigoUe}`);

const copiar = (params: CopiarPapDto) =>
  inserirRegistro<boolean>(`${URL_API_RELATORIO_PAP}/copiar`, params);

export default {
  copiar,
  obterTurmasPapPorAnoLetivo,
};
