import ServicoMuralGoogleSalaAula from './ServicoMuralGoogleSalaAula';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

describe('ServicoMuralGoogleSalaAula', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterDadosMuralGoogleSalaAula', () => {
    it('deve chamar api.get com o aulaId correto', async () => {
      const aulaId = 123;
      const respostaEsperada = { data: [{ mensagem: 'Teste' }] };
      api.get.mockResolvedValue(respostaEsperada);

      const resultado = await ServicoMuralGoogleSalaAula.obterDadosMuralGoogleSalaAula(aulaId);

      expect(api.get).toHaveBeenCalledWith('/v1/mural/avisos?aulaId=123');
      expect(resultado).toEqual(respostaEsperada);
    });
  });

  describe('editarMensagem', () => {
    it('deve chamar api.put com avisoId e mensagem corretos', async () => {
      const avisoId = 10;
      const mensagem = 'Mensagem atualizada';
      const respostaEsperada = { data: {} };
      api.put.mockResolvedValue(respostaEsperada);

      const resultado = await ServicoMuralGoogleSalaAula.editarMensagem(avisoId, mensagem);

      expect(api.put).toHaveBeenCalledWith('/v1/mural/10', { mensagem });
      expect(resultado).toEqual(respostaEsperada);
    });
  });

  describe('obterDadosAtividadesGoogleSalaAula', () => {
    it('deve chamar api.get com o aulaId correto para atividades', async () => {
      const aulaId = 456;
      const respostaEsperada = { data: [{ atividade: 'Brincadeira' }] };
      api.get.mockResolvedValue(respostaEsperada);

      const resultado = await ServicoMuralGoogleSalaAula.obterDadosAtividadesGoogleSalaAula(aulaId);

      expect(api.get).toHaveBeenCalledWith('/v1/mural/atividades/infantil?aulaId=456');
      expect(resultado).toEqual(respostaEsperada);
    });
  });
});
