import { store } from '@/core/redux';
import {
  setAcompanhamentoAprendizagemEmEdicao,
  setApanhadoGeralEmEdicao,
  setDadosAcompanhamentoAprendizagem,
  setDadosApanhadoGeral,
  setErrosAcompanhamentoAprendizagem,
  setExibirLoaderGeralAcompanhamentoAprendizagem,
  setExibirModalErrosAcompanhamentoAprendizagem,
  setQtdMaxImagensCampoPercursoColetivo,
  setQtdMaxImagensCampoPercursoIndividual,
} from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import { limparDadosRegistroIndividual } from '~/redux/modulos/registroIndividual/actions';
import { erro, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';

const urlPadrao = '/v1/acompanhamento/alunos';

class ServicoAcompanhamentoAprendizagem {
  obterListaAlunos = (turmaCodigo, anoLetivo, periodo) => {
    const url = `v1/fechamentos/turmas/${turmaCodigo}/alunos/anos/${anoLetivo}/semestres/${periodo}`;
    return api.get(url);
  };

  obterListaSemestres = () => {
    return new Promise(resolve => {
      resolve({
        data: [
          {
            semestre: '1',
            descricao: '1º Semestre',
          },
          {
            semestre: '2',
            descricao: '2º Semestre',
          },
        ],
      });
    });
  };

  obterAcompanhamentoEstudante = async (
    turmaId,
    alunoId,
    semestre,
    componenteCurricularId
  ) => {
    const { dispatch } = store;
    dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(true));

    dispatch(limparDadosRegistroIndividual());
    dispatch(setDadosAcompanhamentoAprendizagem({}));

    const retorno = await api
      .get(
        `${urlPadrao}?turmaId=${turmaId}&alunoId=${alunoId}&semestre=${semestre}&componenteCurricularId=${componenteCurricularId}`
      )
      .catch(e => erros(e))
      .finally(() =>
        dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(false))
      );

    if (retorno?.data) {
      dispatch(setDadosAcompanhamentoAprendizagem({ ...retorno.data }));
      return retorno.data;
    }

    dispatch(setDadosAcompanhamentoAprendizagem({}));
    return 0;
  };

  salvarAcompanhamentoAprendizagem = params => {
    return api.post(`${urlPadrao}/semestres`, params);
  };

  uploadFoto = (formData, configuracaoHeader) => {
    return api.post(
      `${urlPadrao}/semestres/upload`,
      formData,
      configuracaoHeader
    );
  };

  obterFotos = acompanhamentoAlunoSemestreId => {
    return api.get(
      `${urlPadrao}/semestres/${acompanhamentoAlunoSemestreId}/fotos`
    );
  };

  excluirFotos = (acompanhamentoAlunoSemestreId, codigoFoto) => {
    return api.delete(
      `${urlPadrao}/semestres/${acompanhamentoAlunoSemestreId}/fotos/${codigoFoto}`
    );
  };

  atualizarDadosPorNomeCampo = (valorNovo, nomeCampo) => {
    const { dispatch } = store;
    const state = store.getState();

    const { acompanhamentoAprendizagem } = state;

    const { dadosAcompanhamentoAprendizagem } = acompanhamentoAprendizagem;

    const dadosAcompanhamentoAtual = dadosAcompanhamentoAprendizagem;
    dadosAcompanhamentoAtual[nomeCampo] = valorNovo;
    dispatch(setDadosAcompanhamentoAprendizagem(dadosAcompanhamentoAtual));
  };

  salvarDadosAcompanhamentoAprendizagem = async semestreSelecionado => {
    const { dispatch } = store;
    const state = store.getState();

    const { acompanhamentoAprendizagem, usuario } = state;
    const { turmaSelecionada } = usuario;

    const {
      dadosAcompanhamentoAprendizagem,
      acompanhamentoAprendizagemEmEdicao,
      desabilitarCamposAcompanhamentoAprendizagem,
      dadosAlunoObjectCard,
    } = acompanhamentoAprendizagem;

    const { codigoEOL } = dadosAlunoObjectCard;

    const salvar = async () => {
      if (!dadosAcompanhamentoAprendizagem.percursoIndividual) {
        dispatch(
          setErrosAcompanhamentoAprendizagem([
            'Campo percurso individual é obrigatório',
          ])
        );
        dispatch(setExibirModalErrosAcompanhamentoAprendizagem(true));
        return false;
      }

      const params = {
        acompanhamentoAlunoId:
          dadosAcompanhamentoAprendizagem.acompanhamentoAlunoId,
        acompanhamentoAlunoSemestreId:
          dadosAcompanhamentoAprendizagem.acompanhamentoAlunoSemestreId,
        turmaId: turmaSelecionada?.id,
        semestre: semestreSelecionado,
        alunoCodigo: codigoEOL,
        observacoes: dadosAcompanhamentoAprendizagem.observacoes || '',
        percursoIndividual:
          dadosAcompanhamentoAprendizagem.percursoIndividual || '',
        textoSugerido: dadosAcompanhamentoAprendizagem.textoSugerido,
      };

      dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(true));
      const retorno = await this.salvarAcompanhamentoAprendizagem(params)
        .catch(e => erros(e))
        .finally(() =>
          dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(false))
        );

      if (retorno?.status === 200) {
        if (dadosAcompanhamentoAprendizagem?.acompanhamentoAlunoSemestreId) {
          sucesso('Registro alterado com sucesso');
        } else {
          sucesso('Registro inserido com sucesso');
        }

        const dadosNovos = dadosAcompanhamentoAprendizagem;

        const {
          auditoria,
          acompanhamentoAlunoId,
          acompanhamentoAlunoSemestreId,
        } = retorno.data;

        dadosNovos.auditoria = auditoria;
        dadosNovos.acompanhamentoAlunoId = acompanhamentoAlunoId;
        dadosNovos.acompanhamentoAlunoSemestreId =
          acompanhamentoAlunoSemestreId;
        dispatch(setDadosAcompanhamentoAprendizagem(dadosNovos));

        dispatch(setAcompanhamentoAprendizagemEmEdicao(false));

        return true;
      }
      return false;
    };

    if (desabilitarCamposAcompanhamentoAprendizagem) {
      return true;
    }

    if (acompanhamentoAprendizagemEmEdicao) {
      return salvar();
    }

    return true;
  };

  atualizarApanhadoGeral = valorNovo => {
    const { dispatch } = store;
    const state = store.getState();

    const { acompanhamentoAprendizagem } = state;

    const { dadosApanhadoGeral } = acompanhamentoAprendizagem;

    const dadosApanhadoGeralAtual = dadosApanhadoGeral;
    dadosApanhadoGeralAtual.apanhadoGeral = valorNovo;
    dispatch(setDadosApanhadoGeral(dadosApanhadoGeralAtual));
  };

  salvarApanhadoGeral = params => {
    return api.post(`v1/acompanhamento/turmas`, params);
  };

  salvarDadosApanhadoGeral = async semestreSelecionado => {
    const { dispatch } = store;
    const state = store.getState();

    const { acompanhamentoAprendizagem, usuario } = state;
    const { turmaSelecionada } = usuario;

    const {
      dadosApanhadoGeral,
      desabilitarCamposAcompanhamentoAprendizagem,
      apanhadoGeralEmEdicao,
    } = acompanhamentoAprendizagem;

    const salvar = async () => {
      if (!dadosApanhadoGeral.apanhadoGeral) {
        erro('Percurso coletivo da turma é obrigatório');
        return false;
      }
      const paramsApanhadoGeral = {
        turmaId: turmaSelecionada?.id,
        semestre: semestreSelecionado,
        apanhadoGeral: dadosApanhadoGeral.apanhadoGeral || '',
        acompanhamentoTurmaId: dadosApanhadoGeral.acompanhamentoTurmaId || 0,
      };
      const retornoApanhadoGeral = await this.salvarApanhadoGeral(
        paramsApanhadoGeral
      )
        .catch(e => erros(e))
        .finally(() =>
          dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(false))
        );

      const salvouApanhadoGeral = retornoApanhadoGeral?.status === 200;

      if (salvouApanhadoGeral) {
        if (dadosApanhadoGeral.acompanhamentoTurmaId) {
          sucesso('Percurso Coletivo da Turma alterado com sucesso');
        } else {
          sucesso('Percurso Coletivo da Turma inserido com sucesso');
        }

        paramsApanhadoGeral.auditoria = retornoApanhadoGeral.data;
        paramsApanhadoGeral.acompanhamentoTurmaId =
          retornoApanhadoGeral.data.id;
        paramsApanhadoGeral.apanhadoGeral =
          retornoApanhadoGeral.data.apanhadoGeral;
        dispatch(setDadosApanhadoGeral(paramsApanhadoGeral));

        dispatch(setApanhadoGeralEmEdicao(false));
        return true;
      }
      return false;
    };

    if (desabilitarCamposAcompanhamentoAprendizagem) {
      return true;
    }

    if (apanhadoGeralEmEdicao) {
      return salvar();
    }

    return true;
  };

  obterDadosApanhadoGeral = async (turmaId, semestre) => {
    const url = `v1/acompanhamento/turmas/apanhado-geral?turmaId=${turmaId}&semestre=${semestre}`;

    const { dispatch } = store;
    dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(true));
    dispatch(setDadosApanhadoGeral({}));
    const retorno = await api
      .get(url)
      .catch(e => erros(e))
      .finally(() =>
        dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(false))
      );

    if (retorno?.data) {
      dispatch(setDadosApanhadoGeral({ ...retorno.data }));
    }
  };

  gerar = params => {
    const url = `v1/relatorios/acompanhamento-aprendizagem`;
    return api.post(url, params);
  };

  obterQtdMaxImagensCampos = async anoLetivo => {
    const { dispatch } = store;

    const url = `v1/acompanhamento/turmas/quantidade-imagens?ano=${anoLetivo}`;
    const retorno = await api.get(url).catch(e => erros(e));
    if (retorno?.data) {
      const {
        quantidadeImagemPercursoColetivo,
        quantidadeImagemPercursoIndividual,
      } = retorno.data;

      dispatch(
        setQtdMaxImagensCampoPercursoColetivo(
          quantidadeImagemPercursoColetivo || 0
        )
      );
      dispatch(
        setQtdMaxImagensCampoPercursoIndividual(
          quantidadeImagemPercursoIndividual || 0
        )
      );
    } else {
      dispatch(setQtdMaxImagensCampoPercursoColetivo());
      dispatch(setQtdMaxImagensCampoPercursoIndividual());
    }
  };
}

export default new ServicoAcompanhamentoAprendizagem();
