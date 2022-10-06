import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import {
  Card,
  ButtonGroup,
  Grid,
  Localizador,
  CampoData,
  momentSchema,
  Loader,
  Auditoria,
  CheckboxComponent,
  SelectComponent,
} from '~/componentes';
import DreDropDown from '../componentes/DreDropDown';
import UeDropDown from '../componentes/UeDropDown';

import RotasDto from '~/dtos/rotasDto';
import history from '~/servicos/history';
import AtribuicaoEsporadicaServico from '~/servicos/Paginas/AtribuicaoEsporadica';
import {
  erros,
  erro,
  sucesso,
  confirmar,
  setBreadcrumbManual,
  verificaSomenteConsulta,
} from '~/servicos';

import { validaSeObjetoEhNuloOuVazio } from '~/utils';

import { Row } from './styles';
import { SGP_BUTTON_ALTERAR_CADASTRAR } from '~/componentes-sgp/filtro/idsCampos';

function AtribuicaoEsporadicaForm({ match }) {
  const [carregando, setCarregando] = useState(false);
  const permissoesTela = useSelector(store => store.usuario.permissoes);
  const somenteConsulta = verificaSomenteConsulta(
    permissoesTela[RotasDto.ATRIBUICAO_ESPORADICA_LISTA]
  );
  const filtroListagem = useSelector(
    store => store.atribuicaoEsporadica.filtro
  );
  const [dreId, setDreId] = useState('');
  const [ueCodigo, setUeCodigo] = useState('');
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [auditoria, setAuditoria] = useState({});
  const [valoresCarregados, setValoresCarregados] = useState(null);
  const [refForm, setRefForm] = useState({});

  const anoAtual = window.moment().format('YYYY');
  const [ehInfantil, setEhInfantil] = useState(false);

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [anoLetivo, setAnoLetivo] = useState();
  const [periodos, setPeriodos] = useState();

  const valorPadrao = useMemo(() => {
    const anoValidar = anoLetivo || anoAtual;
    if (anoValidar) {
      const dataParcial = moment().format('MM-DD');
      const dataInteira = moment(`${dataParcial}-${anoValidar}`);
      return dataInteira;
    }
    return '';
  }, [anoLetivo, anoAtual]);

  const [valoresIniciais, setValoresIniciais] = useState({
    professorRf: '',
    professorNome: '',
    dataInicio: valorPadrao,
    dataFim: valorPadrao,
    ueId: '',
    dreId: '',
    anoLetivo: anoAtual,
  });

  const labelBotaoPrincipal = match?.params?.id ? 'Alterar' : 'Cadastrar';
  const validacoes = () => {
    return Yup.object({
      ueId: momentSchema.required('Campo obrigatório'),
      dreId: momentSchema.required('Campo obrigatório'),
      dataInicio: momentSchema.required('Campo obrigatório'),
      dataFim: momentSchema.required('Campo obrigatório'),
      professorRf: Yup.number()
        .typeError('Informar um número inteiro')
        .required('Campo obrigatório'),
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
    try {
      setCarregando(true);
      const cadastrado = await AtribuicaoEsporadicaServico.salvarAtribuicaoEsporadica(
        {
          ...filtroListagem,
          ...valores,
          ehInfantil,
        }
      );
      if (cadastrado && cadastrado.status === 200) {
        setCarregando(false);
        sucesso(
          `Atribuição esporádica ${
            match?.params?.id ? 'alterada' : 'salva'
          } com sucesso.`
        );
        history.push(RotasDto.ATRIBUICAO_ESPORADICA_LISTA);
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
        history.push(RotasDto.ATRIBUICAO_ESPORADICA_LISTA);
      }
    } else {
      history.push(RotasDto.ATRIBUICAO_ESPORADICA_LISTA);
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
      setModoEdicao(false);
      const nextValues = {
        professorRf: valoresIniciais?.professorRf,
        professorNome: valoresIniciais?.professorNome,
        dataInicio: valoresIniciais?.dataInicio,
        dataFim: valoresIniciais?.dataFim,
        anoLetivo: valoresIniciais?.anoLetivo,
      };
      if (listaDres?.length > 1) {
        form.setFieldValue('dreId', valoresIniciais?.dreId);
        nextValues.dreId = valoresIniciais?.dreId;
      } else {
        nextValues.dreId = form?.values?.dreId;
      }
      if (listaUes?.length > 1) {
        form.setFieldValue('ueId', valoresIniciais?.ueId);
        nextValues.ueId = valoresIniciais?.ueId;
      } else {
        nextValues.ueId = form?.values?.ueId;
      }
      form.setFieldValue('professorRf', valoresIniciais?.professorRf);
      form.setFieldValue('professorNome', valoresIniciais?.professorNome);
      form.setFieldValue('dataInicio', valoresIniciais?.dataInicio);
      form.setFieldValue('dataFim', valoresIniciais?.dataFim);
      form.setFieldValue('anoLetivo', valoresIniciais?.anoLetivo);
      form.resetForm(nextValues);
    }
  };

  const onClickExcluir = async form => {
    if (validaSeObjetoEhNuloOuVazio(form.values)) return;

    const confirmado = await confirmar(
      'Excluir atribuição',
      form.values.professorNome,
      `Deseja realmente excluir este item?`,
      'Excluir',
      'Cancelar'
    );
    if (confirmado) {
      const excluir = await AtribuicaoEsporadicaServico.deletarAtribuicaoEsporadica(
        form.values.id
      ).catch(e => erros(e));
      if (excluir) {
        sucesso(`Atribuição excluida com sucesso!`);
        history.push(RotasDto.ATRIBUICAO_ESPORADICA_LISTA);
      }
    }
  };

  const buscarPorId = async id => {
    try {
      setCarregando(true);
      const registro = await AtribuicaoEsporadicaServico.buscarAtribuicaoEsporadica(
        id
      );
      if (registro && registro.data) {
        setValoresIniciais({
          ...registro.data,
          dataInicio: window.moment(registro.data.dataInicio),
          dataFim: window.moment(registro.data.dataFim),
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

        setValoresCarregados(true);
        setCarregando(false);
      }
    } catch (err) {
      setValoresCarregados(true);
      setCarregando(false);
      erros(err);
    }
  };

  const onChangeCampos = () => {
    if (valoresCarregados) {
      setModoEdicao(true);
    }
  };

  useEffect(() => {
    if (match?.params?.id) {
      setNovoRegistro(false);
      setBreadcrumbManual(
        match.url,
        'Atribuição',
        RotasDto.ATRIBUICAO_ESPORADICA_LISTA
      );
      buscarPorId(match.params.id);
    } else {
      setTimeout(() => {
        setValoresCarregados(true);
      }, 1500);
    }
  }, [match]);

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    refForm.setFieldValue('anoLetivo', anoAtual);
    onChangeCampos();
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
    onChangeCampos();
  };

  const obterPeriodos = useCallback(
    async ueId => {
      const retorno = await AtribuicaoEsporadicaServico.obterPeriodos(
        ueId,
        anoLetivo || valoresIniciais?.anoLetivo
      ).catch(e => erros(e));

      if (retorno?.data) {
        setPeriodos(retorno.data);
        if (!match?.params?.id) {
          refForm.setFieldValue('dataInicio', moment(retorno.data.dataInicio));
          refForm.setFieldValue('dataFim', moment(retorno.data.dataFim));
        }
      }
    },
    [anoLetivo, refForm, match, valoresIniciais]
  );

  useEffect(() => {
    const ueComparacao = ueCodigo || valoresIniciais?.ueId;
    const ue = listaUes.find(item => item.valor === ueComparacao);
    const ueId = ue?.id;
    if (ueId) {
      obterPeriodos(ueId);
    }
  }, [obterPeriodos, listaUes, ueCodigo, valoresIniciais]);

  const desabilitarData = dataCorrente =>
    dataCorrente <= moment(periodos?.dataInicio) ||
    dataCorrente >= moment(periodos?.dataFim);

  return (
    <>
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
              <Cabecalho pagina="Atribuição">
                <ButtonGroup
                  form={form}
                  permissoesTela={
                    permissoesTela[RotasDto.ATRIBUICAO_ESPORADICA_LISTA]
                  }
                  novoRegistro={novoRegistro}
                  labelBotaoPrincipal={labelBotaoPrincipal}
                  onClickBotaoPrincipal={() => onClickBotaoPrincipal(form)}
                  onClickCancelar={formulario => onClickCancelar(formulario)}
                  onClickVoltar={() => onClickVoltar(form)}
                  onClickExcluir={() => onClickExcluir(form)}
                  modoEdicao={modoEdicao}
                  idBotaoPrincipal={SGP_BUTTON_ALTERAR_CADASTRAR}
                  desabilitarBotaoPrincipal={match?.params?.id && !modoEdicao}
                />
              </Cabecalho>
              <Card>
                <Form className="col-md-12">
                  <Row className="row mb-2">
                    <CheckboxComponent
                      name="exibirHistorico"
                      form={form}
                      label="Exibir histórico?"
                      onChangeCheckbox={onChangeConsideraHistorico}
                      checked={consideraHistorico}
                      disabled={listaAnosLetivo.length === 1}
                    />
                  </Row>
                  <Row className="row">
                    <Grid cols={2}>
                      <SelectComponent
                        name="anoLetivo"
                        label="Ano Letivo"
                        form={form}
                        lista={listaAnosLetivo}
                        valueOption="valor"
                        valueText="desc"
                        disabled={
                          !consideraHistorico || listaAnosLetivo?.length === 1
                        }
                        onChange={onChangeAnoLetivo}
                        valueSelect={anoLetivo}
                        placeholder="Ano letivo"
                        labelRequired
                      />
                    </Grid>
                    <Grid cols={5}>
                      <DreDropDown
                        label="Diretoria Regional de Educação (DRE)"
                        form={form}
                        onChange={(valor, lista) => {
                          setDreId(valor);
                          setListaDres(lista);
                          setUeCodigo('');
                          form.setFieldValue('ueId', '');
                          onChangeCampos();
                        }}
                        desabilitado={somenteConsulta}
                        labelRequired
                      />
                    </Grid>
                    <Grid cols={5}>
                      <UeDropDown
                        label="Unidade Escolar (UE)"
                        dreId={dreId}
                        form={form}
                        onChange={(codigo, infantil, lista) => {
                          setUeCodigo(codigo);
                          setEhInfantil(infantil);
                          setListaUes(lista);
                          onChangeCampos();
                        }}
                        desabilitado={somenteConsulta}
                        preencherLista={setListaUes}
                        labelRequired
                      />
                    </Grid>
                  </Row>
                  <Row className="row">
                    <Grid cols={8}>
                      <Row className="row">
                        <Localizador
                          dreId={form.values.dreId}
                          anoLetivo={form.values.anoLetivo}
                          showLabel
                          form={form}
                          onChange={valorLocalizador => {
                            if (
                              valorLocalizador?.professorRf !==
                              valoresIniciais?.professorRf
                            ) {
                              onChangeCampos();
                            }
                          }}
                          desabilitado={somenteConsulta || valoresIniciais.id}
                          labelRequired
                        />
                      </Row>
                    </Grid>
                    <Grid cols={2}>
                      <CampoData
                        placeholder="Selecione"
                        label="Data Início"
                        form={form}
                        name="dataInicio"
                        formatoData="DD/MM/YYYY"
                        desabilitado={somenteConsulta}
                        desabilitarData={desabilitarData}
                        valorPadrao={valorPadrao}
                        labelRequired
                        onChange={() => {
                          onChangeCampos();
                        }}
                      />
                    </Grid>
                    <Grid cols={2}>
                      <CampoData
                        placeholder="Selecione"
                        label="Data Fim"
                        form={form}
                        name="dataFim"
                        formatoData="DD/MM/YYYY"
                        desabilitado={somenteConsulta}
                        desabilitarData={desabilitarData}
                        valorPadrao={valorPadrao}
                        labelRequired
                        onChange={() => {
                          onChangeCampos();
                        }}
                      />
                    </Grid>
                  </Row>
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
                </Form>
              </Card>
            </>
          )}
        </Formik>
      </Loader>
    </>
  );
}

AtribuicaoEsporadicaForm.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
};

AtribuicaoEsporadicaForm.defaultProps = {
  match: {},
};

export default AtribuicaoEsporadicaForm;
