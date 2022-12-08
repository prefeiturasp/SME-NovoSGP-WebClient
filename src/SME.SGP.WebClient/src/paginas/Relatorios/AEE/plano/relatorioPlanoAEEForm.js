/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React from 'react';
import {
  ExibirHistorico,
  AnoLetivo,
  Dre,
  Ue,
  Modalidade,
  Semestre,
  Turma,
  ExibirPlanosEncerrados,
  SituacaoPlano,
  Responsavel,
  PAAIResponsavel,
} from '~/componentes-sgp/inputs';

const RelatorioPlanoAEEForm = props => {
  const { form, onChangeCampos } = props;

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <ExibirHistorico form={form} />
        </Col>

        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre form={form} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue form={form} />
        </Col>

        <Col sm={24} md={12} lg={8}>
          <Modalidade form={form} />
        </Col>

        <Col sm={24} md={12} lg={8}>
          <Semestre form={form} />
        </Col>

        <Col sm={24} md={12} lg={8}>
          <Turma form={form} />
        </Col>

        <Col sm={24} md={12}>
          <SituacaoPlano form={form} />
        </Col>

        <Col sm={24} md={12}>
          <ExibirPlanosEncerrados form={form} />
        </Col>

        <Col sm={24} md={12}>
          <Responsavel form={form} />
        </Col>

        <Col sm={24} md={12}>
          <PAAIResponsavel form={form} />
        </Col>
      </Row>
    </Col>
  );
};

export default RelatorioPlanoAEEForm;
