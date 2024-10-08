import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';

import {
  CheckboxComponent,
  Grid,
  Loader,
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
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);

  const [valoresIniciais, setValoresIniciais] = useState({
    anoLetivo: anoAtual,
    dreId: '',
    ueId: '',
    professorRf: '',
    exibirHistorico: false,
  });

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);

    const anosLetivos = await FiltroHelper.obterAnosLetivosAtribuicao(
      consideraHistorico
    );

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    const anosOrdenados = ordenarDescPor(anosLetivos, 'valor');

    setListaAnosLetivo(anosOrdenados);
    setCarregandoAnos(false);
    setValoresIniciais({
      ...valoresIniciais,
      anoLetivo: anosOrdenados[0]?.valor,
      exibirHistorico: consideraHistorico,
    });
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    refForm.setFieldValue('anoLetivo', anoAtual);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={valoresIniciais}
      onSubmit={valores => onFiltrar(valores)}
      ref={refFormik => setRefForm(refFormik)}
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
              disabled={listaAnosLetivo.length === 0}
            />
          </Linha>
          <Linha className="row mb-2">
            <Grid cols={2}>
              <Loader loading={carregandoAnos} tip="">
                <SelectComponent
                  name="anoLetivo"
                  placeholder="Ano letivo"
                  lista={listaAnosLetivo}
                  valueText="desc"
                  valueOption="valor"
                  form={form}
                  onChange={() => {}}
                  allowClear={false}
                  disabled={listaAnosLetivo?.length === 1}
                />
              </Loader>
            </Grid>
            <Grid cols={5}>
              <DreDropDown
                url={`v1/dres/atribuicoes?anoLetivo=${form.values.anoLetivo}&consideraHistorico=${consideraHistorico}`}
                form={form}
                onChange={() => onFiltrar(form.values)}
              />
            </Grid>
            <Grid cols={5}>
              <UeDropDown
                temParametros
                url={`v1/dres/${form.values.dreId}/ues/atribuicoes?anoLetivo=${form.values.anoLetivo}&consideraHistorico=${consideraHistorico}`}
                dreId={form.values.dreId}
                form={form}
                onChange={() => onFiltrar(form.values)}
              />
            </Grid>
          </Linha>
          <Linha className="row">
            <Localizador
              dreId={form.values.dreId}
              ueId={form.values.ueId}
              anoLetivo={form.values.anoLetivo}
              form={form}
              onChange={pessoa => onFiltrar({ ...form.values, ...pessoa })}
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
