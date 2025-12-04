import secaodadosmock from '../../../../paginas/NAAPA/EncaminhamentoNovo/CadastroInstitucional/mock/secaodadosmock.json';
import questaodadosmock from '../../../../paginas/NAAPA/EncaminhamentoNovo/CadastroInstitucional/mock/questaodadosmock.json';
import api from '~/servicos/api';
import { erros, sucesso } from '~/servicos/alertas';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { store } from '@/core/redux';
import _ from 'lodash';

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

  obterSecoesInstitucional = async encaminhamentoId => {
    // Retorna formato compatível com outros serviços: { data: [...] }
    try {
      // Em desenvolvimento usamos mock
      return { data: secaodadosmock };
      // Em produção, descomente a linha abaixo e ajuste params conforme backend
      // const params = encaminhamentoId ? `?encaminhamentoId=${encaminhamentoId}` : '';
      // return api.get(`${URL_PADRAO}/secoes-institucional${params}`);
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
      // Em desenvolvimento usamos mock
      return { data: questaodadosmock };
      // Em produção, descomente e ajuste:
      // const encaminhamentoParam = encaminhamentoId ? `&encaminhamentoId=${encaminhamentoId}` : '';
      // return api.get(`${URL_PADRAO}/questionario-institucional?questionarioId=${questionarioId}${encaminhamentoParam}`);
    } catch (e) {
      erros(e);
      return { data: [] };
    }
  };

  removerArquivoInstitucional = arquivoCodigo => {
    return api.delete(`${URL_PADRAO}/arquivo?arquivoCodigo=${arquivoCodigo}`);
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
        // campos do form institucional
        dataEntradaQueixa: dadosEncaminhamentoInstitucional?.dataEntradaQueixa,
        motivoEncaminhamento:
          dadosEncaminhamentoInstitucional?.motivoEncaminhamento || '',
        anexos: dadosEncaminhamentoInstitucional?.anexos || [],
        secoes: dadosMapeados?.secoes?.length ? dadosMapeados.secoes : [],
      };

      if (encaminhamentoId) paramsSalvar.id = encaminhamentoId;
      console.log('paramsSalvar', paramsSalvar);
      // const resposta = await api
      //   .post(`${URL_PADRAO}/salvar-institucional`, paramsSalvar)
      //   .catch(e => {
      //     erros(e);
      //     return null;
      //   });

      // if (resposta?.status === 200 && limparDadosAoSalvar) {
      //   sucesso('Registro salvo com sucesso');
      // }

      return resposta;
    } catch (e) {
      erros(e);
      return null;
    }
  };
}

export default new ServicoEncaInstitucionalNAAPA();
