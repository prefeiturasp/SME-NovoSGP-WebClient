import { EntidadeBase } from './EntidadeBase';

export interface Arquivo extends EntidadeBase {
  nome: string;
  codigo: string;
  tipoConteudo: string;
  tipo: any; // TODO enum TipoArquivo
}
