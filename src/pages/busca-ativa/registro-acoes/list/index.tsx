import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '@/@legacy/constantes/ids/button';
import { SGP_INPUT_NOME } from '@/@legacy/constantes/ids/input';
import ButtonPrimary from '@/components/lib/button/primary';
import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectAnoLetivo from '@/components/sgp/inputs/form/anoLetivo';
import DataFim from '@/components/sgp/inputs/form/data-fim';
import DataInicio from '@/components/sgp/inputs/form/data-inicio';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import RadioEntrouContatoFamiliaPor from '@/components/sgp/inputs/form/entrou-contato-familia-por';
import CheckboxExibirHistorico from '@/components/sgp/inputs/form/exibir-historico';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { validateMessages } from '@/core/constants/validate-messages';
import { ROUTES } from '@/core/enum/routes';
import { Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verificaSomenteConsulta } from '~/servicos';
import ListaPaginadaBuscaAtivaRegistroAcoes from './lista-paginada';
import { OrdemProcedimentoRealizadoEnum } from '@/core/enum/ordem-procedimento-realizado-enum';

const BuscaAtivaRegistroAcoesList: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();

  const usuario = useSelector((state: any) => state.usuario);
  const { permissoes } = usuario;
  const permissoesTela = permissoes?.[ROUTES.BUSCA_ATIVA_REGISTRO_ACOES];

  const podeIncluir = permissoesTela?.podeIncluir;

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);

  const onClickNovo = () => navigate(ROUTES.BUSCA_ATIVA_REGISTRO_ACOES_NOVO);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    setSomenteConsulta(soConsulta);
  }, [permissoesTela]);

  return (
    <Col>
      <HeaderPage title="Registro de ações">
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
            </Col>
            <Col>
              <ButtonPrimary
                id={SGP_BUTTON_NOVO}
                onClick={onClickNovo}
                disabled={somenteConsulta || !podeIncluir}
              >
                Novo
              </ButtonPrimary>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardContent>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateMessages={validateMessages}
          initialValues={{
            consideraHistorico: false,
            ordemProcedimentoRealizado: OrdemProcedimentoRealizadoEnum.Nenhum,
          }}
        >
          <Row gutter={[16, 8]}>
            <Col xs={24}>
              <CheckboxExibirHistorico />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={8} md={4}>
              <SelectAnoLetivo formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={10}>
              <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} md={10}>
              <SelectUE formItemProps={{ rules: [{ required: true }] }} />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <SelectModalidade formItemProps={{ rules: [{ required: true }] }} />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <SelectSemestre />
            </Col>

            <Col xs={24} md={10}>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                {(form) => {
                  const modalidade = form.getFieldValue('modalidade');

                  return (
                    <SelectTurma
                      formItemProps={{ rules: [{ required: true }] }}
                      selectProps={{
                        disabled: !modalidade,
                      }}
                    />
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
            {() => {
              const turma = form.getFieldValue('turma');
              const disabled = !turma?.value;

              return (
                <Row gutter={[16, 8]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Nome da Criança/Estudante"
                      name="nomeEstudanteCrianca"
                      rules={[{ min: 3 }]}
                    >
                      <Input
                        type="text"
                        placeholder="Nome da Criança/Estudante"
                        id={SGP_INPUT_NOME}
                        disabled={disabled}
                        allowClear
                        prefix={<i className="fa fa-search fa-lg" />}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <DataInicio
                      formItemProps={{ label: 'Período' }}
                      datePickerProps={{ disabled }}
                      desabilitarDataFutura
                      validarInicioMaiorQueFim
                    />
                  </Col>

                  <Col xs={24} sm={12} md={6}>
                    <DataFim
                      formItemProps={{ label: ' ' }}
                      datePickerProps={{ disabled }}
                      desabilitarDataFutura
                      validarFimMenorQueInicio
                    />
                  </Col>

                  <Col xs={24} sm={16} md={12}>
                    <RadioEntrouContatoFamiliaPor radioGroupProps={{ disabled }} />
                  </Col>
                </Row>
              );
            }}
          </Form.Item>

          <Row>
            <Col xs={24}>
              <ListaPaginadaBuscaAtivaRegistroAcoes />
            </Col>
          </Row>
        </Form>
      </CardContent>
    </Col>
  );
};

export default BuscaAtivaRegistroAcoesList;