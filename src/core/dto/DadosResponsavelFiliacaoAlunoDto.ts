import { EnderecoRespostaDto } from './EnderecoRespostaDto';
import { TelefonesDto } from './TelefonesDto';

export type DadosResponsavelFiliacaoAlunoDto = {
  codigoAluno?: string;
  nomeFiliacao1?: string;
  telefonesFiliacao1?: TelefonesDto[];
  nomeFiliacao2?: string;
  telefonesFiliacao2?: TelefonesDto[];
  endereco?: EnderecoRespostaDto;
};
