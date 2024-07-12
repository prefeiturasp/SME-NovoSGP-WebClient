import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { AnoLetivo, Dre, ExibirHistorico, Ue } from '~/componentes-sgp/inputs';
import { TipoSondagem } from '~/componentes-sgp/inputs/tipo-sondagem';
import { PeriodoSondagem } from '~/componentes-sgp/inputs/periodo-sondagem';
import { FiltroHelper } from '~/componentes-sgp';
import { CheckboxComponent } from '~/componentes';
import { SGP_CHECKBOX_EXIBIR_TURMAS_SEM_LANCAMENTO } from '~/constantes/ids/checkbox';

const RelatorioSondagemAnaliticoForm = props => {
  const { form, onChangeCampos } = props;

  const consideraHistorico = !!form.values?.consideraHistorico;
  const parametroFiltrarUesSondagem =
    '&modalidade=5&filtrarTipoEscolaPorAnoLetivo=true';

  const anoAtual = window.moment().format('YYYY');

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);

  const obterAnosLetivos = useCallback(async () => {
    const anosLetivosFiltro = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
      anoMinimo: 2019,
    });

    if (anosLetivosFiltro?.length) {
      for (let i = 0; i < anosLetivosFiltro.length; i++) {
        // Não existiu sondagem em 2020
        if (anosLetivosFiltro[i] >= 2019 && anosLetivosFiltro[i] !== 2020) {
          listaAnosLetivo.push({
            valor: anosLetivosFiltro[i].valor,
            desc: anosLetivosFiltro[i].desc,
          });
        }
      }

      setListaAnosLetivo(listaAnosLetivo);
    }
  }, [consideraHistorico, anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

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
            defaultDataList={listaAnosLetivo}
            anoMinimo={2019}
            anoDesconsiderar={2020}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue
            form={form}
            parametrosOpcionais={parametroFiltrarUesSondagem}
            onChange={() => onChangeCampos()}
          />
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
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <CheckboxComponent
            form={form}
            name={'apresentarTurmasUesDresSemLancamento'}
            label="Exibir Turmas sem lançamento?"
            id={SGP_CHECKBOX_EXIBIR_TURMAS_SEM_LANCAMENTO}
            onChangeCheckbox={() => onChangeCampos()}
            disabled={false}
          />
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
