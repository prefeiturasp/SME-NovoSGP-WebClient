import { DefaultOptionType } from 'antd/es/select';
import { ArquivoAnexoRegistroColetivoDto } from './ArquivoAnexoRegistroColetivoDto';
import { AuditoriaDto } from './AuditoriaDto';
import { UeRegistroColetivoDto } from './UeRegistroColetivoDto';
import { Dayjs } from '../date/dayjs';
import { AnexoFormDto } from './AnexoFormDto';

export type RegistroColetivoCompletoDto = {
  id: number;
  codigoDre: string;
  nomeDre: string;
  tipoReuniaoId: number;
  tipoReuniaoDescricao: string;
  dataRegistro: string;
  quantidadeParticipantes: number;
  quantidadeEducadores: number;
  quantidadeEducandos: number;
  quantidadeCuidadores: number;
  descricao: string;
  observacao: string;
  ues: UeRegistroColetivoDto[];
  anexos: ArquivoAnexoRegistroColetivoDto[];
} & AuditoriaDto;

export type RegistroColetivoCompletoFormDto = {
  id: number;
  dre: DefaultOptionType;
  ue: DefaultOptionType[];
  tipoReuniaoId: number;
  dataRegistro: Dayjs;
  quantidadeParticipantes: number;
  quantidadeEducadores: number;
  quantidadeEducandos: number;
  quantidadeCuidadores: number;
  descricao: string;
  observacao: string;
  anexos: AnexoFormDto[];
  auditoria: AuditoriaDto;
};
