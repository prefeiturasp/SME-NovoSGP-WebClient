import { Col, Row } from 'antd';
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
import { confirmar, erros, history, sucesso } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import {
  LISTAO_TAB_AVALIACOES,
  LISTAO_TAB_DIARIO_BORDO,
  LISTAO_TAB_FECHAMENTO,
  LISTAO_TAB_FREQUENCIA,
  LISTAO_TAB_PLANO_AULA,
} from '../listaoConstantes';
import ListaoContext from '../listaoContext';

const ListaoOperacoesBotoesAcao = () => {
  const dispatch = useDispatch();
  const {
    dadosFrequencia,
    dadosIniciaisFrequencia,
    tabAtual,
    setDadosFrequencia,
    setExibirLoaderGeral,
    setDadosIniciaisFrequencia,
    somenteConsultaListao,
    periodoAbertoListao,
  } = useContext(ListaoContext);

  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);

  const desabilitarBotoes = !periodoAbertoListao || somenteConsultaListao;

  const pergutarParaSalvar = () =>
    confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );

  const onClickSalvar = async () => {
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

  const validarSalvar = async () => {
    let salvou = true;
    if (!desabilitarBotoes && telaEmEdicao) {
      const confirmado = await pergutarParaSalvar();

      if (confirmado) {
        salvou = await onClickSalvar();
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

  const limparDadosPlanoAula = () => {};
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
            onClick={onClickSalvar}
            disabled={desabilitarBotoes || !telaEmEdicao}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesBotoesAcao;
