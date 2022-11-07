import { Form, Formik } from 'formik';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Loader, momentSchema } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import UeComunicados from '../../Comunicados/Cadastro/Filtros/campos/ueComunicados';
import DreOcorrencia from './campos/dreOcorrencia';
import ModalidadeOcorrencia from './campos/modalidadeOcorrencia';
import SemestreOcorrencia from './campos/semestreOcorrencia';
import TurmasOcorrencia from './campos/turmasOcorrencia';
import InserirDadosOcorrencia from './campos/inserirDadosOcorrencia';
import DataHoraOcorrencia from './campos/dataHoraOcorrencia';
import TituloOcorrencia from './campos/tituloOcorrencia';
import TipoOcorrencia from './campos/tipoOcorrencia';

const FormCadastroOcorrencia = ({ somenteConsulta }) => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_COMUNICADOS];

  const [modoEdicao, setModoEdicao] = useState(false);

  const dispatch = useDispatch();

  const inicial = {
    codigoDre: undefined,
    codigoUe: undefined,
    modalidades: [],
    semestre: undefined,
    turmas: [],
    tituloOcorrencia: '',
    descricao: '',
  };
  const [initialValues, setInitialValues] = useState(inicial);

  const [refForm, setRefForm] = useState();

  const desabilitarCampos = false;

  const obterForm = () => refForm;

  useEffect(() => {
    if (refForm) {
      dispatch(() => obterForm());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      valores.turmas = [];
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

  const onChangeCampos = () => {
    setModoEdicao(true);
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
    turmas: Yup.array()
      .nullable()
      .required(textoCampoObrigatorio),
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
    descricao: Yup.string()
      .nullable()
      .required(textoCampoObrigatorio),
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
              <Row gutter={[16, 16]} type="flex" justify="space-betwenn">
                <Col span={12}>
                  <DreOcorrencia
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
                <Col span={12}>
                  <UeComunicados
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} type="flex" justify="space-betwenn">
                <Col span={8}>
                  <ModalidadeOcorrencia
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
                <Col span={8}>
                  <SemestreOcorrencia
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
                <Col span={8}>
                  <TurmasOcorrencia
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} type="flex" justify="space-betwenn">
                <Col span={12}>
                  <InserirDadosOcorrencia
                    form={form}
                    title="Crianças(s)/Estudante(s) envolvido(s) na ocorrência"
                    labelMain="Inserir criança(s) envolvida(s)"
                    labelSecondary="Consultar crianças envolvidas"
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
                <Col span={12}>
                  <InserirDadosOcorrencia
                    form={form}
                    title="Servidor(es) envolvido(s) na ocorrência"
                    labelMain="Inserir servidor(es) envolvido(s)"
                    labelSecondary="Consultar servidores envolvidos"
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} type="flex" justify="space-betwenn">
                <Col span={12}>
                  <DataHoraOcorrencia
                    form={form}
                    onChangeCampos={onChangeCampos}
                    desabilitar={desabilitarCampos}
                  />
                </Col>
                <Col span={12}>
                  <TipoOcorrencia form={form} />
                </Col>
              </Row>

              <Row gutter={[16, 16]} type="flex" justify="space-betwenn">
                <Col span={12}>
                  <TituloOcorrencia form={form} />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      ) : (
        ''
      )}
    </Loader>
  );
};

// eslint-disable-next-line react/no-typos
FormCadastroOcorrencia.PropTypes = {
  somenteConsulta: PropTypes.bool,
};

FormCadastroOcorrencia.defaultProps = {
  somenteConsulta: false,
};

export default FormCadastroOcorrencia;
