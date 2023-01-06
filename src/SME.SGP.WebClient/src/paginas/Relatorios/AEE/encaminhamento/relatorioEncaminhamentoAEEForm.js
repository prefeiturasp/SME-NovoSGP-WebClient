import PropTypes from 'prop-types';
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
  PAAIResponsavel,
} from '~/componentes-sgp/inputs';
import { ExibirEncaminhamentosEncerrados } from '~/componentes-sgp/inputs/exibir-encaminhamentos-encerrados';
import { SituacaoEncaminhamentoAEE } from '~/componentes-sgp/inputs/situacao-encaminhamento-aee';
import { OPCAO_TODOS } from '~/constantes';
import { situacaoAEE } from '~/dtos';

const RelatorioEncaminhamentoAEEForm = props => {
  const { form, onChangeCampos } = props;

  const atualizarSituacoes = situacoes => {
    const novasListaSituacoes = situacoes.filter(
      situacao => situacao.codigo !== situacaoAEE.EncerradoAutomaticamente
    );

    return novasListaSituacoes;
  };

  const dreCodigo = form?.values?.dreCodigo;
  const situacaoIds = form?.values?.situacaoIds;

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
          <ExibirHistorico form={form} onChange={onChangeCampos} />
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
          <SituacaoEncaminhamentoAEE
            form={form}
            onChange={onChangeCampos}
            updateData={atualizarSituacoes}
            name="situacaoIds"
          />
        </Col>

        <Col sm={24} md={10}>
          <ExibirEncaminhamentosEncerrados
            form={form}
            onChange={onChangeCampos}
            name="exibirEncerrados"
            disabled={!!situacaoIds?.length}
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

RelatorioEncaminhamentoAEEForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioEncaminhamentoAEEForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioEncaminhamentoAEEForm;
