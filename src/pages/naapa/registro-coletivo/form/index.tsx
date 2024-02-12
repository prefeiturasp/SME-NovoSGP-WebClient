import { Auditoria } from '@/@legacy/componentes';
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
import { validateMessages } from '@/core/constants/validate-messages';
import { dayjs } from '@/core/date/dayjs';
import { ROUTES } from '@/core/enum/routes';
import { useAppSelector } from '@/core/hooks/use-redux';
import registroColetivoService from '@/core/services/registro-coletivo-service';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SGP_TEXT_AREA_OBSERVACAO } from '~/constantes/ids/text-area';
import { EditorDescricaoAcao } from './components/editor';
import { UploadArquivosSGP } from '@/components/sgp/upload';

export const FormRegistroColetivo: React.FC = () => {
  const usuarioStore = useAppSelector((store: any) => store?.usuario);
  const permissoesTela = usuarioStore.permissoes[ROUTES.NAAPA_REGISTRO_COLETIVO];

  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const location = useLocation();

  const [desabilitarCampos, setDesabilitarCampos] = useState<boolean>(false);

  const id = paramsRoute?.id || 0;

  const [formInitialValues, setFormInitialValues] = useState<any>();

  const anoAtual = dayjs().year();

  const auditoria: any = {
    criadoPor: formInitialValues?.criadoPor,
    criadoEm: formInitialValues?.criadoEm,
    criadoRF: formInitialValues?.criadoRF,
    alteradoPor: formInitialValues?.alteradoPor,
    alteradoEm: formInitialValues?.alteradoEm,
    alteradoRf: formInitialValues?.alteradoRF,
  };

  const tituloPagina = paramsRoute?.id ? 'Novo Registro coletivo' : 'Editar Registro coletivo';

  const carregarDados = useCallback(async () => {
    const resposta = await registroColetivoService.buscarPorId(id);

    if (resposta.sucesso) {
      // TODO
      const dados: any = {
        ...resposta.dados,
        dre: { id: resposta.dados.dreId, value: resposta.dados.dreCodigo },
        ue: { id: resposta.dados.ueId, value: resposta.dados.ueCodigo },
      };

      if (dados?.arquivos?.length) {
        dados.arquivos = dados.arquivos.map((item: any) => ({
          xhr: item?.codigo,
          name: item?.nome,
          id: item?.id,
          status: 'done',
        }));
      }

      setFormInitialValues(dados);
    }
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

    // TODO
    // setDesabilitarCampos(desabilitar);
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

    const valoresSalvar: any = { ...values, id };

    valoresSalvar.dreId = values.dre.id;
    valoresSalvar.ueId = values.ue.id;

    if (valoresSalvar?.arquivos?.length) {
      valoresSalvar.arquivos = valoresSalvar.arquivos?.map((item: any) => item?.id);
    } else {
      valoresSalvar.arquivos = [];
    }

    if (id) {
      response = await registroColetivoService.alterar(valoresSalvar);
    } else {
      response = await registroColetivoService.incluir(valoresSalvar);
    }

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
      const resultado = await registroColetivoService.excluir(id);

      if (resultado?.sucesso) {
        sucesso('Registro excluído com sucesso');
        navigate(ROUTES.NAAPA_REGISTRO_COLETIVO);
      }
    }
  };

  return (
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
          <Col span={24}>
            <Row gutter={[16, 8]}>
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
                  selectProps={{ disabled: desabilitarCampos }}
                  mostrarOpcaoTodas
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <SelectTipoReuniaoFormItem>
                  <SelectTipoReuniao disabled={desabilitarCampos} />
                </SelectTipoReuniaoFormItem>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <DataInicio
                  formItemProps={{ label: 'Data' }}
                  datePickerProps={{ disabled: desabilitarCampos, placeholder: 'Data' }}
                  desabilitarDataFutura
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={6}>
                <InputNumero
                  formItemProps={{
                    name: 'quantidadeParticipantes',
                    label: 'Quantidade de participantes',
                  }}
                  inputProps={{
                    maxLength: 999,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_QUANTIDADE_PARTICIPANTES,
                    placeholder: 'Quantidade de participantes',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={6}>
                <InputNumero
                  formItemProps={{
                    name: 'numeroEducadoresEnvolvidos',
                    label: 'Nº de educadores envolvidos',
                  }}
                  inputProps={{
                    maxLength: 999,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_NUMERO_EDUCADORES_ENVOLVIDOS,
                    placeholder: 'Nº de educadores envolvidos',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={12} lg={6}>
                <InputNumero
                  formItemProps={{
                    name: 'numeroEducandosEnvolvidos',
                    label: 'Nº de educandos envolvidos',
                  }}
                  inputProps={{
                    maxLength: 999,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_NUMERO_EDUCANDOS_ENVOLVIDOS,
                    placeholder: 'Nº de educandos envolvidos',
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <InputNumero
                  formItemProps={{
                    name: 'numeroCuidadoresResponsaveisEnvolvidos',
                    label: 'Nº de cuidadores/responsáveis envolvidos',
                  }}
                  inputProps={{
                    maxLength: 999,
                    disabled: desabilitarCampos,
                    id: SGP_INPUT_NUMERO_CUIDADORES_RESPONSAVEIS_ENVOLVIDOS,
                    placeholder: 'Nº de cuidadores/responsáveis envolvidos',
                  }}
                />
              </Col>

              <Col xs={24}>
                <EditorDescricaoAcao />
              </Col>

              <Col xs={24}>
                <Form.Item label="Observações" name="observacao">
                  <Input.TextArea
                    id={SGP_TEXT_AREA_OBSERVACAO}
                    placeholder="Observações"
                    disabled={desabilitarCampos}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <UploadArquivosSGP
                  formItemProps={{
                    name: 'anexos',
                    label: 'Anexos',
                  }}
                />
              </Col>
            </Row>
          </Col>
          {auditoria?.criadoRF ? <Auditoria {...auditoria} /> : <></>}
        </CardContent>
      </Form>
    </Col>
  );
};
