import { useCallback, useEffect, useState } from 'react';

// Form
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderSecao } from '~/redux/modulos/loader/actions';

// Serviços
import { ROUTES } from '@/core/enum/routes';
import RegistroPOAServico from '~/servicos/Paginas/DiarioClasse/RegistroPOA';
import { confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

// Componentes SGP
import { Cabecalho, DreDropDown, UeDropDown } from '~/componentes-sgp';

// Componentes
import {
  Auditoria,
  ButtonGroup,
  CampoTexto,
  Card,
  Grid,
  Loader,
  Localizador,
} from '~/componentes';
import MesesDropDown from '../componentes/MesesDropDown';

// Styles
import { Row } from './styles';

// Funçoes
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import { SGP_BUTTON_ALTERAR_CADASTRAR } from '~/constantes/ids/button';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { validaSeObjetoEhNuloOuVazio } from '~/utils/funcoes/gerais';

function RegistroPOAForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const carregando = useSelector(store => store.loader.loaderSecao);
  const permissoesTela = useSelector(store => store.usuario.permissoes);
  const anoLetivo =
    useSelector(store => store.usuario.turmaSelecionada.anoLetivo) ||
    window.moment().format('YYYY');

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [auditoria, setAuditoria] = useState({});
  const [valoresCarregados, setValoresCarregados] = useState(null);
  const [refForm, setRefForm] = useState({});
  const ehEdicaoRegistro = paramsRoute?.id > 0;
  const [valoresIniciais, setValoresIniciais] = useState({
    bimestre: '',
    titulo: '',
    descricao: '',
    professorRf: '',
    professorNome: '',
    dreId: '',
    ueId: '',
  });

  useEffect(() => {
    const permissoes = permissoesTela[ROUTES.REGISTRO_POA];
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setSomenteConsulta(
      verificaSomenteConsulta(permissoes, naoSetarSomenteConsultaNoStore)
    );
    if (naoSetarSomenteConsultaNoStore && refForm.resetForm) {
      refForm.resetForm();
      setModoEdicao(false);
    }
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  const validacoes = () => {
    return Yup.object({
      dreId: Yup.string().required('Campo obrigatório'),
      ueId: Yup.string().required('Campo obrigatório'),
      descricao: Yup.string().required('Campo obrigatório'),
      bimestre: Yup.number().required('Campo obrigatório'),
      titulo: Yup.string().required('Campo obrigatório'),
      professorRf: Yup.number()
        .typeError('Informar um número inteiro!')
        .required('Campo obrigatório'),
    });
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });

    if (!form.values.descricao.length) {
      erro('O campo "Descrição" é obrigatório!');
      return;
    }

    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.submitForm(form);
      }
    });
  };

  const onClickBotaoPrincipal = form => {
    const formComEditor = {
      ...form,
      values: {
        ...form.values,
        anoLetivo,
      },
    };
    validaAntesDoSubmit(formComEditor);
  };

  const onSubmitFormulario = async valores => {
    try {
      dispatch(setLoaderSecao(true));
      const cadastrado = await RegistroPOAServico.salvarRegistroPOA(
        {
          ...valores,
          codigoRf: valores.professorRf,
          nome: valores.professorNome,
          anoLetivo,
        },
        valores.id || null
      );
      if (cadastrado?.status === 200) {
        dispatch(setLoaderSecao(false));
        sucesso(
          `Registro ${paramsRoute?.id ? 'alterado' : 'salvo'} com sucesso.`
        );
        navigate(ROUTES.REGISTRO_POA);
      }
    } catch (err) {
      if (err) {
        dispatch(setLoaderSecao(false));
        erro(err?.response?.data?.mensagens?.[0]);
      }
    }
  };

  const onClickVoltar = async form => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmou) {
        validaAntesDoSubmit(form);
      } else {
        navigate(ROUTES.REGISTRO_POA);
      }
    } else {
      navigate(ROUTES.REGISTRO_POA);
    }
  };

  const onClickCancelar = async form => {
    if (!modoEdicao) return;
    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    if (confirmou) {
      form.resetForm();
      setModoEdicao(false);
    }
  };

  const onClickExcluir = async form => {
    if (validaSeObjetoEhNuloOuVazio(form.values)) return;

    const confirmado = await confirmar(
      'Excluir registro',
      form.values.titulo,
      `Deseja realmente excluir este item?`,
      'Excluir',
      'Cancelar'
    );
    if (confirmado) {
      const excluir = await RegistroPOAServico.deletarRegistroPOA(
        form.values.id
      );
      if (excluir) {
        sucesso(`Registro excluído com sucesso!`);
        navigate(ROUTES.REGISTRO_POA);
      }
    }
  };

  const buscarPorId = useCallback(async id => {
    try {
      const registro = await RegistroPOAServico.buscarRegistroPOA(id);
      if (registro && registro.data) {
        setValoresIniciais({
          ...registro.data,
          bimestre: String(registro.data.bimestre),
          professorRf: registro.data.codigoRf,
          professorNome: registro.data.nome,
          titulo: registro.data.titulo,
        });
        setAuditoria({
          criadoPor: registro.data.criadoPor,
          criadoRf: registro.data.criadoRF > 0 ? registro.data.criadoRF : '',
          criadoEm: registro.data.criadoEm,
          alteradoPor: registro.data.alteradoPor,
          alteradoRf:
            registro.data.alteradoRF > 0 ? registro.data.alteradoRF : '',
          alteradoEm: registro.data.alteradoEm,
        });
        setTimeout(() => {
          setValoresCarregados(true);
        }, 1500);
      }
    } catch (err) {
      erros(err);
    }
  }, []);

  const onChangeCampos = useCallback(() => {
    if (valoresCarregados) {
      setModoEdicao(true);
    }
  }, [valoresCarregados]);

  useEffect(() => {
    if (paramsRoute?.id) {
      setNovoRegistro(false);
      setBreadcrumbManual(location.pathname, 'Registro', ROUTES.REGISTRO_POA);
      buscarPorId(paramsRoute.id);
    } else {
      setValoresCarregados(true);
    }
  }, [buscarPorId, location, paramsRoute]);

  return (
    <>
      <AlertaModalidadeInfantil />
      <Loader loading={carregando || !valoresCarregados}>
        <Formik
          enableReinitialize
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          onSubmit={valores => onSubmitFormulario(valores)}
          ref={refFormik => setRefForm(refFormik)}
          validateOnBlur
          validateOnChange
        >
          {form => (
            <>
              <Cabecalho pagina="Registro">
                <ButtonGroup
                  form={form}
                  permissoesTela={permissoesTela[ROUTES.REGISTRO_POA]}
                  novoRegistro={novoRegistro}
                  idBotaoPrincipal={SGP_BUTTON_ALTERAR_CADASTRAR}
                  labelBotaoPrincipal={
                    ehEdicaoRegistro ? 'Alterar' : 'Cadastrar'
                  }
                  onClickBotaoPrincipal={() => onClickBotaoPrincipal(form)}
                  onClickCancelar={formulario => onClickCancelar(formulario)}
                  onClickVoltar={() => onClickVoltar(form)}
                  onClickExcluir={() => onClickExcluir(form)}
                  modoEdicao={modoEdicao}
                  desabilitarBotaoPrincipal={
                    ehTurmaInfantil(
                      modalidadesFiltroPrincipal,
                      turmaSelecionada
                    ) ||
                    (paramsRoute?.id && !modoEdicao)
                  }
                />
              </Cabecalho>
              <Card>
                <Form>
                  {!ehTurmaInfantil(
                    modalidadesFiltroPrincipal,
                    turmaSelecionada
                  ) ? (
                    <div className="col-md-12">
                      <Row className="row mb-2">
                        <Grid cols={6}>
                          <DreDropDown
                            url="v1/dres/atribuicoes"
                            label="Diretoria Regional de Educação (DRE)"
                            form={form}
                            onChange={(_, __, onChangeManual) => {
                              if (onChangeManual) onChangeCampos();
                            }}
                            desabilitado={somenteConsulta}
                            labelRequired
                          />
                        </Grid>
                        <Grid cols={6}>
                          <UeDropDown
                            dreId={form.values.dreId}
                            label="Unidade Escolar (UE)"
                            form={form}
                            url="v1/dres"
                            onChange={(_, __, onChangeManual) => {
                              if (onChangeManual) onChangeCampos();
                            }}
                            desabilitado={somenteConsulta}
                            labelRequired
                          />
                        </Grid>
                      </Row>
                      <Row className="row mb-2">
                        <Localizador
                          dreId={form.values.dreId}
                          ueId={form.values.ueId}
                          anoLetivo={anoLetivo}
                          form={form}
                          onChange={valorLocalizador => {
                            if (
                              valorLocalizador?.professorRf !==
                              valoresIniciais?.professorRf
                            ) {
                              onChangeCampos();
                            }
                          }}
                          showLabel
                          desabilitado={somenteConsulta}
                          labelRequired
                        />
                      </Row>
                      <Row className="row">
                        <Grid cols={2}>
                          <MesesDropDown
                            label="Bimestre"
                            name="bimestre"
                            form={form}
                            desabilitado={somenteConsulta}
                            onChange={() => {
                              onChangeCampos();
                            }}
                          />
                        </Grid>
                        <Grid cols={10}>
                          <CampoTexto
                            name="titulo"
                            id="titulo"
                            label="Título"
                            placeholder="Digite o título do registro"
                            form={form}
                            desabilitado={somenteConsulta}
                            labelRequired
                            onChange={() => {
                              onChangeCampos();
                            }}
                          />
                        </Grid>
                      </Row>
                      <Row className="row">
                        <Grid cols={12}>
                          <JoditEditor
                            label="Registro das atividades realizadas junto aos professores ao longo do bimestre, considerando a análise e o acompanhamento do planejamento docente"
                            form={form}
                            id="descricao"
                            alt="Registro das atividades realizadas junto aos professores ao longo do bimestre, considerando a análise e o acompanhamento do planejamento docente"
                            name="descricao"
                            value={valoresIniciais?.descricao}
                            desabilitado={somenteConsulta}
                            labelRequired
                            onChange={() => {
                              setModoEdicao(true);
                            }}
                          />
                        </Grid>
                      </Row>
                    </div>
                  ) : (
                    ''
                  )}
                  {auditoria &&
                  !ehTurmaInfantil(
                    modalidadesFiltroPrincipal,
                    turmaSelecionada
                  ) ? (
                    <div className="col-md-12">
                      <div className="row">
                        <Auditoria
                          criadoEm={auditoria.criadoEm}
                          criadoPor={auditoria.criadoPor}
                          criadoRf={auditoria.criadoRf}
                          alteradoPor={auditoria.alteradoPor}
                          alteradoEm={auditoria.alteradoEm}
                          alteradoRf={auditoria.alteradoRf}
                          ignorarMarginTop
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </Form>
              </Card>
            </>
          )}
        </Formik>
      </Loader>
    </>
  );
}

export default RegistroPOAForm;
