import { Col, Row } from 'antd';
import $ from 'jquery';
import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { RotasDto } from '~/dtos';
import notasConceitos from '~/dtos/notasConceitos';
import {
  setAcaoTelaEmEdicao,
  setLimparModoEdicaoGeral,
  setTelaEmEdicao,
} from '~/redux/modulos/geral/actions';
import {
  limparDadosObservacoesUsuario,
  setDadosObservacoesUsuario,
} from '~/redux/modulos/observacoesUsuario/actions';
import {
  api,
  confirmar,
  erro,
  erros,
  history,
  ServicoDiarioBordo,
  sucesso,
} from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';
import { editorTemValor } from '~/utils';
import {
  LISTAO_TAB_AVALIACOES,
  LISTAO_TAB_DIARIO_BORDO,
  LISTAO_TAB_FECHAMENTO,
  LISTAO_TAB_FREQUENCIA,
  LISTAO_TAB_PLANO_AULA,
} from '../listaoConstantes';
import ListaoContext from '../listaoContext';
import {
  montarIdsObjetivosSelecionadosListao,
  obterDiarioBordoListao,
  obterListaAlunosAvaliacaoListao,
  salvarEditarObservacao,
  validarSalvarFechamentoListao,
} from '../listaoFuncoes';

const ListaoOperacoesBotoesAcao = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma, consideraHistorico } = turmaSelecionada;

  const {
    dadosFrequencia,
    dadosIniciaisFrequencia,
    tabAtual,
    setDadosFrequencia,
    setExibirLoaderGeral,
    setDadosIniciaisFrequencia,
    somenteConsultaListao,
    periodoAbertoListao,
    dadosPlanoAula,
    dadosIniciaisPlanoAula,
    setDadosPlanoAula,
    componenteCurricular,
    listaObjetivosAprendizagem,
    setDadosIniciaisPlanoAula,
    periodo,
    setErrosPlanoAulaListao,
    dadosIniciaisDiarioBordo,
    setDadosDiarioBordo,
    setDadosIniciaisDiarioBordo,
    dadosDiarioBordo,
    componenteCurricularDiarioBordo,
    setErrosDiarioBordoListao,
    dadosAvaliacao,
    setDadosAvaliacao,
    dadosIniciaisAvaliacao,
    dadosPeriodosAvaliacao,
    setDadosIniciaisAvaliacao,
    bimestreOperacoes,
    idDiarioBordoAtual,
    setIdDiarioBordoAtual,
    dadosFechamento,
    setDadosFechamento,
    dadosIniciaisFechamento,
    setDadosIniciaisFechamento,
    setDadosModalJustificativaFechamento,
  } = useContext(ListaoContext);

  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);

  const desabilitarBotoes = !periodoAbertoListao || somenteConsultaListao;

  const pergutarParaSalvar = () =>
    confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );

  const salvarFrequencia = async () => {
    const paramsSalvar = dadosFrequencia.aulas
      .map(aula => {
        const alunos = dadosFrequencia?.alunos
          ?.map(aluno => {
            let aulasParaSalvar = [];
            if (aula?.frequenciaId) {
              aulasParaSalvar = aluno?.aulas?.filter(a => a?.alterado);
            } else {
              aulasParaSalvar = aluno?.aulas;
            }
            if (aulasParaSalvar?.length) {
              const aulaAlunoPorIdAula = aulasParaSalvar.find(
                aulaAluno => aulaAluno?.aulaId === aula?.aulaId
              );

              return {
                codigoAluno: aluno?.codigoAluno,
                frequencias: aulaAlunoPorIdAula?.detalheFrequencia,
              };
            }
            return {};
          })
          ?.filter(a => a?.codigoAluno && a?.frequencias?.length);
        return {
          aulaId: aula.aulaId,
          frequenciaId: aula?.frequenciaId,
          alunos,
        };
      })
      ?.filter(a => a?.alunos?.length);

    setExibirLoaderGeral(true);
    const resposta = await ServicoFrequencia.salvarFrequenciaListao(
      paramsSalvar
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.data) {
      const auditoriaNova = resposta.data;
      dadosFrequencia.auditoria = { ...auditoriaNova };
      dadosIniciaisFrequencia.auditoria = { ...auditoriaNova };
      setDadosFrequencia({ ...dadosFrequencia });
      setDadosIniciaisFrequencia(dadosIniciaisFrequencia);

      sucesso('Frequência realizada com sucesso.');
      dispatch(setTelaEmEdicao(false));
      return true;
    }

    return false;
  };

  const validarCamposObrigatoriosPlanoAula = dadosAlterados => {
    const errosPlanoAula = [];
    dadosAlterados.forEach(item => {
      const temDescricao = editorTemValor(item?.descricao);
      const dataAula = window.moment(item?.dataAula).format('DD/MM/YYYY');
      const ehAulaCj = item?.aulaCj;
      const objAprendObrigatorio =
        (ehAulaCj && item?.objetivosAprendizagemObrigatorios) ||
        (!ehAulaCj && !item?.objetivosAprendizagemOpcionais);

      if (!temDescricao) {
        errosPlanoAula.push(
          `${dataAula} - Meus objetivos e desenvolvimento da aula - O campo meus` +
            ` objetivos específicos para a aula é obrigatório.`
        );
      }
      if (
        !item?.idsObjetivosAprendizagemSelecionados?.length &&
        objAprendObrigatorio
      ) {
        errosPlanoAula.push(
          `${dataAula} - Objetivos de aprendizagem - É obrigatório selecionar ao ` +
            `menos um objetivo de aprendizagem.`
        );
      }
    });

    return errosPlanoAula;
  };

  const alterouAuditoriaPlanoAula = (dadosConsulta, dadosAtuais) => {
    const igualAlteradoEm =
      dadosConsulta?.alteradoEm === dadosAtuais?.alteradoEm;
    const igualCriadoEm = dadosAtuais?.criadoEm === dadosConsulta?.criadoEm;

    const naoTeveAlteracao = igualAlteradoEm && igualCriadoEm;
    return !naoTeveAlteracao;
  };

  const salvarPlanoAula = () => {
    const planosAlterados = dadosPlanoAula?.filter(item => item?.alterado);

    if (!planosAlterados?.length) {
      return true;
    }

    const errosPlanoAula = validarCamposObrigatoriosPlanoAula(planosAlterados);

    if (errosPlanoAula?.length) {
      setErrosPlanoAulaListao(errosPlanoAula);
      return false;
    }

    setExibirLoaderGeral(true);

    const planosParaSalvar = [];

    planosAlterados.forEach(plano => {
      const objetivosAprendizagemComponente = [];

      if (plano?.idsObjetivosAprendizagemSelecionados?.length) {
        plano.idsObjetivosAprendizagemSelecionados.forEach(id => {
          const dadosObj = listaObjetivosAprendizagem.find(
            item => item?.id === id
          );
          if (dadosObj) {
            objetivosAprendizagemComponente.push({
              componenteCurricularId: dadosObj.componenteCurricularId,
              id: dadosObj.id,
            });
          }
        });
      }

      const valorParaSalvar = {
        copiarConteudo: plano?.copiarConteudo,
        descricao: plano?.descricao,
        recuperacaoAula: plano?.recuperacaoAula,
        licaoCasa: plano?.licaoCasa,
        aulaId: plano?.aulaId,
        objetivosAprendizagemComponente,
        componenteCurricularId: componenteCurricular?.id,
        consideraHistorico,
      };

      const paramsPromise = new Promise(resolve => {
        ServicoPlanoAula.salvarPlanoAula(valorParaSalvar)
          .then(resposta => {
            if (resposta?.data) {
              resposta.data.planoTeveCopia = !!plano?.copiarConteudo;
            }
            resolve(resposta?.data);
          })
          .catch(listaErros => {
            if (listaErros?.response?.data?.mensagens?.length) {
              listaErros.response.data.mensagens.forEach(mensagem => {
                erro(
                  `${window
                    .moment(plano?.dataAula)
                    .format('DD/MM/YYYY')} - ${mensagem}`
                );
              });
            } else {
              erro('Ocorreu um erro interno.');
            }
            resolve(false);
          });
      });

      planosParaSalvar.push(paramsPromise);
    });

    return Promise.all(planosParaSalvar).then(async results => {
      const planosSalvos = results.filter(item => !!item?.aulaId);

      if (planosSalvos?.length) {
        const resposta = await ServicoPlanoAula.obterPlanoAulaPorPeriodoListao(
          turmaSelecionada?.turma,
          componenteCurricular?.codigoComponenteCurricular,
          componenteCurricular?.id,
          periodo?.dataInicio,
          periodo?.dataFim
        ).catch(e => erros(e));

        let msgSucesso = 'Plano(s) de aula salvo com sucesso';
        let msgSucessoCopia = '';
        const datasAulas = [];
        const datasAulasFezCopia = [];

        if (resposta?.data?.length) {
          const lista = resposta.data;
          montarIdsObjetivosSelecionadosListao(lista);

          planosSalvos.forEach(plano => {
            const planoAtual = dadosPlanoAula.find(
              item => item.aulaId === plano.aulaId
            );
            const indexPlano = dadosPlanoAula.indexOf(planoAtual);
            const planoAtualizado = lista.find(
              p => p.aulaId === planoAtual.aulaId
            );
            dadosPlanoAula[indexPlano] = { ...planoAtualizado };

            datasAulas.push(
              ` ${window.moment(planoAtual?.dataAula).format('DD/MM/YYYY')}`
            );

            if (plano?.planoTeveCopia) {
              datasAulasFezCopia.push(
                ` ${window.moment(planoAtual?.dataAula).format('DD/MM/YYYY')}`
              );
            }
          });

          lista.forEach(planoConsulta => {
            const planoAtualValidar = dadosPlanoAula.find(
              d => d.aulaId === planoConsulta.aulaId
            );

            if (planoAtualValidar) {
              const atualizarDados = alterouAuditoriaPlanoAula(
                planoConsulta,
                planoAtualValidar
              );
              if (atualizarDados) {
                const indexPlano = dadosPlanoAula.indexOf(planoAtualValidar);
                const planoAtualizado = lista.find(
                  p => p.aulaId === planoAtualValidar.aulaId
                );
                dadosPlanoAula[indexPlano] = { ...planoAtualizado };
              }
            }
          });

          msgSucesso = `${datasAulas.toString()} - Plano(s) de aula salvo com sucesso.`;
          if (datasAulasFezCopia?.length) {
            msgSucessoCopia = `${datasAulasFezCopia.toString()} - Plano(s) copiado com sucesso.`;
          }

          const dadosCarregar = _.cloneDeep(dadosPlanoAula);
          const dadosIniciais = _.cloneDeep(dadosPlanoAula);
          setDadosIniciaisPlanoAula(dadosIniciais);
          setDadosPlanoAula(dadosCarregar);

          setExibirLoaderGeral(false);
        } else {
          setExibirLoaderGeral(false);
        }

        sucesso(msgSucesso);

        if (msgSucessoCopia) sucesso(msgSucessoCopia);

        if (planosAlterados?.length === planosSalvos?.length) {
          dispatch(setTelaEmEdicao(false));
        }
        return true;
      }

      setExibirLoaderGeral(false);
      return false;
    });
  };

  const validarCamposObrigatoriosDiarioBordo = dadosAlterados => {
    const errosDiarioBordo = [];
    const qtdMinimaCaracteres = 200;
    dadosAlterados.forEach(item => {
      const planejamento = $(item?.planejamento);
      const textoAtualPlanejamento = planejamento?.text();
      if (!textoAtualPlanejamento) {
        errosDiarioBordo.push(`${item.titulo} - Planejamento é obrigatório`);
      }
      if (
        textoAtualPlanejamento &&
        textoAtualPlanejamento?.length < qtdMinimaCaracteres
      ) {
        errosDiarioBordo.push(
          `${item.titulo} - Preencher o planejamento com no mínimo 200 caracteres`
        );
      }
    });

    return errosDiarioBordo;
  };

  const salvarDiarioBordo = async clicouNoBotaoSalvar => {
    const dadosAlterados = dadosDiarioBordo.filter(item => item.alterado);

    if (idDiarioBordoAtual) {
      await salvarEditarObservacao(
        null,
        idDiarioBordoAtual,
        setExibirLoaderGeral
      );

      setIdDiarioBordoAtual();
      dispatch(limparDadosObservacoesUsuario());
      dispatch(setDadosObservacoesUsuario([]));
    }

    if (!dadosAlterados?.length) {
      return true;
    }

    const errosDiarioBordo = validarCamposObrigatoriosDiarioBordo(
      dadosAlterados
    );

    if (errosDiarioBordo?.length) {
      setErrosDiarioBordoListao(errosDiarioBordo);
      return false;
    }

    const paramsSalvar = dadosAlterados.map(diario => {
      return {
        id: diario?.diarioBordoId || 0,
        aulaId: diario?.aulaId,
        planejamento: diario?.planejamento,
        reflexoesReplanejamento: diario?.reflexoesReplanejamento,
        componenteCurricularId: componenteCurricularDiarioBordo,
      };
    });

    setExibirLoaderGeral(true);
    const resposta = await ServicoDiarioBordo.salvarDiarioBordoListao(
      paramsSalvar
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.status === 200) {
      if (clicouNoBotaoSalvar) {
        await obterDiarioBordoListao(
          turma,
          periodo,
          componenteCurricularDiarioBordo,
          setExibirLoaderGeral,
          setDadosDiarioBordo,
          setDadosIniciaisDiarioBordo
        );
      }

      sucesso('Diário de bordo registrado com sucesso');
      dispatch(setTelaEmEdicao(false));
      return true;
    }

    return false;
  };

  const montarBimestreParaSalvarAvaliacoes = () => {
    const dadosSalvar = _.cloneDeep(dadosAvaliacao);

    const bimestreParaMontar = dadosSalvar?.bimestres?.[0];
    const valorParaSalvar = [];

    const ehNota = dadosAvaliacao?.notaTipo === notasConceitos.Notas;
    const ehConceito = dadosAvaliacao?.notaTipo === notasConceitos.Conceitos;

    bimestreParaMontar.alunos.forEach(aluno => {
      aluno.notasAvaliacoes.forEach(nota => {
        if (nota.modoEdicao) {
          const avaliacaoNota = bimestreParaMontar.avaliacoes.find(
            a => a.id === nota.atividadeAvaliativaId
          );
          if (
            window.moment(avaliacaoNota.data) > window.moment(new Date()) &&
            !nota.notaConceito
          )
            return;
          valorParaSalvar.push({
            alunoId: aluno.id,
            atividadeAvaliativaId: nota?.atividadeAvaliativaId,
            conceito: ehConceito ? nota.notaConceito : null,
            nota: ehNota ? nota.notaConceito : null,
          });
        }
      });
    });
    return valorParaSalvar;
  };

  const salvarAvaliacoes = async clicouNoBotaoSalvar => {
    const valoresBimestresSalvar = [];
    valoresBimestresSalvar.push(...montarBimestreParaSalvarAvaliacoes());

    setExibirLoaderGeral(true);
    const resposta = await api
      .post(`v1/avaliacoes/notas`, {
        turmaId: turmaSelecionada.turma,
        disciplinaId: componenteCurricular?.codigoComponenteCurricular,
        notasConceitos: valoresBimestresSalvar,
      })
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resposta?.status === 200) {
      if (clicouNoBotaoSalvar) {
        await obterListaAlunosAvaliacaoListao(
          dadosPeriodosAvaliacao,
          bimestreOperacoes,
          turmaSelecionada,
          componenteCurricular,
          setExibirLoaderGeral,
          setDadosAvaliacao,
          setDadosIniciaisAvaliacao
        );
      }
      sucesso('Suas informações foram salvas com sucesso.');
      dispatch(setTelaEmEdicao(false));
      return true;
    }
    return false;
  };

  const acaoPosSalvarFechamento = (salvouFechamento, clicouNoBotaoSalvar) => {
    const limparFechamento = () => {
      setDadosIniciaisFechamento();
      setDadosFechamento();
    };

    if (salvouFechamento && !clicouNoBotaoSalvar) {
      limparFechamento();
    }

    return salvouFechamento;
  };

  const salvarFechamento = async (clicouNoBotaoSalvar, acaoPosSalvar) => {
    const posSalvar = clicouNoBotaoSalvar
      ? salvou => acaoPosSalvarFechamento(salvou, clicouNoBotaoSalvar)
      : acaoPosSalvar;

    const salvouFechamento = await validarSalvarFechamentoListao(
      turmaSelecionada.turma,
      dadosFechamento,
      bimestreOperacoes,
      setExibirLoaderGeral,
      setDadosModalJustificativaFechamento,
      componenteCurricular,
      posSalvar,
      setDadosFechamento,
      setDadosIniciaisFechamento
    );

    return acaoPosSalvarFechamento(salvouFechamento, clicouNoBotaoSalvar);
  };

  const onClickSalvarTabAtiva = (clicouNoBotaoSalvar, acaoPosSalvar) => {
    switch (tabAtual) {
      case LISTAO_TAB_FREQUENCIA:
        return salvarFrequencia();
      case LISTAO_TAB_PLANO_AULA:
        return salvarPlanoAula();
      case LISTAO_TAB_AVALIACOES:
        return salvarAvaliacoes(clicouNoBotaoSalvar);
      case LISTAO_TAB_DIARIO_BORDO:
        return salvarDiarioBordo(clicouNoBotaoSalvar);
      case LISTAO_TAB_FECHAMENTO:
        return salvarFechamento(clicouNoBotaoSalvar, acaoPosSalvar);

      default:
        return true;
    }
  };

  const validarSalvar = async acaoPosSalvar => {
    let salvou = true;
    if (!desabilitarBotoes && telaEmEdicao) {
      const confirmado = await pergutarParaSalvar();

      if (confirmado) {
        salvou = await onClickSalvarTabAtiva(false, acaoPosSalvar);
      } else {
        dispatch(setTelaEmEdicao(false));
      }
    }
    return salvou;
  };

  useEffect(() => {
    if (telaEmEdicao) {
      dispatch(
        setAcaoTelaEmEdicao(acaoPosSalvar => validarSalvar(acaoPosSalvar))
      );
    } else {
      dispatch(setLimparModoEdicaoGeral());
    }

  }, [telaEmEdicao]);

  const onClickVoltar = async () => {
    if (!desabilitarBotoes && telaEmEdicao) {
      const salvou = await validarSalvar(() => {
        history.push(RotasDto.LISTAO);
      });
      if (salvou) {
        history.push(RotasDto.LISTAO);
      }
    } else {
      history.push(RotasDto.LISTAO);
    }
  };

  const limparDadosFrequencia = () => {
    const dadosCarregar = _.cloneDeep(dadosIniciaisFrequencia);
    setDadosFrequencia({ ...dadosCarregar });
  };

  const limparDadosPlanoAula = () => {
    const dadosCarregar = _.cloneDeep(dadosIniciaisPlanoAula);
    setDadosPlanoAula([...dadosCarregar]);
  };

  const limparDadosAvaliacoes = () => {
    const dadosCarregar = _.cloneDeep(dadosIniciaisAvaliacao);
    setDadosAvaliacao({ ...dadosCarregar });
  };

  const limparDadosFechamento = () => {
    const dadosCarregar = _.cloneDeep(dadosIniciaisFechamento);
    setDadosFechamento({ ...dadosCarregar });
  };

  const limparDadosDiarioBordo = () => {
    setDadosDiarioBordo([]);
    setIdDiarioBordoAtual();
    dispatch(limparDadosObservacoesUsuario());
    dispatch(setDadosObservacoesUsuario([]));
    const dadosCarregar = _.cloneDeep(dadosIniciaisDiarioBordo);
    setDadosDiarioBordo([...dadosCarregar]);
  };

  const limparDadosTabSelecionada = () => {
    switch (tabAtual) {
      case LISTAO_TAB_FREQUENCIA:
        limparDadosFrequencia();
        break;
      case LISTAO_TAB_PLANO_AULA:
        limparDadosPlanoAula();
        break;
      case LISTAO_TAB_AVALIACOES:
        limparDadosAvaliacoes();
        break;
      case LISTAO_TAB_FECHAMENTO:
        limparDadosFechamento();
        break;
      case LISTAO_TAB_DIARIO_BORDO:
        limparDadosDiarioBordo();
        break;
      default:
        break;
    }
  };

  const onClickCancelar = async () => {
    if (telaEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        limparDadosTabSelecionada();
        dispatch(setTelaEmEdicao(false));
      }
    }
  };

  return (
    <Col span={24}>
      <Row gutter={[8, 8]} type="flex">
        <Col>
          <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Azul}
            border
            onClick={onClickCancelar}
            disabled={desabilitarBotoes || !telaEmEdicao}
          />
        </Col>
        <Col>
          <Button
            id={SGP_BUTTON_SALVAR}
            label="Salvar"
            color={Colors.Roxo}
            border
            bold
            onClick={() => {
              onClickSalvarTabAtiva(true);
            }}
            disabled={desabilitarBotoes || !telaEmEdicao}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesBotoesAcao;
