import { URL_HOME, URL_LOGIN, URL_RECUPERARSENHA } from './url';
import {
  OPCAO_TODOS,
  BIMESTRE_FINAL,
  ANO_INICIO_INFANTIL,
} from './constantes';
import { TOKEN_EXPIRADO, CANCELADO_USUARIO } from './tokenExpirado';
import ListaLocalOcorrencia from './localOcorrencia';
import RotasTipo from './rotasTipo';

describe('constantes', () => {
  it('exporta URLs principais', () => {
    expect(URL_HOME).toBe('/');
    expect(URL_LOGIN).toBe('/login');
    expect(URL_RECUPERARSENHA).toBe('/recuperar-senha');
  });

  it('exporta constantes de filtro', () => {
    expect(OPCAO_TODOS).toBe('-99');
    expect(BIMESTRE_FINAL).toBe('0');
    expect(ANO_INICIO_INFANTIL).toBe(2021);
  });

  it('exporta tokens de erro', () => {
    expect(TOKEN_EXPIRADO).toBe('tokenExpirado');
    expect(CANCELADO_USUARIO).toBe('Cancelado pelo usuário');
  });

  it('exporta local de ocorrência e tipo de rota', () => {
    expect(ListaLocalOcorrencia.UE).toBe(1);
    expect(ListaLocalOcorrencia.TODOS).toBe(5);
    expect(RotasTipo.EstruturadaAutenticada).toBe(1);
  });
});
