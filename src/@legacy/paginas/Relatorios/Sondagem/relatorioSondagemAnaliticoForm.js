import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import { AnoLetivo, Dre, ExibirHistorico, Ue } from '~/componentes-sgp/inputs';
import { TipoSondagem } from '~/componentes-sgp/inputs/tipo-sondagem';
import { PeriodoSondagem } from '~/componentes-sgp/inputs/periodo-sondagem';

const RelatorioSondagemAnaliticoForm = props => {
  const { form, onChangeCampos } = props;

  const consideraHistorico = !!form.values?.consideraHistorico;

  const anoAtual = window.moment().format('YYYY');

  let anosLetivos = [];

  if (consideraHistorico) {
    let ano = anoAtual;
    for (let i = 2019; i < anoAtual; i++) {
      ano = ano - 1;
      if (ano !== 2020) {
        // Não existiu sondagem em 2020
        anosLetivos.push({
          valor: ano,
          desc: ano,
        });
      }
    }
  } else {
    anosLetivos = [{ desc: anoAtual, valor: anoAtual }];
  }

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <ExibirHistorico form={form} onChange={() => onChangeCampos()} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <AnoLetivo
            form={form}
            onChange={() => onChangeCampos()}
            defaultDataList={anosLetivos}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue form={form} onChange={() => onChangeCampos()} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <TipoSondagem form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={12}>
          <PeriodoSondagem form={form} onChange={() => onChangeCampos()} />
        </Col>
      </Row>
    </Col>
  );
};

RelatorioSondagemAnaliticoForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioSondagemAnaliticoForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioSondagemAnaliticoForm;
