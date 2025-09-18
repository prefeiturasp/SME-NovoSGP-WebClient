import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import { BotoesAcoesRelatorio } from '@/components/sgp/botoes-acoes/relatorio';
import SelectAnoLetivo from '@/components/sgp/inputs/form/anoLetivo';
import {
  SelectMotivoAusenciaBuscaAtiva,
  SelectMotivoAusenciaBuscaAtivaFormItem,
} from '@/components/sgp/inputs/form/busca-ativa/motivo-ausencia';
import DataFim from '@/components/sgp/inputs/form/data-fim';
import DataInicio from '@/components/sgp/inputs/form/data-inicio';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import CheckboxExibirHistorico from '@/components/sgp/inputs/form/exibir-historico';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import { SelectABAE, SelectABAEFormItem } from '@/components/sgp/inputs/form/select-abae';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import LocalizadorEstudante from '@/components/sgp/localizador-estudante';
import { ANO_INICIO_BUSCA_ATIVA } from '@/core/constants/contants';
import { validateMessages } from '@/core/constants/validate-messages';
import { dayjs } from '@/core/date/dayjs';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { FiltroRelatorioBuscasAtivasDto } from '@/core/dto/FiltroRelatorioBuscasAtivasDto';
import relatoriosService from '@/core/services/relatorios-service';
import { desabilitarAnosPassadosFuturos } from '@/core/utils/functions';
import { Col, Form, Row } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, OPCAO_TODOS } from '~/constantes';
import { sucesso } from '~/servicos';

export const RelatorioNAAPABuscaAtiva: React.FC = () => {
  const [form] = useForm();

  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState<boolean>(false);

  const anoLetivo = useWatch('anoLetivo', form);

  const onClickGerar = async (formValues: any) => {
    let turmasCodigo = [];
    if (formValues?.turmas?.length) {
      const todosSelecionado = formValues.turmas[0]?.value === OPCAO_TODOS;

      if (!todosSelecionado) {
        turmasCodigo = formValues.turmas.map((turma: AbrangenciaTurmaRetornoDto) => turma.value);
      }
    }

    const params: FiltroRelatorioBuscasAtivasDto = {
      anoLetivo: formValues?.anoLetivo,
      dreCodigo: formValues?.dre?.codigo,
      ueCodigo: formValues?.ue?.codigo,
      modalidade: formValues?.modalidade?.value,
      semestre: formValues?.semestre?.value,
      turmasCodigo,
      alunoCodigo: formValues?.localizadorEstudante?.codigo,
      cpfABAE: formValues?.cpfABAE,
      opcoesRespostaIdMotivoAusencia: [],
    };

    if (formValues?.opcoesRespostaIdMotivoAusencia?.length) {
      params.opcoesRespostaIdMotivoAusencia = formValues?.opcoesRespostaIdMotivoAusencia;
    }

    if (formValues?.dataInicio) {
      params.dataInicioRegistroAcao = dayjs(formValues.dataInicio).format('YYYY-MM-DD');
    }

    if (formValues?.dataFim) {
      params.dataFimRegistroAcao = dayjs(formValues.dataFim).format('YYYY-MM-DD');
    }

    setExibirLoader(true);
    const resposta = await relatoriosService.buscaAtiva(params);

    if (resposta.sucesso) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
    }

    setExibirLoader(false);
    setDesabilitarGerar(true);
  };

  useEffect(() => {
    form.setFieldValue('dataInicio', undefined);
    form.setFieldValue('dataFim', undefined);
  }, [form, anoLetivo]);

  return (
    <Loader loading={exibirLoader}>
      <Col>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onClickGerar}
          validateMessages={validateMessages}
          initialValues={{
            consideraHistorico: false,
          }}
          onChange={() => {
            setDesabilitarGerar(false);
          }}
          onSelect={() => {
            setDesabilitarGerar(false);
          }}
        >
          <HeaderPage title="Busca Ativa">
            <BotoesAcoesRelatorio desabilitarGerar={desabilitarGerar} />
          </HeaderPage>

          <CardContent>
            <Row gutter={[16, 8]}>
              <Col xs={24}>
                <CheckboxExibirHistorico />
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8} md={4}>
                <SelectAnoLetivo
                  formItemProps={{ rules: [{ required: true }] }}
                  anoMinimo={ANO_INICIO_BUSCA_ATIVA}
                />
              </Col>

              <Col xs={24} md={10}>
                <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={10}>
                <SelectUE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col xs={24} md={12} lg={8}>
                <SelectModalidade formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <SelectSemestre />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {(form) => {
                    const modalidade = form.getFieldValue('modalidade');

                    return (
                      <SelectTurma
                        mostrarOpcaoTodas
                        formItemProps={{ name: 'turmas', rules: [{ required: true }] }}
                        selectProps={{
                          disabled: !modalidade?.value,
                          mode: 'multiple',
                        }}
                      />
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>

            <LocalizadorEstudante />

            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12}>
                <SelectABAEFormItem>
                  <SelectABAE />
                </SelectABAEFormItem>
              </Col>

              <Col xs={24} sm={12}>
                <SelectMotivoAusenciaBuscaAtivaFormItem name="opcoesRespostaIdMotivoAusencia">
                  <SelectMotivoAusenciaBuscaAtiva mode="multiple" />
                </SelectMotivoAusenciaBuscaAtivaFormItem>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <DataInicio
                  validarInicioMaiorQueFim
                  desabilitarData={(dataComparacao) =>
                    desabilitarAnosPassadosFuturos(dataComparacao, anoLetivo)
                  }
                  formItemProps={{ label: 'Data do registro de ação' }}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <DataFim
                  validarFimMenorQueInicio
                  formItemProps={{ label: ' ' }}
                  desabilitarData={(dataComparacao) =>
                    desabilitarAnosPassadosFuturos(dataComparacao, anoLetivo)
                  }
                />
              </Col>
            </Row>
          </CardContent>
        </Form>
      </Col>
    </Loader>
  );
};
