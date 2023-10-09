import { AnoEscolar } from '@/@legacy/componentes-sgp/inputs/anoEscolar';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import {
  AnoLetivo,
  Dre,
  ExibirHistorico,
  Modalidade,
  Semestre,
  Ue,
} from '~/componentes-sgp/inputs';
import RelatorioDinamicoNAAPALista from './relatorioDinamicoNAAPALista';
import RelatorioDinamicoNAAPAFormDinamico from './relatorioDinamicoNAAPAFormDinamico';

const RelatorioDinamicoNAAPAForm = props => {
  const { form, onChangeCampos } = props;

  const dadosQuestionario = [{ questionarioId: 1, secaoId: 1, id: 1 }];

  return (
    <Row gutter={[0, 24]}>
      <Col xs={24}>
        <Row gutter={[16, 8]}>
          <Col xs={24}>
            <ExibirHistorico form={form} onChange={() => onChangeCampos()} />
          </Col>

          <Col xs={24} sm={8} md={4}>
            <AnoLetivo form={form} onChange={() => onChangeCampos()} />
          </Col>

          <Col xs={24} sm={24} md={10}>
            <Dre form={form} onChange={() => onChangeCampos()} />
          </Col>

          <Col xs={24} sm={24} md={10}>
            <Ue form={form} onChange={() => onChangeCampos()} />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Modalidade form={form} onChange={() => onChangeCampos()} />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Semestre form={form} onChange={() => onChangeCampos()} />
          </Col>

          <Col xs={24} sm={10}>
            <AnoEscolar
              form={form}
              onChange={() => onChangeCampos()}
              multiple
              name="anosEscolaresCodigos"
            />
          </Col>
          <Col xs={24}>
            <RelatorioDinamicoNAAPAFormDinamico
              form={form}
              onChangeCampos={() => onChangeCampos()}
              dadosQuestionario={dadosQuestionario}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Row gutter={[16, 8]}>
          <RelatorioDinamicoNAAPALista
            form={form}
            dadosQuestionario={dadosQuestionario}
          />
        </Row>
      </Col>
    </Row>
  );
};

RelatorioDinamicoNAAPAForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioDinamicoNAAPAForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioDinamicoNAAPAForm;
