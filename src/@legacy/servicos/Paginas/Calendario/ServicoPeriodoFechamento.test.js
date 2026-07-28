import ServicoPeriodoFechamento from './ServicoPeriodoFechamento';
import api from '~/servicos/api';
import moment from 'moment';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoPeriodoFechamento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterPorTipoCalendario', () => {
    it('deve chamar o endpoint com o tipoCalendarioSelecionado', async () => {
      api.get.mockResolvedValue({ data: ['fechamento1'] });

      const resposta = await ServicoPeriodoFechamento.obterPorTipoCalendario(5);

      expect(api.get).toHaveBeenCalledWith('/v1/periodos/fechamentos/aberturas?tipoCalendarioId=5&aplicacao=1');
      expect(resposta.data).toEqual(['fechamento1']);
    });
  });

  describe('salvar', () => {
    it('deve chamar api.post com o fechamento passado', async () => {
      const fechamento = { id: 1, nome: 'Fechamento X' };
      api.post.mockResolvedValue({ data: { sucesso: true } });

      const resposta = await ServicoPeriodoFechamento.salvar(fechamento);

      expect(api.post).toHaveBeenCalledWith('/v1/periodos/fechamentos/aberturas', {
        ...fechamento,
        aplicacao: 1,
      });
      expect(resposta.data).toEqual({ sucesso: true });
    });
  });

  describe('verificarSePodeAlterarNoPeriodo', () => {
    it('deve chamar o endpoint sem dataReferencia', async () => {
      api.get.mockResolvedValue({ data: { aberto: true } });

      const resposta = await ServicoPeriodoFechamento.verificarSePodeAlterarNoPeriodo(10, 2);

      expect(api.get).toHaveBeenCalledWith('/v1/periodo-escolar/bimestres/2/turmas/10/aberto');
      expect(resposta.data).toEqual({ aberto: true });
    });

    it('deve chamar o endpoint com dataReferencia formatada', async () => {
      const dataReferencia = '2025-07-29T10:00:00Z';
      const dataFormatada = moment(dataReferencia).format('YYYY-MM-DD');
      api.get.mockResolvedValue({ data: { aberto: false } });

      const resposta = await ServicoPeriodoFechamento.verificarSePodeAlterarNoPeriodo(20, 1, dataReferencia);

      expect(api.get).toHaveBeenCalledWith(
        `/v1/periodo-escolar/bimestres/1/turmas/20/aberto?dataReferencia=${dataFormatada}`
      );
      expect(resposta.data).toEqual({ aberto: false });
    });
  });
});
