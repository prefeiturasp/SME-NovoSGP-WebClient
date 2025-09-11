import api from '~/servicos/api';
import { TIPO_CLASSIFICACAO } from '~/constantes';
import ServicoDocumentosPlanosTrabalho from './ServicoDocumentosPlanosTrabalho';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoDocumentosPlanosTrabalho', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter os tipos de documentos', () => {
    ServicoDocumentosPlanosTrabalho.obterTiposDeDocumentos();
    expect(api.get).toHaveBeenCalledWith('v1/armazenamento/documentos/tipos');
  });

  it('deve salvar novo documento com POST', () => {
    const params = { arquivosCodigos: [1, 2] };
    ServicoDocumentosPlanosTrabalho.salvarDocumento(params);
    expect(api.post).toHaveBeenCalledWith('v1/armazenamento/documentos', params);
  });

  it('deve atualizar documento existente com PUT', () => {
    const params = { arquivosCodigos: [1, 2] };
    const documentoId = 99;
    ServicoDocumentosPlanosTrabalho.salvarDocumento(params, documentoId);
    expect(api.put).toHaveBeenCalledWith('v1/armazenamento/documentos/99', {
      arquivosCodigos: [1, 2],
    });
  });

  it('deve obter documento por ID', () => {
    ServicoDocumentosPlanosTrabalho.obterDocumento(123);
    expect(api.get).toHaveBeenCalledWith('v1/armazenamento/documentos/123');
  });

  it('deve excluir documento por ID', () => {
    ServicoDocumentosPlanosTrabalho.excluirDocumento(123);
    expect(api.delete).toHaveBeenCalledWith('v1/armazenamento/documentos/123');
  });

  it('deve validar usuário para documento', () => {
    ServicoDocumentosPlanosTrabalho.validacaoUsuarioDocumento(
      1, 2, 3, 4, 5, 2024
    );

    expect(api.get).toHaveBeenCalledWith(
      'v1/armazenamento/documentos/1/tipo-documento/2/classificacao/3/usuario/4/ue/5/anoLetivo/2024'
    );
  });

  describe('verificaSeEhClassificacaoDocumentosTurma', () => {
    it('deve retornar true se for DOCUMENTOS_DA_TURMA', () => {
      const classificacaoId = 1;
      const lista = [
        { id: 1, classificacao: TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA },
      ];
      const resultado =
        ServicoDocumentosPlanosTrabalho.verificaSeEhClassificacaoDocumentosTurma(
          classificacaoId,
          lista
        );
      expect(resultado).toBe(true);
    });

    it('deve retornar false se não for DOCUMENTOS_DA_TURMA', () => {
      const classificacaoId = 2;
      const lista = [
        { id: 2, classificacao: 'OUTRO_TIPO' },
      ];
      const resultado =
        ServicoDocumentosPlanosTrabalho.verificaSeEhClassificacaoDocumentosTurma(
          classificacaoId,
          lista
        );
      expect(resultado).toBe(false);
    });

    it('deve retornar false se não encontrar classificação', () => {
      const classificacaoId = 3;
      const lista = [{ id: 4, classificacao: 'NADA' }];
      const resultado =
        ServicoDocumentosPlanosTrabalho.verificaSeEhClassificacaoDocumentosTurma(
          classificacaoId,
          lista
        );
      expect(resultado).toBe(false);
    });
  });
});
