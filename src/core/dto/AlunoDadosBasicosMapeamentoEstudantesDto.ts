import { AlunoDadosBasicosDto } from './AlunoDadosBasicosDto';

export type AlunoDadosBasicosMapeamentoEstudantesDto = AlunoDadosBasicosDto & {
  alertaLaranja?: boolean;
  alertaVermelho?: boolean;
};
