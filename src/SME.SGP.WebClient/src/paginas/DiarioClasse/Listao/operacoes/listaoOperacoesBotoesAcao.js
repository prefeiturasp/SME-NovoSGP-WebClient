import { Col, Row } from 'antd';
import $ from 'jquery';
import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { RotasDto } from '~/dtos';
import {
  setAcaoTelaEmEdicao,
  setLimparModoEdicaoGeral,
  setTelaEmEdicao,
} from '~/redux/modulos/geral/actions';
import { confirmar, erro, erros, history, sucesso } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ServicoPlanoAula from '~/servicos/Paginas/DiarioClasse/ServicoPlanoAula';
import {
  LISTAO_TAB_AVALIACOES,
  LISTAO_TAB_DIARIO_BORDO,
  LISTAO_TAB_FECHAMENTO,
  LISTAO_TAB_FREQUENCIA,
  LISTAO_TAB_PLANO_AULA,
} from '../listaoConstantes';
import ListaoContext from '../listaoContext';
import { montarIdsObjetivosSelecionadosListao } from '../listaoFuncoes';

const ListaoOperacoesBotoesAcao = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { consideraHistorico } = turmaSelecionada;

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
      const descricao = $(item?.descricao);

      const textoAtualPlanoAula = descricao?.text();
      if (!textoAtualPlanoAula) {
        const dataAula = window.moment(item?.dataAula).format('DD/MM/YYYY');
        errosPlanoAula.push(`${dataAula} - Descrição é obrigatória`);
      }
    });

    return errosPlanoAula;
  };

  const salvarDiarioBordo = () => {};

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
          periodo?.dataInicio,
          periodo?.dataFim
        ).catch(e => erros(e));

        let msgSucesso = 'Plano(s) de aula salvo com sucesso.';
        const datasAulas = [];

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
          });

          msgSucesso = `${datasAulas.toString()} - Plano(s) de aula salvo com sucesso.`;

          const dadosCarregar = _.cloneDeep(dadosPlanoAula);
          const dadosIniciais = _.cloneDeep(dadosPlanoAula);
          setDadosIniciaisPlanoAula(dadosIniciais);
          setDadosPlanoAula(dadosCarregar);

          setExibirLoaderGeral(false);
        } else {
          setExibirLoaderGeral(false);
        }

        sucesso(msgSucesso);
        return true;
      }

      setExibirLoaderGeral(false);
      return false;
    });
  };

  const onClickSalvarTabAtiva = clicouNoBotao => {
    switch (tabAtual) {
      case LISTAO_TAB_FREQUENCIA:
        return salvarFrequencia();
      case LISTAO_TAB_PLANO_AULA:
        return salvarPlanoAula();
      case LISTAO_TAB_DIARIO_BORDO:
        return salvarDiarioBordo(clicouNoBotao);

      default:
        return true;
    }
  };

  const validarSalvar = async () => {
    let salvou = true;
    if (!desabilitarBotoes && telaEmEdicao) {
      const confirmado = await pergutarParaSalvar();

      if (confirmado) {
        salvou = await onClickSalvarTabAtiva();
      } else {
        dispatch(setTelaEmEdicao(false));
      }
    }
    return salvou;
  };

  useEffect(() => {
    if (telaEmEdicao) {
      dispatch(setAcaoTelaEmEdicao(validarSalvar));
    } else {
      dispatch(setLimparModoEdicaoGeral());
    }
  }, [dispatch, telaEmEdicao]);

  const onClickVoltar = async () => {
    if (!desabilitarBotoes && telaEmEdicao) {
      const salvou = await validarSalvar();
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
    setDadosPlanoAula({ ...dadosCarregar });
  };
  const limparDadosAvaliacoes = () => {};
  const limparDadosFechamento = () => {};
  const limparDadosDiarioBordo = () => {};

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
      <Row gutter={[16, 16]} type="flex" justify="end">
        <Col>
          <Button
            id={SGP_BUTTON_VOLTAR}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            onClick={onClickVoltar}
          />
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
            onClick={() => onClickSalvarTabAtiva(true)}
            disabled={desabilitarBotoes || !telaEmEdicao}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesBotoesAcao;
