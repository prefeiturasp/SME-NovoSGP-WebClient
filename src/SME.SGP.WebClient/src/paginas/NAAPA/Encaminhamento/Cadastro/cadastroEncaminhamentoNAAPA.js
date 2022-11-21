import { Row, Col } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { SelectComponent } from '~/componentes';
import ObjectCardEstudante from '~/componentes-sgp/ObjectCardEstudante/objectCardEstudante';
import { SGP_SELECT_DRE, SGP_SELECT_UE } from '~/constantes/ids/select';

const CadastroEncaminhamentoNAAPA = () => {
  const routeMatch = useRouteMatch();

  const encaminhamentoId = routeMatch.params?.id;

  // TODO: Mudar para dinamico
  const anoLetivo = 2022;

  const dre = useSelector(state => state.localizarEstudante.dre);
  const ue = useSelector(state => state.localizarEstudante.ue);
  const turma = useSelector(state => state.localizarEstudante.turma);
  const codigoAluno = useSelector(
    state => state.localizarEstudante.codigoAluno
  );

  const listaDres = dre ? [dre] : [];
  const listaUes = ue ? [ue] : [];

  return (
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
            valueSelect={dre?.codigo}
            label="Diretoria Regional de Educação (DRE)"
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
            valueSelect={ue?.codigo}
          />
        </Col>
      </Row>

      {codigoAluno && (
        <Row>
          <Col sm={24}>
            <ObjectCardEstudante
              codigoAluno={codigoAluno}
              anoLetivo={anoLetivo}
              codigoTurma={turma?.codigo}
              exibirBotaoImprimir={false}
              exibirFrequencia={false}
              permiteAlterarImagem={false}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default CadastroEncaminhamentoNAAPA;
