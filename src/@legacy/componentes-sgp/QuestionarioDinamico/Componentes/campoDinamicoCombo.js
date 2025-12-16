import PropTypes from 'prop-types';
import React from 'react';
import SelectComponent from '~/componentes/select';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';
import { Col, Row, Typography } from 'antd';

const CampoDinamicoCombo = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const lista = questaoAtual?.opcaoResposta.map(item => {
    return { label: item.nome, value: item.id };
  });

  let opcionais = {};

  try {
    opcionais = JSON.parse(questaoAtual?.opcionais || '{}');
  } catch {
    opcionais = {};
  }

  return (
    <ColunaDimensionavel
      dimensao={
        opcionais?.titulo || opcionais?.subtitulo ? 12 : questaoAtual?.dimensao
      }
    >
      {opcionais?.titulo && (
        <Row gutter={[16, 16]} className="mt-2">
          <Col xs={24}>
            <Typography.Title className="mb-3" level={4}>
              {opcionais.titulo}
            </Typography.Title>
          </Col>
        </Row>
      )}
      {opcionais?.subtitulo && (
        <Row gutter={[16, 24]} className="mb-32">
          <Col xs={24}>
            <Typography.Text>{opcionais.subtitulo}</Typography.Text>
          </Col>
        </Row>
      )}

      {label}

      <SelectComponent
        id={id}
        form={form}
        lista={lista}
        valueText="label"
        valueOption="value"
        name={String(questaoAtual.id)}
        placeholder={questaoAtual?.placeHolder}
        disabled={desabilitado || questaoAtual.somenteLeitura}
        onChange={valorAtualSelecionado => {
          onChange(valorAtualSelecionado);
        }}
      />
    </ColunaDimensionavel>
  );
};

CampoDinamicoCombo.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoCombo.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoCombo;
