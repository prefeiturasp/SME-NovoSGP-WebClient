/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
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
import { OPCAO_TODOS } from '~/constantes';
import { situacaoPlanoAEE } from '~/dtos';

const RelatorioPlanoAEEForm = props => {
  const { form, onChangeCampos } = props;

  const atualizarSituacoes = situacoes => {
    const novasListaSituacoes = situacoes.filter(
      situacao =>
        situacao.codigo !== situacaoPlanoAEE.Encerrado &&
        situacao.codigo !== situacaoPlanoAEE.EncerradoAutomaticamento
    );

    return novasListaSituacoes;
  };

  const ueCodigo = form?.values?.ueCodigo;
  const dreCodigo = form?.values?.dreCodigo;
  const situacaoIds = form?.values?.situacaoIds;

  const desabilitarResponsavel = !ueCodigo || ueCodigo === OPCAO_TODOS;
  const desabilitarResponsavelPAAI = !dreCodigo || dreCodigo === OPCAO_TODOS;

  useEffect(() => {
    if (form?.setFieldValue && situacaoIds?.length) {
      form.setFieldValue('exibirEncerrados', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [situacaoIds]);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <ExibirHistorico form={form} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue form={form} onChange={onChangeCampos} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={12} lg={8}>
          <Modalidade form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={12} lg={6}>
          <Semestre form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} lg={10}>
          <Turma
            form={form}
            onChange={onChangeCampos}
            name="codigosTurma"
            multiple
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={14}>
          <SituacaoPlano
            form={form}
            onChange={onChangeCampos}
            updateData={atualizarSituacoes}
            name="situacaoIds"
          />
        </Col>

        <Col sm={24} md={10}>
          <ExibirPlanosEncerrados
            form={form}
            onChange={onChangeCampos}
            name="exibirEncerrados"
            disabled={!!situacaoIds?.length}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <Responsavel
            multiple
            form={form}
            name="codigosResponsavel"
            onChange={onChangeCampos}
            disabled={desabilitarResponsavel}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <PAAIResponsavel
            multiple
            form={form}
            name="codigosPAAIResponsavel"
            onChange={onChangeCampos}
            disabled={desabilitarResponsavelPAAI}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default RelatorioPlanoAEEForm;
