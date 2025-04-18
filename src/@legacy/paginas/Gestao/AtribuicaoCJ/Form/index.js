import { Form, Formik } from 'formik';
import { isEqual } from 'lodash';
import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { ROUTES } from '@/core/enum/routes';
import { confirmar, erro, sucesso } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import AtribuicaoCJServico from '~/servicos/Paginas/AtribuicaoCJ';
import { obterPerfis } from '~/servicos/Paginas/ServicoUsuario';

import {
  Auditoria,
  ButtonGroup,
  Card,
  CheckboxComponent,
  Grid,
  Loader,
  Localizador,
  SelectComponent,
} from '~/componentes';
import {
  Cabecalho,
  DreDropDown,
  FiltroHelper,
  UeDropDown,
} from '~/componentes-sgp';
import ModalidadesDropDown from './componentes/ModalidadesDropDown';
import Tabela from './componentes/Tabela';
import TurmasDropDown from './componentes/TurmasDropDown';

import { Row } from './styles';

import { useLocation, useNavigate } from 'react-router-dom';
import { SGP_BUTTON_SALVAR_ALTERAR } from '~/constantes/ids/button';
import { setRecarregarFiltroPrincipal } from '~/redux/modulos/usuario/actions';
import { verificaSomenteConsulta } from '~/servicos';
import {
  objetoEstaTodoPreenchido,
  ordenarDescPor,
  validaSeObjetoEhNuloOuVazio,
  valorNuloOuVazio,
} from '~/utils/funcoes/gerais';

function AtribuicaoCJForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const anoAtual = window.moment().format('YYYY');
  const [carregando, setCarregando] = useState(false);
  const [carregandoTabela, setcarregandoTabela] = useState(false);
  const permissoesTela = useSelector(store => store.usuario.permissoes);
  const usuario = useSelector(store => store.usuario);
  const [dreId, setDreId] = useState('');
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [auditoria, setAuditoria] = useState({});
  const [refForm, setRefForm] = useState(null);
  const [listaProfessores, setListaProfessores] = useState([]);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [anoLetivo, setAnoLetivo] = useState(anoAtual);
  const [valoresForm, setValoresForm] = useState({});
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [ehEdicao, setEhEdicao] = useState(false);
  const [valoresIniciais, setValoresIniciais] = useState({
    exibirHistorico: consideraHistorico,
    professorRf: '',
    professorNome: '',
    dreId: '',
    ueId: '',
    modalidadeId: '',
    turmaId: '',
    anoLetivo: anoAtual,
  });

  useEffect(() => {
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela[ROUTES.ATRIBUICAO_CJ_LISTA])
    );
  }, [permissoesTela]);

  const validacoes = () => {
    return Yup.object({
      dreId: Yup.string().required('Campo obrigatório'),
      ueId: Yup.string().required('Campo obrigatório'),
      professorRf: Yup.string().required('Campo obrigatório'),
      modalidadeId: Yup.string().required('Campo obrigatório'),
      turmaId: Yup.string().required('Campo obrigatório'),
    });
  };

  const validaAntesDoSubmit = form => {
    const arrayCampos = Object.keys(valoresIniciais);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.submitForm(form);
      }
    });
  };

  const onClickBotaoPrincipal = form => {
    validaAntesDoSubmit(form);
  };

  const onSubmitFormulario = async valores => {
    if (novoRegistro && !listaProfessores.some(x => x.substituir === true)) {
      erro('Selecione um professor para substituir.');
      return;
    }
    try {
      setCarregando(true);
      const { data, status } = await AtribuicaoCJServico.salvarAtribuicoes({
        ...valores,
        historico: consideraHistorico,
        usuarioRf: valores.professorRf,
        modalidade: valores.modalidadeId,
        disciplinas: [...listaProfessores],
      });
      if (data || status === 200) {
        setCarregando(false);
        sucesso('Atribuição de CJ salva com sucesso.');
        dispatch(setRecarregarFiltroPrincipal(true));
        navigate('/gestao/atribuicao-cjs');
        obterPerfis(usuario.rf);
      }
    } catch (err) {
      if (err) {
        setCarregando(false);
        erro(err.response.data.mensagens[0]);
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
        navigate(ROUTES.ATRIBUICAO_CJ_LISTA);
      }
    } else {
      navigate(ROUTES.ATRIBUICAO_CJ_LISTA);
    }
  };

  const validaFormulario = async valores => {
    if (validaSeObjetoEhNuloOuVazio(valores)) return;
    if (isEqual(valoresForm, valores)) return;

    if (objetoEstaTodoPreenchido(valores)) {
      setValoresForm(valores);
    }
  };

  const onChangeSubstituir = item => {
    setModoEdicao(true);
    setListaProfessores(
      listaProfessores.map(x => {
        if (item.disciplinaId === x.disciplinaId) {
          return {
            ...item,
            substituir: !x.substituir,
          };
        }
        return x;
      })
    );
  };

  useEffect(() => {
    if (location && location.search) {
      const query = queryString.parse(location.search);
      setBreadcrumbManual(
        location.pathname,
        'Atribuição',
        '/gestao/atribuicao-cjs'
      );
      if (query?.modalidadeId || query?.turmaId) {
        setEhEdicao(true);
      }

      const anoSelecionado = query.anoLetivo || anoAtual;
      const historico = query.historico === 'true' || consideraHistorico;

      setValoresIniciais({
        ...valoresIniciais,
        exibirHistorico: historico,
        modalidadeId: query.modalidadeId,
        turmaId: query.turmaId,
        ueId: query.ueId,
        dreId: query.dreId,
        anoLetivo: anoSelecionado,
        professorRf: query?.usuarioRF,
        professorNome: query?.professorNome,
      });

      setConsideraHistorico(historico);
      setAnoLetivo(anoSelecionado);
    }
  }, [location]);

  useEffect(() => {
    async function buscaAtribs(valores) {
      const { ueId, modalidadeId, turmaId, professorRf } = valores;

      if (
        valorNuloOuVazio(ueId) ||
        valorNuloOuVazio(modalidadeId) ||
        valorNuloOuVazio(turmaId) ||
        valorNuloOuVazio(professorRf)
      ) {
        return;
      }

      try {
        setcarregandoTabela(true);
        const { data, status } = await AtribuicaoCJServico.buscarAtribuicoes(
          ueId,
          modalidadeId,
          turmaId,
          professorRf,
          anoLetivo
        );

        if (data && status === 200) {
          setListaProfessores(data.itens);
          setAuditoria(data);
          if (data.itens.some(x => x.substituir === true)) {
            setNovoRegistro(false);
          }
        }
        if (status === 204) {
          setListaProfessores([]);
          setAuditoria(null);
        }
        setcarregandoTabela(false);
      } catch (error) {
        setcarregandoTabela(false);
        if (
          error.response.data.mensagens &&
          error.response.data.mensagens.length
        ) {
          erro(error.response.data.mensagens[0]);
        }
      }
    }

    if (
      refForm &&
      refForm.getFormikContext &&
      typeof refForm.getFormikContext === 'function'
    ) {
      buscaAtribs(valoresForm);
    }
  }, [refForm, valoresForm]);

  const limparCampos = () => {
    setAnoLetivo(anoAtual);
    refForm.setFieldValue('anoLetivo', anoAtual);
    refForm.setFieldValue('modalidadeId', undefined);
    refForm.setFieldValue('turmaId', undefined);
    setListaProfessores([]);
    setAuditoria({});
    setModoEdicao(false);
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
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
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    refForm.setFieldValue('modalidadeId', undefined);
    refForm.setFieldValue('turmaId', undefined);
    setListaProfessores([]);
    setAuditoria({});
  };

  return (
    <>
      <Loader loading={carregando}>
        <Formik
          enableReinitialize
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          ref={refFormik => setRefForm(refFormik)}
          onSubmit={valores => onSubmitFormulario(valores)}
          validate={valores => validaFormulario(valores)}
          validateOnBlur
          validateOnChange
        >
          {form => (
            <>
              <Cabecalho pagina="Atribuição">
                <ButtonGroup
                  form={form}
                  permissoesTela={permissoesTela[ROUTES.ATRIBUICAO_CJ_LISTA]}
                  novoRegistro={novoRegistro}
                  labelBotaoPrincipal={novoRegistro ? 'Salvar' : 'Alterar'}
                  idBotaoPrincipal={SGP_BUTTON_SALVAR_ALTERAR}
                  onClickBotaoPrincipal={() => onClickBotaoPrincipal(form)}
                  onClickVoltar={() => onClickVoltar(form)}
                  modoEdicao={modoEdicao}
                  desabilitarBotaoPrincipal={!novoRegistro && !modoEdicao}
                />
              </Cabecalho>
              <Card>
                <Form className="col-md-12">
                  <Row className="row">
                    <CheckboxComponent
                      name="exibirHistorico"
                      form={form}
                      label="Exibir histórico?"
                      onChangeCheckbox={onChangeConsideraHistorico}
                      checked={consideraHistorico}
                      disabled={
                        listaAnosLetivo.length === 0 ||
                        somenteConsulta ||
                        ehEdicao
                      }
                    />
                  </Row>
                  <Row className="row">
                    <Grid cols={2}>
                      <SelectComponent
                        name="anoLetivo"
                        placeholder="Ano letivo"
                        label="Ano letivo"
                        lista={listaAnosLetivo}
                        valueText="desc"
                        valueOption="valor"
                        form={form}
                        onChange={onChangeAnoLetivo}
                        valueSelect={anoLetivo}
                        allowClear={false}
                        disabled={
                          !consideraHistorico ||
                          listaAnosLetivo?.length === 1 ||
                          somenteConsulta
                        }
                        labelRequired
                      />
                    </Grid>
                    <Grid cols={5}>
                      <DreDropDown
                        url={`v1/dres/atribuicoes?anoLetivo=${anoLetivo}&consideraHistorico=${consideraHistorico}`}
                        label="Diretoria Regional de Educação (DRE)"
                        form={form}
                        onChange={valor => setDreId(valor)}
                        desabilitado={somenteConsulta}
                        labelRequired
                      />
                    </Grid>
                    <Grid cols={5}>
                      <UeDropDown
                        temParametros
                        url={`v1/dres/${form.values.dreId}/ues/atribuicoes?anoLetivo=${anoLetivo}&consideraHistorico=${consideraHistorico}`}
                        label="Unidade Escolar (UE)"
                        dreId={dreId}
                        form={form}
                        onChange={() => {}}
                        desabilitado={somenteConsulta}
                        labelRequired
                      />
                    </Grid>
                  </Row>
                  <Row className="row">
                    <Grid cols={7}>
                      <Row className="row">
                        <Localizador
                          dreId={form.values.dreId}
                          ueId={form.values.ueId}
                          anoLetivo={anoLetivo}
                          showLabel
                          form={form}
                          onChange={() => {}}
                          desabilitado={somenteConsulta}
                          labelRequired
                        />
                      </Row>
                    </Grid>
                    <Grid cols={3}>
                      <ModalidadesDropDown
                        label="Modalidade"
                        form={form}
                        disabled={
                          valoresIniciais?.modalidadeId || somenteConsulta
                        }
                        onChange={value => {
                          if (
                            value !== undefined &&
                            valoresIniciais.modalidadeId !== value
                          ) {
                            form.setFieldValue('turmaId', undefined);
                            setValoresIniciais({
                              ...valoresIniciais,
                              turmaId: undefined,
                            });
                            setListaProfessores([]);
                          }
                        }}
                        labelRequired
                      />
                    </Grid>
                    <Grid cols={2}>
                      <TurmasDropDown
                        label="Turma"
                        form={form}
                        onChange={value => {
                          if (!valoresIniciais.turmaId) {
                            setValoresForm({
                              ...valoresForm,
                              turmaId: value,
                            });
                          }
                        }}
                        desabilitado={somenteConsulta}
                        consideraHistorico={consideraHistorico}
                        labelRequired
                      />
                    </Grid>
                  </Row>
                </Form>
                <div className="col-md-12">
                  <Tabela
                    carregando={carregandoTabela}
                    lista={listaProfessores}
                    onChangeSubstituir={onChangeSubstituir}
                    somenteConsulta={somenteConsulta}
                  />
                  {auditoria && (
                    <div className="row">
                      <Auditoria
                        criadoEm={auditoria.criadoEm}
                        criadoPor={auditoria.criadoPor}
                        criadoRf={auditoria.criadoRf}
                        alteradoPor={auditoria.alteradoPor}
                        alteradoEm={auditoria.alteradoEm}
                        alteradoRf={auditoria.alteradoRf}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </Formik>
      </Loader>
    </>
  );
}

export default AtribuicaoCJForm;
