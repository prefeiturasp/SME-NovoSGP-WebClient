import { store } from '~/redux';
import {
  limparDadosParaSalvarRelatorioSemestral,
  setAuditoriaRelatorioSemestral,
  setRelatorioSemestralEmEdicao,
  setDadosRelatorioSemestral,
  setAlunosRelatorioSemestral,
  setCodigoAlunoSelecionado,
  setExibirModalErrosRalSemestralPAP,
  setErrosRalSemestralPAP,
} from '~/redux/modulos/relatorioSemestralPAP/actions';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import ServicoRelatorioSemestral from '~/servicos/Paginas/Relatorios/PAP/RelatorioSemestral/ServicoRelatorioSemestral';

class ServicoSalvarRelatorioSemestral {
  validarSalvarRelatorioSemestral = async (salvarSemValidar = false) => {
    const { dispatch } = store;
    const state = store.getState();

    const { relatorioSemestralPAP } = state;

    const {
      dadosRelatorioSemestral,
      relatorioSemestralEmEdicao,
      dadosParaSalvarRelatorioSemestral,
      desabilitarCampos,
      alunosRelatorioSemestral,
    } = relatorioSemestralPAP;

    const {
      relatorioSemestralId,
      relatorioSemestralAlunoId,
      turmaCodigo,
      semestreConsulta,
      alunoCodigo,
    } = dadosRelatorioSemestral;

    const perguntaDescartarRegistros = async () => {
      return confirmar(
        'Atenção',
        '',
        'Os registros deste aluno ainda não foram salvos, deseja descartar os registros?'
      );
    };

    const todosCamposValidos = (mostrarErro = false) => {
      const { secoes } = dadosRelatorioSemestral;
      const camposInvalidos = [];
      for (let index = 0; index < secoes.length; index += 1) {
        const secao = secoes[index];

        if (secao.obrigatorio) {
          const itemAlterado = dadosParaSalvarRelatorioSemestral.find(
            campo => Number(campo.id) === Number(secao.id)
          );
          if (itemAlterado) {
            if (!itemAlterado.valor) {
              if (mostrarErro) {
                camposInvalidos.push(secao.nome);
              }
            }
          } else if (!secao.valor) {
            if (mostrarErro) {
              camposInvalidos.push(secao.nome);
            }
          }
        }
      }

      if (camposInvalidos.length) {
        dispatch(setErrosRalSemestralPAP(camposInvalidos));
        dispatch(setExibirModalErrosRalSemestralPAP(true));
        return false;
      }
      return true;
    };

    const atualizarValoresRelatorioSemestral = async () => {
      const resposta = await ServicoRelatorioSemestral.obterDadosCamposDescritivos(
        alunoCodigo,
        turmaCodigo,
        semestreConsulta
      ).catch(e => erros(e));

      if (resposta?.data) {
        const { auditoria, secoes } = resposta?.data;

        if (!relatorioSemestralId) {
          dadosRelatorioSemestral.relatorioSemestralId =
            resposta.data.relatorioSemestralId;
          dadosRelatorioSemestral.relatorioSemestralId = relatorioSemestralId;
        }
        if (!relatorioSemestralAlunoId) {
          dadosRelatorioSemestral.relatorioSemestralAlunoId =
            resposta.data.relatorioSemestralAlunoId;
        }

        dadosRelatorioSemestral.auditoria = { ...auditoria };
        dadosRelatorioSemestral.secoes = [...secoes];

        dispatch(setAuditoriaRelatorioSemestral({ ...auditoria }));
        dispatch(setDadosRelatorioSemestral({ ...dadosRelatorioSemestral }));
      }
    };

    const salvar = async (limparTodosOsDados = false) => {
      const params = {
        relatorioSemestralId: relatorioSemestralId || 0,
        relatorioSemestralAlunoId: relatorioSemestralAlunoId || 0,
        secoes: dadosParaSalvarRelatorioSemestral,
      };

      const temRegistrosInvalidos = !todosCamposValidos(true);
      if (temRegistrosInvalidos) {
        return false;
      }

      const retorno = await ServicoRelatorioSemestral.salvarServicoRelatorioSemestral(
        turmaCodigo,
        semestreConsulta,
        alunoCodigo,
        params
      ).catch(e => erros(e));

      if (retorno?.status === 200) {
        atualizarValoresRelatorioSemestral();
        dispatch(setRelatorioSemestralEmEdicao(false));

        if (limparTodosOsDados) {
          dispatch(setDadosRelatorioSemestral({}));
          dispatch(limparDadosParaSalvarRelatorioSemestral());
        } else {
          dispatch(limparDadosParaSalvarRelatorioSemestral());
        }

        sucesso('Suas informações foram salvas com sucesso.');

        const alunoAtualIndex = alunosRelatorioSemestral.findIndex(
          item => item.codigoEOL === alunoCodigo
        );
        const alunosRelatorioSemestralDto = alunosRelatorioSemestral;
        alunosRelatorioSemestralDto[alunoAtualIndex].processoConcluido = true;
        dispatch(setCodigoAlunoSelecionado(alunoCodigo));
        dispatch(setAlunosRelatorioSemestral([...alunosRelatorioSemestralDto]));

        return true;
      }
      return false;
    };

    if (desabilitarCampos) {
      return true;
    }

    if (salvarSemValidar && relatorioSemestralEmEdicao) {
      return salvar();
    }

    if (relatorioSemestralEmEdicao) {
      const temRegistrosInvalidos = !todosCamposValidos();

      let descartarRegistros = false;
      if (temRegistrosInvalidos) {
        descartarRegistros = await perguntaDescartarRegistros();
      }

      // Voltar para a tela continua e executa a ação!
      if (descartarRegistros) {
        dispatch(setRelatorioSemestralEmEdicao(false));
        return true;
      }

      // Voltar para a tela e não executa a ação!
      if (!descartarRegistros && temRegistrosInvalidos) {
        return false;
      }

      // Tenta salvar os registros se estão válidos e continuar para executação a ação!
      return salvar(true);
    }
    return true;
  };
}

export default new ServicoSalvarRelatorioSemestral();
