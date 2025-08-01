import RegitroPOAServico from './index';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('RegitroPOAServico', () => {
  const mockRegistro = { campo: 'valor' };
  const mockId = 123;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('salvarRegistroPOA', () => {
    it('deve usar POST quando id não for informado', () => {
      RegitroPOAServico.salvarRegistroPOA(mockRegistro);
      expect(api.post).toHaveBeenCalledWith('/v1/atribuicao/poa/', mockRegistro);
    });

    it('deve usar PUT quando id for informado', () => {
      RegitroPOAServico.salvarRegistroPOA(mockRegistro, mockId);
      expect(api.put).toHaveBeenCalledWith(`/v1/atribuicao/poa/${mockId}`, mockRegistro);
    });
  });

  describe('buscarRegistroPOA', () => {
    it('deve chamar api.get com o id correto', () => {
      RegitroPOAServico.buscarRegistroPOA(mockId);
      expect(api.get).toHaveBeenCalledWith(`/v1/atribuicao/poa/${mockId}`);
    });
  });

  describe('deletarRegistroPOA', () => {
    it('deve chamar api.delete com o id correto', () => {
      RegitroPOAServico.deletarRegistroPOA(mockId);
      expect(api.delete).toHaveBeenCalledWith(`/v1/atribuicao/poa/${mockId}`);
    });
  });
});
