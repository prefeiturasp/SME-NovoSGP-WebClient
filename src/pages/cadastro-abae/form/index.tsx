import { Auditoria } from '@/@legacy/componentes';
import BotaoExcluirPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_CANCELAR, SGP_BUTTON_SALVAR_ALTERAR } from '@/@legacy/constantes/ids/button';
import {
  SGP_INPUT_BAIRRO,
  SGP_INPUT_CEP,
  SGP_INPUT_CIDADE,
  SGP_INPUT_COMPLEMENTO,
  SGP_INPUT_CPF,
  SGP_INPUT_EMAIL,
  SGP_INPUT_ENDERECO,
  SGP_INPUT_NOME,
  SGP_INPUT_NUMERO,
  SGP_INPUT_TELEFONE,
} from '@/@legacy/constantes/ids/input';
import { SGP_RADIO_ATIVO_INATIVO } from '@/@legacy/constantes/ids/radio';
import { SGP_SELECT_UF } from '@/@legacy/constantes/ids/select';
import { confirmar, sucesso } from '@/@legacy/servicos';
import ButtonPrimary from '@/components/lib/button/primary';
import ButtonSecundary from '@/components/lib/button/secundary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import InputBairro from '@/components/sgp/inputs/form/bairro';
import InputCEP from '@/components/sgp/inputs/form/cep';
import InputCidade from '@/components/sgp/inputs/form/cidade';
import InputComplemento from '@/components/sgp/inputs/form/complemento';
import InputCPF from '@/components/sgp/inputs/form/cpf';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import InputEmail from '@/components/sgp/inputs/form/email';
import InputEndereco from '@/components/sgp/inputs/form/endereco';
import InputEstado from '@/components/sgp/inputs/form/estado';
import InputNumero from '@/components/sgp/inputs/form/numero';
import RadioSituacaoAtivoInativo from '@/components/sgp/inputs/form/situacao-ativo-inativo/radio-situacao-ativo-inativo';
import InputTelefone from '@/components/sgp/inputs/form/telefone';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { validateMessages } from '@/core/constants/validate-messages';
import { CadastroAcessoABAEDto, CadastroAcessoABAEFormDto } from '@/core/dto/CadastroAcessoABAEDto';
import { ROUTES } from '@/core/enum/routes';
import abaeService from '@/core/services/abae-service';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FormCadastroABAE: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const id = paramsRoute?.id || 0;

  const [formInitialValues, setFormInitialValues] = useState<CadastroAcessoABAEFormDto>();

  const auditoria: any = {
    criadoPor: formInitialValues?.criadoPor,
    criadoEm: formInitialValues?.criadoEm,
    criadoRF: formInitialValues?.criadoRF,
    alteradoPor: formInitialValues?.alteradoPor,
    alteradoEm: formInitialValues?.alteradoEm,
    alteradoRf: formInitialValues?.alteradoRF,
  };

  const tituloPagina = paramsRoute?.id ? 'Cadastro de ABAE' : 'Novo Cadastro de ABAE';

  const carregarDados = useCallback(async () => {
    const resposta = await abaeService.buscarPorId(id);

    if (resposta.sucesso) {
      const dados: CadastroAcessoABAEFormDto = {
        ...resposta.dados,
        dre: { id: resposta.dados.dreId },
        ue: { id: resposta.dados.ueId },
      };
      setFormInitialValues(dados);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [carregarDados, id]);

  useEffect(() => {
    form.resetFields();
  }, [form, formInitialValues]);

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

  const salvar = async (values: CadastroAcessoABAEFormDto) => {
    let response = null;
    const valoresSalvar: CadastroAcessoABAEDto = { ...values };

    valoresSalvar.dreId = values.dre.id;
    valoresSalvar.ueId = values.ue.id;

    if (id) {
      response = await abaeService.alterar(valoresSalvar);
    } else {
      response = await abaeService.incluir(valoresSalvar);
    }

    if (response.sucesso) {
      sucesso(`Registro ${id ? 'alterado' : 'inserido'} com sucesso!`);
      navigate(ROUTES.CADASTRO_ABAE);
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
        navigate(ROUTES.CADASTRO_ABAE);
      }
    } else {
      navigate(ROUTES.CADASTRO_ABAE);
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?',
    );
    if (confirmado) {
      const resultado = await abaeService.excluir(id);

      if (resultado?.sucesso) {
        sucesso('Registro excluído com sucesso');
        navigate(ROUTES.CADASTRO_ABAE);
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
          anoLetivo: 2023,
          consideraHistorico: false,
          situacao: true,
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
                  <BotaoExcluirPadrao onClick={onClickExcluir} />
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
                      disabled={!form.isFieldsTouched()}
                    >
                      Cancelar
                    </ButtonSecundary>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <ButtonPrimary id={SGP_BUTTON_SALVAR_ALTERAR} htmlType="submit">
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
                <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={12}>
                <SelectUE formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
                  <Input maxLength={100} id={SGP_INPUT_NOME} placeholder="Informe o nome" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <InputCPF
                  inputProps={{
                    id: SGP_INPUT_CPF,
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <InputEmail inputProps={{ id: SGP_INPUT_EMAIL }} />
              </Col>

              <Col xs={24} md={12}>
                <InputTelefone inputProps={{ id: SGP_INPUT_TELEFONE }} />
              </Col>

              <Col xs={24} md={12}>
                <InputCEP
                  inputProps={{
                    id: SGP_INPUT_CEP,
                  }}
                />
              </Col>

              <Col xs={24} md={12}>
                <InputEndereco inputProps={{ id: SGP_INPUT_ENDERECO }} />
              </Col>

              <Col xs={24} md={12}>
                <InputNumero inputProps={{ id: SGP_INPUT_NUMERO }} />
              </Col>

              <Col xs={24} md={12}>
                <InputComplemento inputProps={{ id: SGP_INPUT_COMPLEMENTO }} />
              </Col>

              <Col xs={24} md={12}>
                <InputBairro inputProps={{ id: SGP_INPUT_BAIRRO }} />
              </Col>

              <Col xs={24} md={12}>
                <InputCidade inputProps={{ id: SGP_INPUT_CIDADE }} />
              </Col>

              <Col xs={24} md={12}>
                <InputEstado selectProps={{ id: SGP_SELECT_UF }} />
              </Col>

              <Col xs={24} md={12}>
                <RadioSituacaoAtivoInativo radioGroupProps={{ id: SGP_RADIO_ATIVO_INATIVO }} />
              </Col>
            </Row>
          </Col>
          {auditoria?.criadoRF ? <Auditoria {...auditoria} /> : <></>}
        </CardContent>
      </Form>
    </Col>
  );
};

export default FormCadastroABAE;
