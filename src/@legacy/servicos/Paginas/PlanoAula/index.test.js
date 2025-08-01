import PlanoAulaServico from './index';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  post: jest.fn(),
}));

describe('PlanoAulaServico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verificarSeExiste', () => {
    it('deve chamar api.post com a URL e os parâmetros corretos', async () => {
      const parametros = { componenteCurricularId: 1, aula: 2 };
      const respostaEsperada = { data: true };
      api.post.mockResolvedValue(respostaEsperada);

      const resultado = await PlanoAulaServico.verificarSeExiste(parametros);

      expect(api.post).toHaveBeenCalledWith('/v1/planos/aulas/validar-existente/', parametros);
      expect(resultado).toEqual(respostaEsperada);
    });
  });

  describe('migrarPlano', () => {
    it('deve chamar api.post com a URL e os dados corretos', async () => {
      const dados = { planoId: 10, turmaId: 20 };
      const respostaEsperada = { data: { sucesso: true } };
      api.post.mockResolvedValue(respostaEsperada);

      const resultado = await PlanoAulaServico.migrarPlano(dados);

      expect(api.post).toHaveBeenCalledWith('/v1/planos/aulas/migrar', dados);
      expect(resultado).toEqual(respostaEsperada);
    });
  });
});
