import React, { useState, useCallback, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import {
  CheckboxComponent,
  Grid,
  Localizador,
  SelectComponent,
} from '~/componentes';
import DreDropDown from '~/componentes-sgp/DreDropDown';
import UeDropDown from '~/componentes-sgp/UeDropDown';

import { Linha } from '~/componentes/EstilosGlobais';

import { validaSeObjetoEhNuloOuVazio } from '~/utils/funcoes/gerais';

import { selecionarUe } from '~/redux/modulos/atribuicaoEsporadica/actions';
import { FiltroHelper } from '~/componentes-sgp';

const Filtro = memo(({ onFiltrar }) => {
  const dispatch = useDispatch();
  const [refForm, setRefForm] = useState({});
  const [dreId, setDreId] = useState('');
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [anoLetivo, setAnoLetivo] = useState();

  const anoAtual = window.moment().format('YYYY');

  const [valoresIniciais] = useState({
    anoLetivo: anoAtual,
    dreId: '',
    ueId: '',
    professorRf: '',
  });

  const validacoes = () => {
    return Yup.object({});
  };

  const validarFiltro = valores => {
    if (validaSeObjetoEhNuloOuVazio(valores)) return;
    const formContext = refForm && refForm.getFormikContext();
    if (formContext.isValid && Object.keys(formContext.errors).length === 0) {
      onFiltrar(valores);
    }
  };

  const onChangeDre = useCallback(valor => {
    setDreId(valor);
  }, []);

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
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

    if (anosLetivos && anosLetivos.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(anosLetivos);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
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
                form={form}
                lista={listaAnosLetivo}
                valueOption="valor"
                valueText="desc"
                disabled={!consideraHistorico || listaAnosLetivo?.length === 1}
                onChange={onChangeAnoLetivo}
                valueSelect={anoLetivo}
                placeholder="Ano letivo"
              />
            </Grid>
            <Grid cols={5}>
              <DreDropDown form={form} onChange={valor => onChangeDre(valor)} />
            </Grid>
            <Grid cols={5}>
              <UeDropDown
                dreId={dreId}
                form={form}
                onChange={valor => dispatch(selecionarUe(valor))}
              />
            </Grid>
          </Linha>
          <Linha className="row">
            <Localizador
              dreId={dreId}
              anoLetivo={anoAtual}
              form={form}
              onChange={valor => valor}
            />
          </Linha>
        </Form>
      )}
    </Formik>
  );
});

Filtro.propTypes = {
  onFiltrar: PropTypes.func,
};

Filtro.defaultProps = {
  onFiltrar: () => null,
};

export default Filtro;
