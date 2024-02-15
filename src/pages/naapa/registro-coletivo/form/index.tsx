import { Auditoria, Loader } from '@/@legacy/componentes';
import BotaoExcluirPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_CANCELAR, SGP_BUTTON_SALVAR_ALTERAR } from '@/@legacy/constantes/ids/button';
import {
  SGP_INPUT_NUMERO_CUIDADORES_RESPONSAVEIS_ENVOLVIDOS,
  SGP_INPUT_NUMERO_EDUCADORES_ENVOLVIDOS,
  SGP_INPUT_NUMERO_EDUCANDOS_ENVOLVIDOS,
  SGP_INPUT_QUANTIDADE_PARTICIPANTES,
} from '@/@legacy/constantes/ids/input';
import {
  confirmar,
  setBreadcrumbManual,
  sucesso,
  verificaSomenteConsulta,
} from '@/@legacy/servicos';
import ButtonPrimary from '@/components/lib/button/primary';
import ButtonSecundary from '@/components/lib/button/secundary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import DataInicio from '@/components/sgp/inputs/form/data-inicio';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import InputNumero from '@/components/sgp/inputs/form/numero';
import {
  SelectTipoReuniao,
  SelectTipoReuniaoFormItem,
} from '@/components/sgp/inputs/form/tipo-reuniao';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { UploadArquivosSGP } from '@/components/sgp/upload';
import { URL_API_REGISTRO_COLETIVO } from '@/core/constants/urls-api';
import { validateMessages } from '@/core/constants/validate-messages';
import { dayjs } from '@/core/date/dayjs';
import { AnexoDto } from '@/core/dto/AnexoDto';
import { AnexoFormDto } from '@/core/dto/AnexoFormDto';
import { ArquivoAnexoRegistroColetivoDto } from '@/core/dto/ArquivoAnexoRegistroColetivoDto';
import { RegistroColetivoCompletoFormDto } from '@/core/dto/RegistroColetivoCompletoDto';
import { RegistroColetivoDto } from '@/core/dto/RegistroColetivoDto';
import { ROUTES } from '@/core/enum/routes';
import { useAppSelector } from '@/core/hooks/use-redux';
import registroColetivoService from '@/core/services/registro-coletivo-service';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SGP_TEXT_AREA_OBSERVACAO } from '~/constantes/ids/text-area';
import { EditorDescricaoAcao } from './components/editor';

export const FormRegistroColetivo: React.FC = () => {
  const usuarioStore = useAppSelector((store: any) => store?.usuario);
  const permissoesTela = usuarioStore.permissoes[ROUTES.NAAPA_REGISTRO_COLETIVO];

  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const location = useLocation();

  const [desabilitarCampos, setDesabilitarCampos] = useState<boolean>(false);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);

  const id = Number(paramsRoute?.id) || 0;

  const [formInitialValues, setFormInitialValues] = useState<RegistroColetivoCompletoFormDto>();

  const anoAtual = dayjs().year();

  const auditoria: any = { ...formInitialValues?.auditoria };

  const tituloPagina = id ? 'Editar Registro coletivo' : 'Novo Registro coletivo';

  const carregarDados = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await registroColetivoService.buscarPorId(id);

    if (resposta.sucesso) {
      const dados = resposta.dados;

      let anexos: AnexoFormDto[] = [];

      if (dados?.anexos?.length) {
        anexos = dados.anexos.map(
          (item: ArquivoAnexoRegistroColetivoDto): AnexoFormDto => ({
            xhr: item.codigo,
            name: item.nome,
            id: item.id,
            status: 'done',
          }),
        );
      }

      const dadosMapeados: RegistroColetivoCompletoFormDto = {
        id: dados.id,
        anoLetivo: dados.anoLetivo,
        dre: {
          id: resposta.dados.dreId,
          value: resposta.dados.codigoDre,
          label: resposta.dados.nomeDre,
        },
        ue: resposta.dados.ues.map((ue) => ({
          id: ue.id,
          value: ue.codigo,
          label: ue.nomeFormatado,
        })),
        tipoReuniaoId: dados.tipoReuniaoId,
        dataRegistro: dayjs(dados.dataRegistro),
        quantidadeParticipantes: dados.quantidadeParticipantes,
        quantidadeEducadores: dados.quantidadeEducadores,
        quantidadeEducandos: dados.quantidadeEducandos,
        quantidadeCuidadores: dados.quantidadeCuidadores,
        descricao: dados.descricao,
        observacao: dados.observacao,
        anexos,
        auditoria: {
          id: dados.id,
          alteradoEm: dados.alteradoEm,
          alteradoPor: dados.alteradoPor,
          alteradoRF: dados.alteradoRF,
          criadoEm: dados.criadoEm,
          criadoPor: dados.criadoPor,
          criadoRF: dados.criadoRF,
        },
      };

      setFormInitialValues(dadosMapeados);
    }

    setExibirLoader(false);
  }, [id]);

  useEffect(() => {
    if (id) {
      setBreadcrumbManual(
        location.pathname,
        'Editar Registro coletivo',
        ROUTES.NAAPA_REGISTRO_COLETIVO,
      );
    }
  }, [id, location]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);

    const desabilitar = id
      ? soConsulta || !permissoesTela?.podeIncluir
      : soConsulta || !permissoesTela?.podeAlterar;

    setDesabilitarCampos(desabilitar);
  }, [id, permissoesTela]);

  const onClickCancelar = async () => {
    if (form.isFieldsTouched()) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?',
      );
      if (confirmou) {
        form.resetFields();
      }
    }
  };

  const salvar = async () => {
    let response = null;
    const values = form.getFieldsValue(true);

    const clonedValues = cloneDeep(values);

    const ueIds = clonedValues.ue.map((item: any) => item.id);

    const valoresSalvar: RegistroColetivoDto = {
      dreId: clonedValues.dre.id,
      ueIds,
      tipoReuniaoId: clonedValues?.tipoReuniaoId,
      dataRegistro: clonedValues?.dataRegistro,
      quantidadeParticipantes: clonedValues?.quantidadeParticipantes,
      quantidadeEducadores: clonedValues?.quantidadeEducadores,
      quantidadeEducandos: clonedValues?.quantidadeEducandos,
      quantidadeCuidadores: clonedValues?.quantidadeCuidadores,
      descricao: clonedValues?.descricao,
      observacao: clonedValues?.observacao,
      anexos: [],
    };

    if (clonedValues?.anexos?.length) {
      const anexos: AnexoDto[] = clonedValues.anexos?.map(
        (item: any): AnexoDto => ({
          anexoId: item?.xhr || '',
          arquivoId: item?.id || null,
        }),
      );
      valoresSalvar.anexos = anexos;
    } else {
      valoresSalvar.anexos = [];
    }

    setExibirLoader(true);

    if (id) {
      valoresSalvar.id = id;
      response = await registroColetivoService.alterar(valoresSalvar);
    } else {
      valoresSalvar.id = null;
      response = await registroColetivoService.salvar(valoresSalvar);
    }

    setExibirLoader(false);

    if (response.sucesso) {
      sucesso(`Registro ${id ? 'alterado' : 'inserido'} com sucesso!`);
      navigate(ROUTES.NAAPA_REGISTRO_COLETIVO);
    }
  };

  const onClickVoltar = async () => {
    if (form.isFieldsTouched()) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?',
      );

      if (confirmou) {
        form.submit();
      } else {
        navigate(ROUTES.NAAPA_REGISTRO_COLETIVO);
      }
    } else {
      navigate(ROUTES.NAAPA_REGISTRO_COLETIVO);
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?',
    );
    if (confirmado) {
      setExibirLoader(true);
      const resultado = await registroColetivoService.excluir(id);

      if (resultado?.sucesso) {
        sucesso('Registro excluído com sucesso');
        navigate(ROUTES.NAAPA_REGISTRO_COLETIVO);
      }

      setExibirLoader(false);
    }
  };

  return (
    <Loader loading={exibirLoader}>
      <Col>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={salvar}
          validateMessages={validateMessages}
          initialValues={{
            anoLetivo: anoAtual,
            consideraHistorico: false,
            ...formInitialValues,
          }}
        >
          <HeaderPage title={tituloPagina}>
            <Col span={24}>
              <Row gutter={[8, 8]}>
                <Col>
                  <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
                </Col>
                {id ? (
                  <Col>
                    <BotaoExcluirPadrao
                      onClick={onClickExcluir}
                      disabled={!permissoesTela?.podeExcluir}
                    />
                  </Col>
                ) : (
                  <></>
                )}
                <Col>
                  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                    {() => (
                      <ButtonSecundary
                        id={SGP_BUTTON_CANCELAR}
                        onClick={() => onClickCancelar()}
                        disabled={desabilitarCampos || !form.isFieldsTouched()}
                      >
                        Cancelar
                      </ButtonSecundary>
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <ButtonPrimary
                    id={SGP_BUTTON_SALVAR_ALTERAR}
                    htmlType="submit"
                    disabled={desabilitarCampos}
                  >
                    {id ? 'Alterar' : 'Salvar'}
                  </ButtonPrimary>
                </Col>
              </Row>
            </Col>
          </HeaderPage>
          <CardContent>
            <Row gutter={24}>
              <Form.Item name="consideraHistorico" valuePropName="checked" hidden>
                <Checkbox />
              </Form.Item>

              <Form.Item name="anoLetivo" hidden>
                <Input type="text" />
              </Form.Item>

              <Col xs={24} md={12}>
                <SelectDRE
                  formItemProps={{ rules: [{ required: true }] }}
                  selectProps={{ disabled: desabilitarCampos }}
                />
              </Col>

              <Col xs={24} md={12}>
                <SelectUE
                  formItemProps={{ rules: [{ required: true }] }}
                  selectProps={{ disabled: desabilitarCampos, mode: 'multiple' }}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <SelectTipoReuniaoFormItem rules={[{ required: true }]}>
                  <SelectTipoReuniao disabled={desabilitarCampos} />
                </SelectTipoReuniaoFormItem>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <DataInicio
                  formItemProps={{
                    label: 'Data',
                    name: 'dataRegistro',
                    rules: [{ required: true }],
                  }}
                  datePickerProps={{ placeholder: 'Data', disabled: desabilitarCampos }}
                  desabilitarDataFutura
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={6}>
                <InputNumero
                  formItemProps={{
                    name: 'quantidadeParticipantes',
                    label: 'Quantidade de participantes',
                    rules: [{ required: true }],
                  }}
                  inputProps={{
                    maxLength: 3,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_QUANTIDADE_PARTICIPANTES,
                    placeholder: 'Quantidade de participantes',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={6}>
                <InputNumero
                  formItemProps={{
                    name: 'quantidadeEducadores',
                    label: 'Nº de educadores envolvidos',
                    rules: [{ required: true }],
                  }}
                  inputProps={{
                    maxLength: 3,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_NUMERO_EDUCADORES_ENVOLVIDOS,
                    placeholder: 'Nº de educadores envolvidos',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={6}>
                <InputNumero
                  formItemProps={{
                    name: 'quantidadeEducandos',
                    label: 'Nº de educandos envolvidos',
                    rules: [{ required: true }],
                  }}
                  inputProps={{
                    maxLength: 3,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_NUMERO_EDUCANDOS_ENVOLVIDOS,
                    placeholder: 'Nº de educandos envolvidos',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <InputNumero
                  formItemProps={{
                    name: 'quantidadeCuidadores',
                    label: 'Nº de cuidadores/responsáveis envolvidos',
                    rules: [{ required: true }],
                  }}
                  inputProps={{
                    maxLength: 3,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_NUMERO_CUIDADORES_RESPONSAVEIS_ENVOLVIDOS,
                    placeholder: 'Nº de cuidadores/responsáveis envolvidos',
                  }}
                />
              </Col>

              <Col xs={24}>
                <EditorDescricaoAcao disabled={desabilitarCampos} />
              </Col>

              <Col xs={24}>
                <Form.Item label="Observações" name="observacao">
                  <Input.TextArea
                    id={SGP_TEXT_AREA_OBSERVACAO}
                    placeholder="Observações"
                    disabled={desabilitarCampos}
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <UploadArquivosSGP
                  urlUpload={`${URL_API_REGISTRO_COLETIVO}/upload`}
                  formItemProps={{
                    name: 'anexos',
                    label: 'Anexos',
                  }}
                  draggerProps={{ disabled: desabilitarCampos }}
                />
              </Col>

              {auditoria?.criadoRF ? <Auditoria {...auditoria} ignorarMarginTop /> : <></>}
            </Row>
          </CardContent>
        </Form>
      </Col>
    </Loader>
  );
};
