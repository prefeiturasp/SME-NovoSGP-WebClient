import secaodadosmock from '../../../../paginas/NAAPA/EncaminhamentoNovo/CadastroInstitucional/mock/secaodadosmock.json';
import questaodadosmock from '../../../../paginas/NAAPA/EncaminhamentoNovo/CadastroInstitucional/mock/questaodadosmock.json';
import api from '~/servicos/api';
import { erros, sucesso } from '~/servicos/alertas';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { store } from '@/core/redux';
import _ from 'lodash';

const URL_PADRAO = 'v1/novo-encaminhamento-naapa';

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

  obterSecoesInstitucional = async encaminhamentoId => {
    try {
      return { data: secaodadosmock };
    } catch (e) {
      erros(e);
      return { data: [] };
    }
  };

  obterDadosQuestionarioIdInstitucional = async (
    questionarioId,
    encaminhamentoId
  ) => {
    try {
      return { data: questaodadosmock };
    } catch (e) {
      erros(e);
      return { data: [] };
    }
  };

  removerArquivoInstitucional = arquivoCodigo => {
    return api.delete(`${URL_PADRAO}/arquivo?arquivoCodigo=${arquivoCodigo}`);
  };

  downloadArquivoInstitucional = arquivoCodigo => {
    return api.get(`v1/armazenamento/arquivos/${arquivoCodigo}`, {
      responseType: 'blob',
    });
  };

  salvarEncaminhamentoInstitucional = async (
    encaminhamentoId,
    limparDadosAoSalvar = true
  ) => {
    try {
      const state = store.getState();
      const { encaminhamentoInstitucional } = state;
      const {
        dadosEncaminhamentoInstitucional,
        dadosSecoesEncaminhamentoInstitucional,
      } = encaminhamentoInstitucional;

      const nomesSecoesComCamposObrigatorios = [];

      const dadosMapeados =
        await QuestionarioDinamicoFuncoes.mapearQuestionarios(
          dadosSecoesEncaminhamentoInstitucional,
          true,
          nomesSecoesComCamposObrigatorios
        );

      const formsValidos = !!dadosMapeados?.formsValidos;

      if (!formsValidos && !dadosMapeados?.secoes?.length) {
        return false;
      }

      const paramsSalvar = {
        codigoDre: dadosEncaminhamentoInstitucional?.dreCodigo,
        codigoUe: dadosEncaminhamentoInstitucional?.ueCodigo,
        dataEntradaQueixa: dadosEncaminhamentoInstitucional?.dataEntradaQueixa,
        motivoEncaminhamento:
          dadosEncaminhamentoInstitucional?.motivoEncaminhamento || '',
        anexos: dadosEncaminhamentoInstitucional?.anexos || [],
        secoes: dadosMapeados?.secoes?.length ? dadosMapeados.secoes : [],
      };

      if (encaminhamentoId) paramsSalvar.id = encaminhamentoId;
      console.log('paramsSalvar', paramsSalvar);
      return resposta;
    } catch (e) {
      erros(e);
      return null;
    }
  };
}

export default new ServicoEncaInstitucionalNAAPA();
