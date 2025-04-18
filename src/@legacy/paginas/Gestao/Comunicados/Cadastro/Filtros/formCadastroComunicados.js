import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { ROUTES } from '@/core/enum/routes';
import { Divider } from 'antd';
import { Form, Formik } from 'formik';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Loader, momentSchema } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import {
  setExibirLoaderGeralComunicados,
  setFormComunicados,
  setModoEdicaoCadastroComunicados,
} from '~/redux/modulos/comunicados/actions';
import { ServicoComunicados, erros } from '~/servicos';
import ListaDestinatarios from '../ListaDestinatarios/listaDestinatarios';
import AuditoriaCadastroComunicados from '../auditoriaCadastroComunicados';
import AnoEscolarComunicados from './campos/anoEscolarComunicados';
import AnoLetivoComunicados from './campos/anoLetivoComunicados';
import CriancasEstudantesComunicados from './campos/criancasEstudantesComunicados';
import DataEnvioExpiracaoComunicados from './campos/dataEnvioExpiracaoComunicados';
import DescricaoComunicados from './campos/descricaoComunicados';
import DreComunicados from './campos/dreComunicados';
import EventosComunicados from './campos/eventosComunicados';
import ModalidadeComunicados from './campos/modalidadeComunicados';
import SemestreComunicados from './campos/semestreComunicados';
import TipoCalendarioComunicados from './campos/tipoCalendarioComunicados';
import TipoEscolaComunicados from './campos/tipoEscolaComunicados';
import TituloComunicados from './campos/tituloComunicados';
import TurmasComunicados from './campos/turmasComunicados';
import UeComunicados from './campos/ueComunicados';
import InfoEstudantesReceberComunicados from './infoEstudantesReceberComunicado';

const FormCadastroComunicados = props => {
  const { comunicadoId, somenteConsulta } = props;

  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.ACOMPANHAMENTO_COMUNICADOS];

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
    alunoEspecifico: undefined,
    alunos: [],
    tipoCalendarioId: undefined,
    eventoId: undefined,
    dataEnvio: '',
    dataExpiracao: '',
    titulo: '',
    descricao: '',
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

    if (valores?.dataEnvio) {
      valores.dataEnvio = moment(valores.dataEnvio);
    } else {
      valores.dataEnvio = '';
    }

    if (valores?.dataExpiracao) {
      valores.dataExpiracao = moment(valores.dataExpiracao);
    } else {
      valores.dataExpiracao = '';
    }

    if (valores?.turmas?.length) {
      valores.turmas = valores.turmas.map(turma => turma?.codigoTurma);
    } else {
      valores.turmas = [OPCAO_TODOS];
    }

    if (valores?.tipoCalendarioId) {
      valores.tipoCalendarioId = String(valores.tipoCalendarioId);
    }

    if (valores?.eventoId) {
      valores.eventoId = String(valores.eventoId);
    }

    if (valores?.alunoEspecificado) {
      valores.alunoEspecifico = '1';
    } else {
      valores.alunoEspecifico = OPCAO_TODOS;
    }

    if (valores?.tiposEscolas?.length) {
      valores.tipoEscola = valores.tiposEscolas.map(valor => String(valor));
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
    anoLetivo: Yup.string().nullable().required(textoCampoObrigatorio),
    codigoDre: Yup.string().nullable().required(textoCampoObrigatorio),
    codigoUe: Yup.string().nullable().required(textoCampoObrigatorio),
    modalidades: Yup.array().nullable().required(textoCampoObrigatorio),
    semestre: Yup.string()
      .nullable()
      .test(
        'validaSeEjaSelecionado',
        textoCampoObrigatorio,
        function validar() {
          const { modalidades, semestre } = this.parent;
          const temModalidadeEja = modalidades?.find(
            item =>
              Number(item) === ModalidadeEnum.EJA ||
              Number(item) === ModalidadeEnum.CELP
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
    tipoEscola: Yup.array().nullable().required(textoCampoObrigatorio),
    anosEscolares: Yup.array().nullable().required(textoCampoObrigatorio),
    turmas: Yup.array().nullable().required(textoCampoObrigatorio),
    dataEnvio: momentSchema.required(textoCampoObrigatorio),
    dataExpiracao: momentSchema
      .required(textoCampoObrigatorio)
      .test(
        'validaDataMaiorQueEnvio',
        'Data de expiração deve ser maior que a data de envio',
        function validar() {
          const { dataEnvio } = this.parent;
          const { dataExpiracao } = this.parent;
          if (
            dataEnvio &&
            dataExpiracao &&
            moment(dataExpiracao) < moment(dataEnvio)
          ) {
            return false;
          }

          return true;
        }
      ),
    titulo: Yup.string()
      .nullable()
      .required(textoCampoObrigatorio)
      .min(10, 'Deve conter no mínimo 10 caracteres')
      .max(50, 'Deve conter no máximo 50 caracteres'),
    descricao: Yup.string().nullable().required(textoCampoObrigatorio),
    eventoId: Yup.string()
      .nullable()
      .test('validaSeObrigatorio', textoCampoObrigatorio, function validar() {
        const { codigoUe, eventoId } = this.parent;
        const ehTodos = codigoUe === OPCAO_TODOS;

        if (codigoUe && !ehTodos && !eventoId) {
          return false;
        }
        return true;
      }),
    tipoCalendarioId: Yup.string()
      .nullable()
      .test('validaSeObrigatorio', textoCampoObrigatorio, function validar() {
        const { codigoUe, tipoCalendarioId } = this.parent;
        const ehTodos = codigoUe === OPCAO_TODOS;

        if (codigoUe && !ehTodos && !tipoCalendarioId) {
          return false;
        }
        return true;
      }),
    alunoEspecifico: Yup.string()
      .nullable()
      .test(
        'validaSeObrigatorio',
        'Deve selecionar pelo menos uma criança/estudante',
        function validar() {
          const { alunos, alunoEspecifico } = this.parent;
          const ehTodos = alunoEspecifico === OPCAO_TODOS;

          if (alunoEspecifico && !ehTodos && !alunos?.length) {
            return false;
          }
          return true;
        }
      ),
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
              <div className="row">
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
                    desabilitar={desabilitarCampos || !!comunicadoId}
                    comunicadoId={comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
                  <UeComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-8 col-xl-8 mb-2">
                  <ModalidadeComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 mb-2">
                  <SemestreComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <TipoEscolaComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                    comunicadoId={comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <AnoEscolarComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
                  <TurmasComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <CriancasEstudantesComunicados
                  form={form}
                  onChangeCampos={onChangeCampos}
                  comunicadoId={comunicadoId}
                  desabilitar={desabilitarCampos || !!comunicadoId}
                />
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <TipoCalendarioComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                  <EventosComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <DataEnvioExpiracaoComunicados
                  form={form}
                  onChangeCampos={onChangeCampos}
                  desabilitar={desabilitarCampos}
                  comunicadoId={comunicadoId}
                />
                <div className="col-sm-12">
                  <Divider />
                </div>
                <div className="col-sm-12 mb-2">
                  <ListaDestinatarios
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos || !!comunicadoId}
                  />
                </div>
                <div className="col-sm-12 mb-2">
                  <TituloComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <div className="col-sm-12 mb-2">
                  <DescricaoComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </div>
                <AuditoriaCadastroComunicados form={form} />
                <div className="col-sm-12 mb-2">
                  <InfoEstudantesReceberComunicados form={form} />
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
