import { TipoMarcadorFrequenciaEnum } from '../enum/TipoMarcadorFrequenciaEnum';

export interface MarcadorFrequenciaDto {
  tipo: TipoMarcadorFrequenciaEnum;
  nome: string;
  descricao: string;
}
