import { TIPO_CLASSIFICACAO } from '~/constantes';
import api from '~/servicos/api';

const urlPadrao = 'v1/armazenamento/documentos';

class ServicoDocumentosPlanosTrabalho {
  obterTiposDeDocumentos = () => {
    return api.get(`${urlPadrao}/tipos`);
  };

  salvarDocumento = (params, documentoId) => {
    if (documentoId) {
      return api.put(`${urlPadrao}/${documentoId}`, {
        arquivosCodigos: params.arquivosCodigos,
      });
    }

    return api.post(`${urlPadrao}`, params);
  };

  obterDocumento = documentoId => {
    return api.get(`${urlPadrao}/${documentoId}`);
  };

  excluirDocumento = documentoId => {
    return api.delete(`${urlPadrao}/${documentoId}`);
  };

  validacaoUsuarioDocumento = (
    documentoId,
    tipoDocumentoId,
    classificacaoId,
    usuarioId,
    ueId
  ) => {
    const url = `${documentoId}/tipo-documento/${tipoDocumentoId}/classificacao/${classificacaoId}/usuario/${usuarioId}/ue/${ueId}`;
    return api.get(`${urlPadrao}/${url}`);
  };

  verificaSeEhClassificacaoDocumentosTurma = (
    classificacaoId,
    listaClassificacoes
  ) => {
    const classificacaoSelecionada = listaClassificacoes?.find(
      c => c?.id?.toString() === classificacaoId?.toString()
    );

    const ehClassificacaoDocumentosTurma =
      classificacaoSelecionada?.classificacao ===
      TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA;

    return ehClassificacaoDocumentosTurma;
  };
}

export default new ServicoDocumentosPlanosTrabalho();
