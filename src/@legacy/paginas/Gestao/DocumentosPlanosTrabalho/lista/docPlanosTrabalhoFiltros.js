import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import { ExibirHistorico, AnoLetivo, Dre, Ue } from '~/componentes-sgp/inputs';
import { ClassificacaoDocumento } from '~/componentes-sgp/inputs/classificacaoDocumento';
import { TipoDocumento } from '~/componentes-sgp/inputs/tipoDocumento';

const DocPlanosTrabalhoFiltros = props => {
  const { form } = props;

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <ExibirHistorico form={form} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} />
        </Col>
        <Col sm={24} md={24} lg={10}>
          <Dre form={form} mostrarOpcaoTodas={false} />
        </Col>
        <Col sm={24} md={24} lg={10}>
          <Ue form={form} mostrarOpcaoTodas={false} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <TipoDocumento form={form} />
        </Col>
        <Col sm={24} md={12}>
          <ClassificacaoDocumento form={form} />
        </Col>
      </Row>
    </Col>
  );
};

DocPlanosTrabalhoFiltros.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

DocPlanosTrabalhoFiltros.defaultProps = {
  form: null,
};

export default DocPlanosTrabalhoFiltros;
