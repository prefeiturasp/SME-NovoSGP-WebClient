import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import {
  AnoLetivo,
  Dre,
  ExibirHistorico,
  PAAIResponsavel,
  Ue,
} from '~/componentes-sgp/inputs';
import { SituacaoItinerancia } from '@/@legacy/componentes-sgp/inputs/situacao-itinerancia';
import { OPCAO_TODOS } from '@/@legacy/constantes';

const RelatorioRegistroItineranciaForm = props => {
  const { form, onChangeCampos } = props;

  const dreCodigo = form?.values?.dreCodigo;

  const desabilitarResponsavelPAAI = !dreCodigo || dreCodigo === OPCAO_TODOS;

  return (
    <Col sm={24}>
      <Row gutter={[16, 8]}>
        <Col sm={24}>
          <ExibirHistorico form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} onChange={() => onChangeCampos()} />
        </Col>
        <Col sm={24} md={24} lg={10}>
          <Dre form={form} onChange={() => onChangeCampos()} />
        </Col>
        <Col sm={24} md={24} lg={10}>
          <Ue form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={12}>
          <SituacaoItinerancia
            multiple
            name="situacaoIds"
            form={form}
            onChange={() => onChangeCampos()}
          />
        </Col>
        <Col sm={24} md={12}>
          <PAAIResponsavel
            label="PAAI"
            multiple
            form={form}
            name="codigosPAAIResponsavel"
            onChange={onChangeCampos}
            disabled={desabilitarResponsavelPAAI}
            responsaveisAEE={false}
          />
        </Col>
      </Row>
    </Col>
  );
};

RelatorioRegistroItineranciaForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioRegistroItineranciaForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioRegistroItineranciaForm;
