import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { Dre, Ue } from '~/componentes-sgp/inputs';
import { SituacaoEncaminhamentoNAAPA } from '~/componentes-sgp/inputs/situacao-encaminhamento-naapa';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import { ExibirEncaminhamentosEncerrados } from '~/componentes-sgp/inputs/exibir-encaminhamentos-encerrados';
import { PortaEntradaNAAPA } from '~/componentes-sgp/inputs/porta-entrada-naapa';
import { FluxoAlertaNAAPA } from '~/componentes-sgp/inputs/fluxo-alerta-naapa';

const RelatorioEncaminhamentoNAAPAForm = props => {
  const { form, onChangeCampos } = props;

  const situacaoIds = form?.values?.situacaoIds;

  const atualizarSituacoes = situacoes => {
    const novasListaSituacoes = situacoes.filter(
      situacao => situacao.id !== situacaoNAAPA.Encerrado
    );

    return novasListaSituacoes;
  };

  useEffect(() => {
    if (form?.setFieldValue && situacaoIds?.length) {
      form.setFieldValue('exibirEncerrados', false);
    }
  }, [situacaoIds]);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <Dre form={form} onChange={value => onChangeCampos(value)} />
        </Col>
        <Col sm={24} md={12}>
          <Ue form={form} onChange={value => onChangeCampos(value)} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <SituacaoEncaminhamentoNAAPA
            form={form}
            onChange={values => onChangeCampos(values)}
            updateData={atualizarSituacoes}
          />
        </Col>
        <Col sm={24} md={12}>
          <ExibirEncaminhamentosEncerrados
            form={form}
            onChange={value => onChangeCampos(value)}
            name="exibirEncerrados"
            disabled={!!situacaoIds?.length}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <PortaEntradaNAAPA
            form={form}
            onChange={values => onChangeCampos(values)}
          />
        </Col>
        <Col sm={24} md={12}>
          <FluxoAlertaNAAPA
            form={form}
            onChange={values => onChangeCampos(values)}
          />
        </Col>
      </Row>
    </Col>
  );
};

RelatorioEncaminhamentoNAAPAForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioEncaminhamentoNAAPAForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioEncaminhamentoNAAPAForm;
