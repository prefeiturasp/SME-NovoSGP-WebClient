import { AnexoDto } from './AnexoDto';

export type RegistroColetivoDto = {
  id?: any;
  dreId: number;
  ueIds: number[];
  tipoReuniaoId: number;
  dataRegistro: string;
  quantidadeParticipantes: number;
  quantidadeEducadores: number;
  quantidadeEducandos: number;
  quantidadeCuidadores: number;
  descricao: string;
  observacao: string;
  anexos: AnexoDto[];
};
