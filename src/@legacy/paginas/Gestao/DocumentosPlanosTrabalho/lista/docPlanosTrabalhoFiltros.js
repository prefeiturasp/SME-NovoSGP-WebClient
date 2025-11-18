import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { AnoLetivo, Dre, ExibirHistorico, Ue } from '~/componentes-sgp/inputs';
import { ClassificacaoDocumento } from '~/componentes-sgp/inputs/classificacaoDocumento';
import { TipoDocumento } from '~/componentes-sgp/inputs/tipoDocumento';
import DocPlanosTrabalhoListaPaginada from './docPlanosTrabalhoListaPaginada';

const DocPlanosTrabalhoFiltros = props => {
  const { form } = props;

  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Row>
            <ExibirHistorico form={form} />
          </Row>
        </Col>

        <Col xs={24} sm={8} md={4}>
          <AnoLetivo form={form} />
        </Col>

        <Col xs={24} sm={24} md={10}>
          <Dre form={form} />
        </Col>

        <Col xs={24} sm={24} md={10}>
          <Ue form={form} />
        </Col>

        <Col xs={24} sm={12}>
          <TipoDocumento form={form} />
        </Col>

        <Col xs={24} sm={12}>
          <ClassificacaoDocumento form={form} />
        </Col>
        <Col xs={24}>
          <DocPlanosTrabalhoListaPaginada form={form} />
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
