import { AusenciasEnum } from '../enum/ausencias-enum';

export type FiltroObterAlunosAusentesDto = {
  codigoUe: string;
  anoLetivo: number;
  codigoTurma: string;
  ausencias: AusenciasEnum;
};
