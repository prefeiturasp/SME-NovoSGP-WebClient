import { AnoEscolar } from '@/@legacy/componentes-sgp/inputs/anoEscolar';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import {
  AnoLetivo,
  Dre,
  ExibirHistorico,
  Modalidade,
  Ue,
} from '~/componentes-sgp/inputs';
import RelatorioDinamicoNAAPAFormDinamico from './formDinamico/relatorioDinamicoNAAPAFormDinamico';

const RelatorioDinamicoNAAPAForm = props => {
  const { form } = props;

  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <ExibirHistorico form={form} />
        </Col>

        <Col xs={24} sm={8} md={4}>
          <AnoLetivo form={form} />
        </Col>

        <Col xs={24} sm={24} md={10}>
          <Dre form={form} />
        </Col>

        <Col xs={24} sm={24} md={10}>
          <Ue form={form} parametrosOpcionais="&consideraNovasUEs=true" />
        </Col>

        <Col xs={24} sm={12} lg={14}>
          <Modalidade form={form} multiple />
        </Col>

        <Col xs={24} sm={12} lg={10}>
          <AnoEscolar
            form={form}
            multiple
            name="anosEscolaresCodigos"
            validarSemestre={false}
          />
        </Col>

        <Col xs={24}>
          <RelatorioDinamicoNAAPAFormDinamico form={form} />
        </Col>
      </Row>
    </Col>
  );
};

RelatorioDinamicoNAAPAForm.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPAForm.defaultProps = {
  form: null,
};

export default RelatorioDinamicoNAAPAForm;
