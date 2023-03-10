import { store } from '@/core/redux';
import {
  setAtualizarDatas,
  setDadosPlanoAula,
  setErrosPlanoAula,
  setExibirLoaderFrequenciaPlanoAula,
  setExibirModalErrosPlanoAula,
  setListaDadosFrequencia,
  setModoEdicaoFrequencia,
  setModoEdicaoPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import { erros, sucesso } from '~/servicos/alertas';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';

class ServicoSalvarFrequenciaPlanoAula {
  salvarFrequencia = async () => {
    const { dispatch } = store;
    const state = store.getState();

    const { frequenciaPlanoAula } = state;
    const { listaDadosFrequencia, aulaId } = frequenciaPlanoAula;

    const valorParaSalvar = {
      aulaId,
      listaFrequencia: listaDadosFrequencia.listaFrequencia,
    };

    dispatch(setExibirLoaderFrequenciaPlanoAula(true));

    const resposta = await ServicoFrequencia.salvarFrequencia(valorParaSalvar)
      .finally(() => dispatch(setExibirLoaderFrequenciaPlanoAula(false)))
      .catch(e => erros(e));

    if (resposta?.status === 200) {
      const auditoria = {
        criadoEm: resposta.data.criadoEm,
        criadoPor: resposta.data.criadoPor,
        alteradoPor: resposta.data.alteradoPor,
        alteradoEm: resposta.data.alteradoEm,
        alteradoRF: resposta.data.alteradoRF,
        criadoRF: resposta.data.criadoRF,
      };
      listaDadosFrequencia.auditoria = { ...auditoria };
      listaDadosFrequencia.id = resposta.data.id;
      dispatch(setListaDadosFrequencia(listaDadosFrequencia));

      sucesso('Frequência realizada com sucesso.');
      dispatch(setModoEdicaoFrequencia(false));
      return true;
    }

    return false;
  };

  salvarPlanoAula = async () => {
    const { dispatch } = store;
    const state = store.getState();

    const { frequenciaPlanoAula, usuario, perfis } = state;
    const { ehProfessorCj, turmaSelecionada } = usuario;
    const { consideraHistorico } = turmaSelecionada;
    const {
      dadosPlanoAula,
      aulaId,
      exibirSwitchEscolhaObjetivos,
      checkedExibirEscolhaObjetivos,
      dadosOriginaisPlanoAula,
      componenteCurricular,
      objetivosEspecificosParaAulaValidarObrigatoriedade,
    } = frequenciaPlanoAula;

    const validaSeTemErrosPlanoAula = () => {
      const errosValidacaoPlano = [];
      if (!dadosPlanoAula.descricao) {
        errosValidacaoPlano.push(
          'Meus objetivos - O campo meus objetivos específicos para a aula é obrigatório'
        );
        objetivosEspecificosParaAulaValidarObrigatoriedade();
      }
      const perfil =
        perfis && perfis.perfis.find(item => item.nomePerfil === 'PAP');
      if (perfil && !dadosPlanoAula.objetivosAprendizagemComponente.length) {
        return false;
      }

      if (
        exibirSwitchEscolhaObjetivos
          ? checkedExibirEscolhaObjetivos &&
            componenteCurricular.possuiObjetivos &&
            !ServicoPlanoAula.temPeloMenosUmObjetivoSelecionado(
              dadosPlanoAula.objetivosAprendizagemComponente
            )
          : componenteCurricular.possuiObjetivos &&
            !ServicoPlanoAula.temPeloMenosUmObjetivoSelecionado(
              dadosPlanoAula.objetivosAprendizagemComponente
            )
      ) {
        errosValidacaoPlano.push(
          'Objetivos de aprendizagem - É obrigatório selecionar ao menos um objetivo de aprendizagem'
        );
      }

      if (errosValidacaoPlano && errosValidacaoPlano.length) {
        dispatch(setErrosPlanoAula(errosValidacaoPlano));
        return true;
      }
      return false;
    };

    const temErrosValidacaoPlano = validaSeTemErrosPlanoAula();

    if (temErrosValidacaoPlano) {
      dispatch(setExibirModalErrosPlanoAula(true));
      return false;
    }

    let objetivosAprendizagemComponente = [];
    // TODO Testar quando o enpoint de obter plano aula for ajustado para obter dados quando nao for componente de regencia!
    // Testar para ver se os dados editados estão alterando os dados originais por referencia de memoria!
    if (
      ehProfessorCj &&
      exibirSwitchEscolhaObjetivos &&
      !checkedExibirEscolhaObjetivos
    ) {
      if (
        dadosOriginaisPlanoAula &&
        dadosOriginaisPlanoAula.objetivosAprendizagemComponente &&
        dadosOriginaisPlanoAula.objetivosAprendizagemComponente.length
      ) {
        objetivosAprendizagemComponente = [
          ...dadosOriginaisPlanoAula.objetivosAprendizagemComponente,
        ];
      }
    } else if (
      dadosPlanoAula &&
      dadosPlanoAula.objetivosAprendizagemComponente.length
    ) {
      dadosPlanoAula.objetivosAprendizagemComponente.forEach(item => {
        item.objetivosAprendizagem.forEach(obj => {
          objetivosAprendizagemComponente.push({
            componenteCurricularId: item.componenteCurricularId,
            id: obj.id,
          });
        });
      });
    }

    const valorParaSalvar = {
      descricao: dadosPlanoAula.descricao,
      recuperacaoAula: dadosPlanoAula.recuperacaoAula,
      licaoCasa: dadosPlanoAula.licaoCasa,
      aulaId,
      objetivosAprendizagemComponente,
      ComponenteCurricularId: componenteCurricular.id,
      ConsideraHistorico: consideraHistorico,
    };

    dispatch(setExibirLoaderFrequenciaPlanoAula(true));

    const resposta = await ServicoPlanoAula.salvarPlanoAula(valorParaSalvar)
      .finally(() => dispatch(setExibirLoaderFrequenciaPlanoAula(false)))
      .catch(e => erros(e));

    if (resposta?.status === 200) {
      const auditoria = {
        criadoEm: resposta.data.criadoEm,
        criadoPor: resposta.data.criadoPor,
        alteradoPor: resposta.data.alteradoPor,
        alteradoEm: resposta.data.alteradoEm,
        alteradoRf: resposta.data.alteradoRf,
        criadoRf: resposta.data.criadoRf,
      };
      dadosPlanoAula.auditoria = { ...auditoria };
      dadosPlanoAula.id = resposta.data.id;
      dadosPlanoAula.descricao = resposta.data.descricao;
      dadosPlanoAula.recuperacaoAula = resposta.data.recuperacaoAula;
      dadosPlanoAula.licaoCasa = resposta.data.licaoCasa;
      dispatch(setDadosPlanoAula({ ...dadosPlanoAula }));

      sucesso('Plano de aula salvo com sucesso.');
      dispatch(setModoEdicaoPlanoAula(false));
      return true;
    }

    return false;
  };

  validarSalvarFrequenciPlanoAula = async () => {
    const { dispatch } = store;
    const state = store.getState();

    const { frequenciaPlanoAula } = state;

    const { listaDadosFrequencia, modoEdicaoFrequencia, modoEdicaoPlanoAula } =
      frequenciaPlanoAula;

    let salvouFrequencia = true;
    let salvouPlanoAula = true;

    const permiteRegistroFrequencia = !listaDadosFrequencia.desabilitado;
    if (modoEdicaoFrequencia && permiteRegistroFrequencia) {
      salvouFrequencia = await this.salvarFrequencia();
    }

    if (modoEdicaoPlanoAula) {
      salvouPlanoAula = await this.salvarPlanoAula();
    }

    const salvouComSucesso = salvouFrequencia && salvouPlanoAula;

    if (salvouComSucesso) {
      dispatch(setAtualizarDatas(true));
    }
    return salvouComSucesso;
  };
}

export default new ServicoSalvarFrequenciaPlanoAula();
