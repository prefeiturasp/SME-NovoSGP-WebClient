import { Row, Col } from 'antd';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { SelectComponent } from '~/componentes';
import ObjectCardEstudante from '~/componentes-sgp/ObjectCardEstudante/objectCardEstudante';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';
import MontarDadosTabs from './componentes/montarDadosTabs/montarDadosTabs';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { store } from '~/redux';
import {
  setDadosEncaminhamentoNAAPA,
  setDadosSituacaoEncaminhamentoNAAPA,
  setExibirLoaderEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';
import ModalErrosQuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/Componentes/ModalErrosQuestionarioDinamico/modalErrosQuestionarioDinamico';
import LabelSituacao from './componentes/labelSituacao';

const CadastroEncaminhamentoNAAPA = () => {
  const routeMatch = useRouteMatch();
  const dispatch = useDispatch();

  const encaminhamentoId = routeMatch.params?.id;

  const novoEncaminhamentoNAAPADados = useSelector(
    state => state.localizarEstudante
  );

  const dadosEncaminhamentoNAAPA = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const listaDres = dadosEncaminhamentoNAAPA
    ? [dadosEncaminhamentoNAAPA.dre]
    : [];
  const listaUes = dadosEncaminhamentoNAAPA
    ? [dadosEncaminhamentoNAAPA.ue]
    : [];

  const obterDadosEncaminhamentoNAAPA = useCallback(async () => {
    dispatch(setExibirLoaderEncaminhamentoNAAPA(true));
    const resposta = await ServicoNAAPA.obterDadosEncaminhamentoNAAPA(
      encaminhamentoId
    ).catch(e => erros(e));

    if (resposta?.data) {
      const dados = resposta.data;

      dados.dre = {
        codigo: dados?.dreCodigo,
        nome: dados?.dreNome,
        id: dados?.dreId,
      };
      dados.ue = {
        codigo: dados?.ueCodigo,
        nome: dados?.ueNome,
        id: dados?.ueId,
      };
      dados.turma = {
        codigo: dados?.turmaCodigo,
        nome: dados?.turmaNome,
        id: dados?.turmaId,
      };

      const dadosSituacao = {
        situacao: dados.situacao,
        descricaoSituacao: dados.descricaoSituacao,
      };
      store.dispatch(setDadosSituacaoEncaminhamentoNAAPA(dadosSituacao));

      store.dispatch(setDadosEncaminhamentoNAAPA(dados));
    } else {
      store.dispatch(setDadosEncaminhamentoNAAPA([]));
      store.dispatch(setDadosSituacaoEncaminhamentoNAAPA(null));
    }
    dispatch(setExibirLoaderEncaminhamentoNAAPA(false));
  }, [dispatch, encaminhamentoId]);

  useEffect(() => {
    if (encaminhamentoId) {
      obterDadosEncaminhamentoNAAPA();
    } else if (novoEncaminhamentoNAAPADados?.aluno?.codigoAluno) {
      const turmaAluno = novoEncaminhamentoNAAPADados?.aluno?.turma;
      const modalidade = novoEncaminhamentoNAAPADados?.aluno?.modalidade;

      store.dispatch(
        setDadosEncaminhamentoNAAPA({
          ...novoEncaminhamentoNAAPADados,
          turma: turmaAluno,
          modalidade,
        })
      );
    }
  }, [
    encaminhamentoId,
    novoEncaminhamentoNAAPADados,
    obterDadosEncaminhamentoNAAPA,
  ]);

  return dadosEncaminhamentoNAAPA?.aluno?.codigoAluno ? (
    <>
      <Row gutter={[16, 0]} type="flex" justify="end">
        <Col>
          <LabelSituacao />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} lg={12}>
          <SelectComponent
            disabled
            valueText="nome"
            id={SGP_SELECT_DRE}
            valueOption="codigo"
            lista={listaDres || []}
            placeholder="Selecione uma DRE"
            label="Diretoria Regional de Educação (DRE)"
            valueSelect={dadosEncaminhamentoNAAPA.dre?.codigo}
          />
        </Col>

        <Col sm={24} lg={12}>
          <SelectComponent
            disabled
            valueText="nome"
            id={SGP_SELECT_UE}
            valueOption="codigo"
            lista={listaUes || []}
            label="Unidade Escolar (UE)"
            placeholder="Selecione uma UE"
            valueSelect={dadosEncaminhamentoNAAPA.ue?.codigo}
          />
        </Col>
      </Row>

      <Row>
        <Col sm={24}>
          <ObjectCardEstudante
            consultarFrequenciaGlobal
            exibirFrequencia
            exibirBotaoImprimir={false}
            permiteAlterarImagem={false}
            anoLetivo={dadosEncaminhamentoNAAPA?.anoLetivo}
            codigoTurma={dadosEncaminhamentoNAAPA?.turma?.codigo}
            codigoAluno={dadosEncaminhamentoNAAPA?.aluno?.codigoAluno}
            dadosIniciais={
              encaminhamentoId && dadosEncaminhamentoNAAPA?.aluno?.turmaEscola
                ? dadosEncaminhamentoNAAPA?.aluno
                : null
            }
          />
        </Col>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Col sm={24}>
          <ModalErrosQuestionarioDinamico />

          <MontarDadosTabs
            anoLetivo={dadosEncaminhamentoNAAPA?.anoLetivo}
            codigoTurma={dadosEncaminhamentoNAAPA?.turma?.codigo}
            codigoAluno={dadosEncaminhamentoNAAPA?.aluno?.codigoAluno}
          />
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default CadastroEncaminhamentoNAAPA;