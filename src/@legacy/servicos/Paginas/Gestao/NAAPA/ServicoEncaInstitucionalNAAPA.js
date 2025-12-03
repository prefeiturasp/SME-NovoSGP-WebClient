import secaodadosmock from '../../../../paginas/NAAPA/EncaminhamentoNovo/CadastroInstitucional/mock/secaodadosmock.json';
import questaodadosmock from '../../../../paginas/NAAPA/EncaminhamentoNovo/CadastroInstitucional/mock/questaodadosmock.json';

const URL_PADRAO = 'v1/encaminhamento-naapa';

class ServicoEncaInstitucionalNAAPA {
  obterEncaminhamentoInstitucional = async encaminhamentoId => {
    try {
      const resposta = await api.get(`${URL_PADRAO}/${encaminhamentoId}`);
      return resposta;
    } catch (e) {
      erros(e);
      return null;
    }
  };

  obterSecoesInstitucional = encaminhamentoId => {
    console.log('Mock:', encaminhamentoId);
    return secaodadosmock;

    // const params = encaminhamentoId
    //   ? `?encaminhamentoId=${encaminhamentoId}&dreId=${dreId}&ueId=${ueId}`
    //   : `?dreId=${dreId}&ueId=${ueId}`;
    // return api.get(`${URL_PADRAO}/secoes-institucional${params}`);
  };

  obterDadosQuestionarioIdInstitucional = (
    questionarioId,
    encaminhamentoId
  ) => {
    console.log('Mock:', questionarioId, encaminhamentoId);
    return questaodadosmock;
    // const encaminhamentoParam = encaminhamentoId
    //   ? `&encaminhamentoId=${encaminhamentoId}`
    //   : '';
    // return api.get(
    //   `${URL_PADRAO}/questionario-institucional?questionarioId=${questionarioId}&dreId=${dreId}&ueId=${ueId}${encaminhamentoParam}`
    // );
  };

  //ver o remover arquivo e download depois
  removerArquivoInstitucional = arquivoCodigo => {
    return api.delete(`${URL_PADRAO}/arquivo?arquivoCodigo=${arquivoCodigo}`);
  };
}

export default new ServicoEncaInstitucionalNAAPA();
