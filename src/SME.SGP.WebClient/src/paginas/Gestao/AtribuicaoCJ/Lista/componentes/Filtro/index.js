import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
  CheckboxComponent,
  Grid,
  Localizador,
  SelectComponent,
} from '~/componentes';
import DreDropDown from '~/componentes-sgp/DreDropDown/';
import UeDropDown from '~/componentes-sgp/UeDropDown/';

import { Linha } from '~/componentes/EstilosGlobais';
import { FiltroHelper } from '~/componentes-sgp';
import { ordenarDescPor } from '~/utils';

function Filtro({ onFiltrar }) {
  const anoAtual = window.moment().format('YYYY');

  const [refForm, setRefForm] = useState({});
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [valoresIniciais] = useState({
    anoLetivo: anoAtual,
    dreId: '',
    ueId: '',
    professorRf: '',
    exibirHistorico: false,
  });

  const validacoes = () => {
    return Yup.object({});
  };

  const validarFiltro = valores => {
    const formContext = refForm && refForm.getFormikContext();
    if (formContext.isValid && Object.keys(formContext.errors).length === 0) {
      onFiltrar(valores);
    }
  };

  const obterAnosLetivos = useCallback(async () => {
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
    });

    anosLetivos = anosLetivos.concat(anosLetivoComHistorico);

    anosLetivoSemHistorico.forEach(ano => {
      if (!anosLetivoComHistorico.find(a => a.valor === ano.valor)) {
        anosLetivos.push(ano);
      }
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }
    const anosOrdenados = ordenarDescPor(anosLetivos, 'valor');
    setListaAnosLetivo(anosOrdenados);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    refForm.setFieldValue('anoLetivo', anoAtual);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={valoresIniciais}
      validationSchema={validacoes()}
      onSubmit={valores => onFiltrar(valores)}
      ref={refFormik => setRefForm(refFormik)}
      validate={valores => validarFiltro(valores)}
      validateOnChange
      validateOnBlur
    >
      {form => (
        <Form className="col-md-12 mb-4">
          <Linha className="row mb-2">
            <CheckboxComponent
              name="exibirHistorico"
              form={form}
              label="Exibir histórico?"
              onChangeCheckbox={onChangeConsideraHistorico}
              checked={consideraHistorico}
              disabled={listaAnosLetivo.length === 1}
            />
          </Linha>
          <Linha className="row mb-2">
            <Grid cols={2}>
              <SelectComponent
                name="anoLetivo"
                placeholder="Ano letivo"
                lista={listaAnosLetivo}
                valueText="desc"
                valueOption="valor"
                form={form}
                onChange={() => {}}
                allowClear={false}
                disabled={!consideraHistorico || listaAnosLetivo?.length === 1}
              />
            </Grid>
            <Grid cols={5}>
              <DreDropDown
                url={`v1/dres/atribuicoes?anoLetivo=${form.values.anoLetivo}`}
                form={form}
                onChange={() => null}
              />
            </Grid>
            <Grid cols={5}>
              <UeDropDown
                temParametros
                url={`v1/dres/${form.values.dreId}/ues/atribuicoes?anoLetivo=${form.values.anoLetivo}`}
                dreId={form.values.dreId}
                form={form}
                onChange={() => null}
              />
            </Grid>
          </Linha>
          <Linha className="row">
            <Localizador
              dreId={form.values.dreId}
              anoLetivo={form.values.anoLetivo}
              form={form}
              onChange={() => null}
            />
          </Linha>
        </Form>
      )}
    </Formik>
  );
}

Filtro.propTypes = {
  onFiltrar: PropTypes.func,
};

Filtro.defaultProps = {
  onFiltrar: () => null,
};

export default Filtro;
