import { AbrangenciaDreRetornoDto } from './AbrangenciaDreRetornoDto';
import { AuditoriaDto } from './AuditoriaDto';

export type CadastroAcessoABAEDto = {
  ueCodigo?: string;
  dreCodigo?: string;
  dreId: number;
  ueId: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  situacao: boolean;
  cep: string;
  endereco: string;
  numero: number;
  complemento: string;
  cidade: string;
  estado: string;
} & AuditoriaDto;

export type CadastroAcessoABAEFormDto = {
  dre: AbrangenciaDreRetornoDto & { label?: string; value?: string };
  ue: any; // TODO
} & CadastroAcessoABAEDto;
