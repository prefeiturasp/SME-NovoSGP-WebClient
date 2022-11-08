import React, { useEffect, useState, useCallback } from 'react';
import { Row } from 'antd';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as Yup from 'yup';
import { Auditoria, Card, Loader, momentSchema } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { RotasDto } from '~/dtos';
import {
  erros,
  history,
  ServicoOcorrencias,
  setBreadcrumbManual,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import FormCadastroOcorrencia from './Cadastro/FormCadastroOcorrencia';
import BotoesCadastroOcorrencias from './Cadastro/BotoesCadastroOcorrencias';

const CadastroOcorrencias = () => {
  const routeMatch = useRouteMatch();

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const usuario = useSelector(state => state.usuario);
  const { permissoes } = usuario;
  const permissoesTela = permissoes[RotasDto.OCORRENCIAS];

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);

  const [carregandoOcorrencia, setCarregandoOcorrencia] = useState(false);
  const [auditoria, setAuditoria] = useState();

  const ocorrenciaId = routeMatch.params?.id;

  useEffect(() => {
    setSomenteConsulta(
      verificaSomenteConsulta(permissoes[RotasDto.OCORRENCIAS])
    );
  }, [permissoes]);

  const validarSeDesabilitaCampos = () => {
    if (ocorrenciaId > 0) {
      return !permissoesTela.podeAlterar || somenteConsulta;
    }
    return !permissoesTela.podeIncluir || somenteConsulta;
  };

  const desabilitarCampos = validarSeDesabilitaCampos();

  const inicial = {
    consideraHistorico: false,
    anoLetivo: undefined,
    dreId: undefined,
    ueId: undefined,
    modalidade: undefined,
    semestre: undefined,
    turmaId: null,
    dataOcorrencia: '',
    horaOcorrencia: '',
    ocorrenciaTipoId: undefined,
    titulo: '',
    descricao: '',
    codigosAlunos: [],
    codigosServidores: [],
  };

  const [initialValues, setInitialValues] = useState(
    ocorrenciaId ? null : inicial
  );

  const labelCampoObrigatorio = 'Campo obrigatório';

  const validacoes = Yup.object({
    anoLetivo: Yup.string().required(labelCampoObrigatorio),
    dreId: Yup.string().required(labelCampoObrigatorio),
    ueId: Yup.string().required(labelCampoObrigatorio),
    dataOcorrencia: momentSchema.required(labelCampoObrigatorio),
    ocorrenciaTipoId: Yup.string().required(labelCampoObrigatorio),
    titulo: Yup.string()
      .required(labelCampoObrigatorio)
      .min(10, 'O título deve ter pelo menos 10 caracteres'),
    descricao: Yup.string().required(labelCampoObrigatorio),
  });

  const onChangeCampos = () => {
    setModoEdicao(true);
  };

  const onClickCadastrar = valores => {
    const params = {
      ...valores,
      horaOcorrencia: valores?.horaOcorrencia
        ? valores.horaOcorrencia.format('HH:mm').toString()
        : null,
    };

    if (ocorrenciaId) {
      params.id = ocorrenciaId;
      ServicoOcorrencias.alterar(params)
        .then(() => {
          sucesso('Ocorrência alterada com sucesso');
          history.push(RotasDto.OCORRENCIAS);
        })
        .catch(e => erros(e));
    } else {
      ServicoOcorrencias.incluir(params)
        .then(() => {
          sucesso('Ocorrência cadastrada com sucesso');
          history.push(RotasDto.OCORRENCIAS);
        })
        .catch(e => erros(e));
    }
  };

  const tratarValores = ocorrencia => {
    const dados = {};
    dados.dataOcorrencia = window.moment(new Date(ocorrencia.dataOcorrencia));
    dados.turmaId = ocorrencia?.turmaId
      ? ocorrencia.turmaId.toString()
      : undefined;
    dados.dreId = ocorrencia?.dreId ? ocorrencia.dreId.toString() : undefined;
    dados.ueId = ocorrencia?.ueId ? ocorrencia.ueId.toString() : undefined;

    const data = new Date(ocorrencia.dataOcorrencia);
    const horaMin = ocorrencia.horaOcorrencia.split(':');
    data.setHours(ocorrencia.horaOcorrencia ? horaMin[0] : '');
    data.setMinutes(ocorrencia.horaOcorrencia ? horaMin[1] : '');
    if (ocorrencia?.horaOcorrencia) {
      ocorrencia.horaOcorrencia = window.moment(new Date(data));
    }

    if (ocorrencia?.alunos?.length) {
      ocorrencia.codigosAlunos = ocorrencia.alunos.map(a =>
        a?.codigoAluno?.toString()
      );
    }
    if (ocorrencia?.servidores?.length) {
      ocorrencia.codigosServidores = ocorrencia.servidores.map(a =>
        a?.codigoServidor?.toString()
      );
    }
    setAuditoria(ocorrencia.auditoria);

    return { ...ocorrencia, ...dados };
  };

  const obterComunicadoPorId = useCallback(async () => {
    setCarregandoOcorrencia(true);
    const resposta = await ServicoOcorrencias.buscarOcorrencia(ocorrenciaId)
      .catch(e => erros(e))
      .finally(() => setCarregandoOcorrencia(false));

    if (resposta?.data) {
      const valoresTratados = tratarValores(resposta.data);
      setInitialValues(valoresTratados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocorrenciaId]);

  useEffect(() => {
    if (ocorrenciaId) {
      setBreadcrumbManual(
        routeMatch.url,
        'Alterar ocorrência',
        RotasDto.OCORRENCIAS
      );
      obterComunicadoPorId();
    }
  }, [ocorrenciaId, routeMatch, obterComunicadoPorId]);

  return (
    <Loader loading={carregandoOcorrencia}>
      {initialValues ? (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validacoes}
          validateOnBlur
          validateOnChange
          onSubmit={valores => onClickCadastrar(valores)}
        >
          {form => (
            <>
              <Cabecalho pagina="Cadastro de ocorrência">
                <Row gutter={[8, 8]} type="flex">
                  <BotoesCadastroOcorrencias
                    form={form}
                    initialValues={initialValues}
                    ocorrenciaId={ocorrenciaId}
                    modoEdicao={modoEdicao}
                    setModoEdicao={setModoEdicao}
                    somenteConsulta={somenteConsulta}
                    desabilitar={desabilitarCampos}
                    podeExcluir={permissoesTela?.podeExcluir}
                    listaUes={listaUes}
                  />
                </Row>
              </Cabecalho>
              <Card padding="24px 24px">
                <FormCadastroOcorrencia
                  form={form}
                  onChangeCampos={onChangeCampos}
                  desabilitar={desabilitarCampos || somenteConsulta}
                  ocorrenciaId={ocorrenciaId}
                  setListaDres={setListaDres}
                  listaDres={listaDres}
                  setListaUes={setListaUes}
                  listaUes={listaUes}
                />
                {auditoria?.criadoEm ? (
                  <div className="row">
                    <Auditoria
                      criadoEm={auditoria.criadoEm}
                      criadoPor={auditoria.criadoPor}
                      criadoRf={auditoria.criadoRF}
                      alteradoPor={auditoria.alteradoPor}
                      alteradoEm={auditoria.alteradoEm}
                      alteradoRf={auditoria.alteradoRF}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </Card>
            </>
          )}
        </Formik>
      ) : (
        <></>
      )}
    </Loader>
  );
};

export default CadastroOcorrencias;
