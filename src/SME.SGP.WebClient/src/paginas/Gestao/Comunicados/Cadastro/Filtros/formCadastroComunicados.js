import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Loader } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import {
  setExibirLoaderGeralComunicados,
  setFormComunicados,
  setModoEdicaoCadastroComunicados,
} from '~/redux/modulos/comunicados/actions';
import { erros, ServicoComunicados } from '~/servicos';
import AnoEscolarComunicados from './campos/anoEscolarComunicados';
import AnoLetivoComunicados from './campos/anoLetivoComunicados';
import DreComunicados from './campos/dreComunicados';
import ModalidadeComunicados from './campos/modalidadeComunicados';
import SemestreComunicados from './campos/semestreComunicados';
import TipoEscolaComunicados from './campos/tipoEscolaComunicados';
import TurmasComunicados from './campos/turmasComunicados';
import UeComunicados from './campos/ueComunicados';

const FormCadastroComunicados = props => {
  const { comunicadoId, somenteConsulta } = props;

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_COMUNICADOS];

  const dispatch = useDispatch();

  const inicial = {
    anoLetivo: undefined,
    codigoDre: undefined,
    codigoUe: undefined,
    modalidades: [],
    semestre: undefined,
    tipoEscola: [],
    anosEscolares: [],
    turmas: [],
  };
  const [initialValues, setInitialValues] = useState(
    comunicadoId ? null : inicial
  );

  const [refForm, setRefForm] = useState();

  const validarSeDesabilitaCampos = () => {
    if (comunicadoId > 0) {
      return !permissoesTela.podeAlterar || somenteConsulta;
    }
    return !permissoesTela.podeIncluir || somenteConsulta;
  };
  const desabilitarCampos = validarSeDesabilitaCampos();

  const obterForm = () => refForm;

  useEffect(() => {
    if (refForm) {
      dispatch(setFormComunicados(() => obterForm()));
    }
  }, [refForm]);

  const tratarValores = valores => {
    valores = { ...inicial, ...valores };
    if (!valores?.codigoDre) valores.codigoDre = OPCAO_TODOS;
    if (!valores?.codigoUe) valores.codigoUe = OPCAO_TODOS;

    if (valores?.modalidades?.length) {
      valores.modalidades = valores.modalidades.map(valor => String(valor));
    } else {
      valores.modalidades = [OPCAO_TODOS];
    }

    return valores;
  };

  const obterComunicadoPorId = useCallback(async () => {
    dispatch(setExibirLoaderGeralComunicados(true));
    const resposta = await ServicoComunicados.consultarPorId(comunicadoId)
      .catch(e => erros(e))
      .finally(() => dispatch(setExibirLoaderGeralComunicados(false)));

    if (resposta?.data) {
      const valoresTratados = tratarValores(resposta.data);
      setInitialValues(valoresTratados);
    }
  }, [comunicadoId]);

  useEffect(() => {
    if (comunicadoId) {
      obterComunicadoPorId();
    }
  }, [comunicadoId, obterComunicadoPorId]);

  const onChangeCampos = () => {
    dispatch(setModoEdicaoCadastroComunicados(true));
  };

  const textoCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    anoLetivo: Yup.string()
      .nullable()
      .required(textoCampoObrigatorio),
    codigoDre: Yup.string()
      .nullable()
      .required(textoCampoObrigatorio),
    codigoUe: Yup.string()
      .nullable()
      .required(textoCampoObrigatorio),
    modalidades: Yup.array()
      .nullable()
      .required(textoCampoObrigatorio),
    semestre: Yup.string()
      .nullable()
      .test(
        'validaSeEjaSelecionado',
        textoCampoObrigatorio,
        function validar() {
          const { modalidades, semestre } = this.parent;
          const temModalidadeEja = modalidades?.find(
            item => String(item) === String(ModalidadeDTO.EJA)
          );
          let ehValido = true;
          if (!temModalidadeEja) {
            return ehValido;
          }
          if (!semestre) {
            ehValido = false;
          }
          return ehValido;
        }
      ),
    tipoEscola: Yup.array()
      .nullable()
      .required(textoCampoObrigatorio),
    anosEscolares: Yup.array()
      .nullable()
      .required(textoCampoObrigatorio),
    turmas: Yup.array()
      .nullable()
      .required(textoCampoObrigatorio),
  });

  return (
    <Loader>
      {initialValues ? (
        <Formik
          ref={f => setRefForm(f)}
          enableReinitialize
          initialValues={initialValues}
          validateOnChange
          validateOnBlur
          validationSchema={validacoes}
        >
          {form => (
            <Form>
              <div className="row py-3">
                <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2 mb-2">
                  <AnoLetivoComunicados
                    form={form}
                    comunicadoId={comunicadoId}
                    onChangeCampos={onChangeCampos}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-9 col-xl-5 mb-2">
                  <DreComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                    comunicadoId={comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
                  <UeComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-8 col-xl-8 mb-2">
                  <ModalidadeComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 mb-2">
                  <SemestreComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <TipoEscolaComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <AnoEscolarComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <TurmasComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        ''
      )}
    </Loader>
  );
};

FormCadastroComunicados.propTypes = {
  comunicadoId: PropTypes.string,
  somenteConsulta: PropTypes.bool,
};

FormCadastroComunicados.defaultProps = {
  comunicadoId: '',
  somenteConsulta: false,
};

export default FormCadastroComunicados;
