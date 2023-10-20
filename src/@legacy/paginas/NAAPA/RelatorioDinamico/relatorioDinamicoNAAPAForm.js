import { AnoEscolar } from '@/@legacy/componentes-sgp/inputs/anoEscolar';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  AnoLetivo,
  Dre,
  ExibirHistorico,
  Modalidade,
  Semestre,
  Ue,
} from '~/componentes-sgp/inputs';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';
import RelatorioDinamicoNAAPAFormDinamico from './relatorioDinamicoNAAPAFormDinamico';
import RelatorioDinamicoNAAPALista from './relatorioDinamicoNAAPALista';

const RelatorioDinamicoNAAPAForm = props => {
  const { form } = props;

  const {
    setDesabilitarGerar,
    setGerandoRelatorio,
    desabilitarGerar,
    initialValues,
  } = useContext(RelatorioDinamicoNAAPAContext);

  const dadosQuestionario = [{ questionarioId: 1, secaoId: 1, id: 1 }];

  return (
    <Row gutter={[0, 24]}>
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

          <Col xs={24} sm={12} md={8}>
            <Modalidade form={form} />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Semestre form={form} />
          </Col>

          <Col xs={24} sm={10}>
            <AnoEscolar form={form} multiple name="anosEscolaresCodigos" />
          </Col>
          <Col xs={24}>
            <RelatorioDinamicoNAAPAFormDinamico
              form={form}
              dadosQuestionario={dadosQuestionario}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Row gutter={[16, 16]}>
          <RelatorioDinamicoNAAPALista
            form={form}
            dadosQuestionario={dadosQuestionario}
            initialValues={initialValues}
            desabilitarGerar={desabilitarGerar}
            setGerandoRelatorio={setGerandoRelatorio}
            setDesabilitarGerar={setDesabilitarGerar}
          />
        </Row>
      </Col>
    </Row>
  );
};

RelatorioDinamicoNAAPAForm.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPAForm.defaultProps = {
  form: null,
};

export default RelatorioDinamicoNAAPAForm;
