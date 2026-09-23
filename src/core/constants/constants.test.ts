import {
  ANO_INICIO_REGISTRO_COLETIVO_NAAPA,
  ANO_INICIO_MAPEAMENTO_ESTUDANTES,
  ANO_INICIO_BUSCA_ATIVA,
  ANO_INICIO_PRODUTIVIDADE,
} from './contants';
import { NegocioException } from './negocio-exception';
import { validateMessages } from './validate-messages';
import { URL_API_CONSELHOS_CLASSE, URL_API_RELATORIOS } from './urls-api';
import { LISTA_UF } from './lista-uf';
import { Colors, BoxShadow } from '../styles/colors';
import { SONDAGEM_BYPASS_FILA } from '../config/feature-flags';

describe('constantes do core', () => {
  it('anos de início e código de negócio', () => {
    expect(ANO_INICIO_REGISTRO_COLETIVO_NAAPA).toBe(2024);
    expect(ANO_INICIO_MAPEAMENTO_ESTUDANTES).toBe(2024);
    expect(ANO_INICIO_BUSCA_ATIVA).toBe(2024);
    expect(ANO_INICIO_PRODUTIVIDADE).toBe(2023);
    expect(NegocioException).toBe(601);
  });

  it('mensagens de validação e URLs de API', () => {
    expect(validateMessages.required).toBe('Campo obrigatório');
    expect(URL_API_CONSELHOS_CLASSE).toBe('v1/conselhos-classe');
    expect(URL_API_RELATORIOS).toBe('v1/relatorios');
  });

  it('lista UF, cores e feature flag', () => {
    expect(LISTA_UF.find(item => item.value === 'SP')).toEqual({
      value: 'SP',
      label: 'SP',
    });
    expect(Colors.ERROR).toBe('#B40C02');
    expect(BoxShadow.DEFAULT).toContain('rgba');
    expect(SONDAGEM_BYPASS_FILA).toBe(true);
  });
});
