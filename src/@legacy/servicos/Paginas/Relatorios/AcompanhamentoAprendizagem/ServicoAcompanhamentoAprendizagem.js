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

  validarInconsistencias = (turmaId, semestre) => {
    // return new Promise(resolve => {
    //   resolve({
    //     data: {
    //       "mensagemInconsistenciaPercursoColetivo": "Ausência do preenchimento do percurso coletivo do semestre.",
    //       "inconsistenciaPercursoIndividual": {
    //         "mensagemInsconsistencia": "Crianças com ausência do percurso individual no semestre:",
    //         "alunosComInconsistenciaPercursoIndividualRAA": [{
    //             "numeroChamada": 1,
    //             "alunoNome": "ALICE ROCHA GOMES",
    //             "alunoCodigo": "7441854"
    //           },
    //           {
    //             "numeroChamada": 2,
    //             "alunoNome": "ANA LORRANY ANDRADE DOS SANTOS",
    //             "alunoCodigo": "7162172"
    //           },
    //           {
    //             "numeroChamada": 3,
    //             "alunoNome": "ANNA CLARA PEREIRA DA COSTA",
    //             "alunoCodigo": "7580354"
    //           },
    //           {
    //             "numeroChamada": 29,
    //             "alunoNome": "ARTHUR PRATES BATISTA",
    //             "alunoCodigo": "7255381"
    //           },
    //           {
    //             "numeroChamada": 28,
    //             "alunoNome": "BARBARA HELENA GOMES FRAZAO",
    //             "alunoCodigo": "7066117"
    //           },
    //           {
    //             "numeroChamada": 4,
    //             "alunoNome": "BERNARDO ALEXANDRE MOREIRA DOS SANTOS",
    //             "alunoCodigo": "7178311"
    //           },
    //           {
    //             "numeroChamada": 5,
    //             "alunoNome": "BERNARDO DIAS CARNEIRO",
    //             "alunoCodigo": "7443855"
    //           },
    //           {
    //             "numeroChamada": 32,
    //             "alunoNome": "CLARISSE DE SOUSA SILVA",
    //             "alunoCodigo": "7107256"
    //           },
    //           {
    //             "numeroChamada": 6,
    //             "alunoNome": "DANIEL PEREIRA DE SOUZA",
    //             "alunoCodigo": "7364188"
    //           },
    //           {
    //             "numeroChamada": 0,
    //             "alunoNome": "EMERSON FERREIRA DOS SANTOS SILVA",
    //             "alunoCodigo": "7527243"
    //           },
    //           {
    //             "numeroChamada": 7,
    //             "alunoNome": "ENZO GABRIEL DA SILVA",
    //             "alunoCodigo": "7161049"
    //           },
    //           {
    //             "numeroChamada": 40,
    //             "alunoNome": "ENZO GABRIEL MARTINS VIEIRA",
    //             "alunoCodigo": "7043395"
    //           },
    //           {
    //             "numeroChamada": 9,
    //             "alunoNome": "ESTHER GARCIA NOGUEIRA",
    //             "alunoCodigo": "7886945"
    //           },
    //           {
    //             "numeroChamada": 37,
    //             "alunoNome": "GIOVANNA MACHADO FERREIRA DE SOUZA",
    //             "alunoCodigo": "7260099"
    //           },
    //           {
    //             "numeroChamada": 10,
    //             "alunoNome": "HANNAH ARAUJO MARQUES FRANCA",
    //             "alunoCodigo": "7121604"
    //           },
    //           {
    //             "numeroChamada": 11,
    //             "alunoNome": "HEITOR FIGUEIREDO NASCIMENTO",
    //             "alunoCodigo": "7538084"
    //           },
    //           {
    //             "numeroChamada": 12,
    //             "alunoNome": "HEITOR RIBEIRO DA SILVA SANTOS",
    //             "alunoCodigo": "7254340"
    //           },
    //           {
    //             "numeroChamada": 31,
    //             "alunoNome": "HELOISA CALLIOPE ABREU GOMES",
    //             "alunoCodigo": "7368540"
    //           },
    //           {
    //             "numeroChamada": 13,
    //             "alunoNome": "IGOR JOSE SILVA BARBOSA",
    //             "alunoCodigo": "7513248"
    //           },
    //           {
    //             "numeroChamada": 14,
    //             "alunoNome": "ISABELLY CAVALCANTE DE MEDEIROS",
    //             "alunoCodigo": "7249134"
    //           },
    //           {
    //             "numeroChamada": 15,
    //             "alunoNome": "ISADORA LAZZARINI DE MELO",
    //             "alunoCodigo": "7357480"
    //           },
    //           {
    //             "numeroChamada": 16,
    //             "alunoNome": "JAMAL GALDINO SANTOS DE MOURA",
    //             "alunoCodigo": "7228253"
    //           },
    //           {
    //             "numeroChamada": 17,
    //             "alunoNome": "JOAO PEDRO GOMES DE CARVALHO",
    //             "alunoCodigo": "7773653"
    //           },
    //           {
    //             "numeroChamada": 18,
    //             "alunoNome": "JOAO PEDRO RIBEIRO DO NASCIMENTO",
    //             "alunoCodigo": "7253607"
    //           },
    //           {
    //             "numeroChamada": 19,
    //             "alunoNome": "LAURA TAVARES OLIVEIRA",
    //             "alunoCodigo": "7074219"
    //           },
    //           {
    //             "numeroChamada": 38,
    //             "alunoNome": "LORENA CRISTINA DOS SANTOS",
    //             "alunoCodigo": "7136735"
    //           },
    //           {
    //             "numeroChamada": 39,
    //             "alunoNome": "LORENA MICAELLY AMORIM DA CRUZ",
    //             "alunoCodigo": "7268649"
    //           },
    //           {
    //             "numeroChamada": 20,
    //             "alunoNome": "LORENA SOUSA SANTOS",
    //             "alunoCodigo": "7215441"
    //           },
    //           {
    //             "numeroChamada": 21,
    //             "alunoNome": "LORENNA MASSANARI SOUZA",
    //             "alunoCodigo": "7313894"
    //           },
    //           {
    //             "numeroChamada": 22,
    //             "alunoNome": "MANOELA DOS SANTOS SOUSA",
    //             "alunoCodigo": "6956097"
    //           },
    //           {
    //             "numeroChamada": 36,
    //             "alunoNome": "MARIA CECILIA ALBUQUERQUE ALVES",
    //             "alunoCodigo": "8176339"
    //           },
    //           {
    //             "numeroChamada": 23,
    //             "alunoNome": "MARIA HELOISA GOMES SARDINHA",
    //             "alunoCodigo": "7384001"
    //           },
    //           {
    //             "numeroChamada": 24,
    //             "alunoNome": "MURILO COSTA MARIANO",
    //             "alunoCodigo": "7510039"
    //           },
    //           {
    //             "numeroChamada": 41,
    //             "alunoNome": "NICOLLAS GABRIEL BRAGA LOPES",
    //             "alunoCodigo": "7385215"
    //           },
    //           {
    //             "numeroChamada": 25,
    //             "alunoNome": "SOFIA ALVES AMORIM",
    //             "alunoCodigo": "7105072"
    //           },
    //           {
    //             "numeroChamada": 30,
    //             "alunoNome": "VALENTINA GODOY",
    //             "alunoCodigo": "7340974"
    //           },
    //           {
    //             "numeroChamada": 26,
    //             "alunoNome": "VALENTINA VIANA CALIXTO",
    //             "alunoCodigo": "7172875"
    //           },
    //           {
    //             "numeroChamada": 27,
    //             "alunoNome": "YURI ARAUJO LIMA",
    //             "alunoCodigo": "7121607"
    //           }
    //         ]
    //       }
    //     }
    //   });
    // });
    return api.get(`/v1/acompanhamento/alunos/validar-percurso/turma/${turmaId}/semestre/${semestre}`)
  }
}

export default new ServicoAcompanhamentoAprendizagem();
