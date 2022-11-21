import { Row, Col } from 'antd';
import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { SelectComponent } from '~/componentes';
import ObjectCardEstudante from '~/componentes-sgp/ObjectCardEstudante/objectCardEstudante';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';
import MontarDadosTabs from './componentes/montarDadosTabs/montarDadosTabs';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { store } from '~/redux';
import { setDadosEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { erros } from '~/servicos';

const CadastroEncaminhamentoNAAPA = () => {
  const routeMatch = useRouteMatch();

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
    const resposta = await ServicoNAAPA.obterDadosEncaminhamentoNAAPA(
      encaminhamentoId
    ).catch(e => erros(e));

    if (resposta?.data?.length) {
      store.dispatch(setDadosEncaminhamentoNAAPA(resposta.data));
    } else {
      store.dispatch(setDadosEncaminhamentoNAAPA([]));
    }
  }, [encaminhamentoId]);

  useEffect(() => {
    if (encaminhamentoId) {
      obterDadosEncaminhamentoNAAPA();
    } else if (novoEncaminhamentoNAAPADados?.aluno?.codigoAluno) {
      store.dispatch(setDadosEncaminhamentoNAAPA(novoEncaminhamentoNAAPADados));
    }
  }, [
    encaminhamentoId,
    novoEncaminhamentoNAAPADados,
    obterDadosEncaminhamentoNAAPA,
  ]);

  return dadosEncaminhamentoNAAPA?.aluno?.codigoAluno ? (
    <>
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
            exibirFrequencia={false}
            exibirBotaoImprimir={false}
            permiteAlterarImagem={false}
            anoLetivo={dadosEncaminhamentoNAAPA.anoLetivo}
            codigoTurma={dadosEncaminhamentoNAAPA.turma?.codigo}
            codigoAluno={dadosEncaminhamentoNAAPA.aluno?.codigoAluno}
          />
        </Col>
      </Row>

      <Row>
        <Col sm={24}>
          <MontarDadosTabs
            anoLetivo={dadosEncaminhamentoNAAPA.anoLetivo}
            codigoTurma={dadosEncaminhamentoNAAPA.turma?.codigo}
            codigoAluno={dadosEncaminhamentoNAAPA.aluno?.codigoAluno}
          />
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default CadastroEncaminhamentoNAAPA;
