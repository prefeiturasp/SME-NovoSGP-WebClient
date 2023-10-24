import { CampoData, CampoTexto, Label } from '@/@legacy/componentes';
import { SelectPerfis } from '@/@legacy/componentes-sgp/inputs/perfis';
import { SGP_DATE_FIM, SGP_DATE_INICIO } from '@/@legacy/constantes/ids/date';
import { SGP_INPUT_TITULO } from '@/@legacy/constantes/ids/input';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Dre, Ue } from '~/componentes-sgp/inputs';
import ListaInformesPaginado from './listaInformesPaginado';

const ListaInformesFiltros = props => {
  const { form } = props;

  const dreCodigo = form.values?.dreCodigo;
  const ueCodigo = form.values?.ueCodigo;

  const desabilitarCampos = !dreCodigo || !ueCodigo;

  const desabilitarDataFutura = current => {
    if (current) {
      return current >= window.moment();
    }
    return false;
  };

  useEffect(() => {
    if (!dreCodigo && !ueCodigo) {
      form.setFieldValue('dataInicio', '');
      form.setFieldValue('dataFim', '');
      form.setFieldValue('titulo', '');
      form.setFieldValue('perfis', undefined);
    }
  }, [dreCodigo, ueCodigo]);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Dre form={form} />
        </Col>

        <Col xs={24} md={12}>
          <Ue form={form} />
        </Col>
        <Col xs={24}>
          <Row>
            <Col>
              <Label text="Data de envio" />
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <CampoData
                form={form}
                placeholder="Data Início"
                formatoData="DD/MM/YYYY"
                id={SGP_DATE_INICIO}
                name="dataInicio"
                desabilitarData={desabilitarDataFutura}
                desabilitado={desabilitarCampos}
              />
            </Col>
            <Col xs={24} md={12}>
              <CampoData
                form={form}
                placeholder="Data Fim"
                formatoData="DD/MM/YYYY"
                id={SGP_DATE_FIM}
                name="dataFim"
                desabilitarData={desabilitarDataFutura}
                desabilitado={desabilitarCampos}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={12}>
          <SelectPerfis form={form} disabled={desabilitarCampos} multiple />
        </Col>

        <Col xs={24} md={12}>
          <CampoTexto
            id={SGP_INPUT_TITULO}
            form={form}
            label="Título"
            placeholder="Título"
            name="titulo"
            type="input"
            maxLength={100}
            desabilitado={desabilitarCampos}
          />
        </Col>

        <Col xs={24}>
          <ListaInformesPaginado form={form} />
        </Col>
      </Row>
    </Col>
  );
};

ListaInformesFiltros.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

ListaInformesFiltros.defaultProps = {
  form: null,
};

export default React.memo(ListaInformesFiltros);
