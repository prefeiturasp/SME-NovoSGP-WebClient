import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import SelectAnoLetivo from '@/components/sgp/inputs/form/anoLetivo';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import CheckboxExibirHistorico from '@/components/sgp/inputs/form/exibir-historico';
import SelectModalidade from '@/components/sgp/inputs/form/modalidade';
import {
  SelectParecerConclusivoAnoLetivoModalidade,
  SelectParecerConclusivoAnoLetivoModalidadeItem,
} from '@/components/sgp/inputs/form/parecer-conclusivo';
import SelectSemestre from '@/components/sgp/inputs/form/semestre';
import SelectTurma from '@/components/sgp/inputs/form/turma';
import SelectUE from '@/components/sgp/inputs/form/ue';
import LocalizadorEstudante from '@/components/sgp/localizador-estudante';
import { ANO_INICIO_MAPEAMENTO_ESTUDANTES } from '@/core/constants/contants';
import { validateMessages } from '@/core/constants/validate-messages';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { FiltroRelatorioMapeamentoEstudantesDto } from '@/core/dto/FiltroRelatorioMapeamentoEstudantesDto';
import relatoriosService from '@/core/services/relatorios-service';
import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { Loader } from '~/componentes';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import { sucesso } from '~/servicos';
import { RelMapeamentoEstudantesBotoesAcoes } from './botoes-acoes';
import { RelMapeamentoEstudantesCamposFormDinamico } from './campos-form-dinamico';

export const RelatorioMapeamentoEstudantes: React.FC = () => {
  const [form] = useForm();

  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState<boolean>(false);

  const onClickGerar = async (values: FiltroRelatorioMapeamentoEstudantesDto) => {
    const formValues: any = values;

    let turmasCodigo = [];
    if (formValues?.turmas?.length) {
      turmasCodigo = formValues.turmas.map((turma: AbrangenciaTurmaRetornoDto) => turma.value);
    }

    const params: FiltroRelatorioMapeamentoEstudantesDto = {
      anoLetivo: formValues?.anoLetivo,
      dreCodigo: formValues?.dre?.codigo,
      ueCodigo: formValues?.ue?.codigo,
      modalidade: formValues?.modalidade?.value,
      semestre: formValues?.semestre?.value,
      turmasCodigo,
      alunoCodigo: formValues?.localizadorEstudante?.codigo,
      pareceresConclusivosIdAnoAnterior: formValues?.pareceresConclusivosIdAnoAnterior,
      opcaoRespostaIdDistorcaoIdadeAnoSerie: formValues?.opcaoRespostaIdDistorcaoIdadeAnoSerie,
      opcaoRespostaIdPossuiPlanoAEE: formValues?.opcaoRespostaIdPossuiPlanoAEE,
      opcaoRespostaIdAcompanhadoNAAPA: formValues?.opcaoRespostaIdAcompanhadoNAAPA,
      participaPAP: formValues?.participaPAP,
      opcaoRespostaIdProgramaSPIntegral: formValues?.opcaoRespostaIdProgramaSPIntegral,
      opcaoRespostaHipoteseEscrita: formValues?.opcaoRespostaHipoteseEscrita,
      opcaoRespostaAvaliacaoExternaProvaSP: formValues?.opcaoRespostaAvaliacaoExternaProvaSP,
      opcaoRespostaIdFrequencia: formValues?.opcaoRespostaIdFrequencia,
    };

    setExibirLoader(true);
    const resposta = await relatoriosService.mapeamentoEstudante(params);

    if (resposta.sucesso) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
    }

    setExibirLoader(false);
    setDesabilitarGerar(true);
  };

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
          <HeaderPage title="Mapeamento de estudantes">
            <RelMapeamentoEstudantesBotoesAcoes desabilitarGerar={desabilitarGerar} />
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
                  anoMinimo={ANO_INICIO_MAPEAMENTO_ESTUDANTES}
                />
              </Col>

              <Col xs={24} md={10}>
                <SelectDRE formItemProps={{ rules: [{ required: true }] }} />
              </Col>

              <Col xs={24} md={10}>
                <SelectUE formItemProps={{ rules: [{ required: true }] }} />
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

            <Row gutter={[16, 8]}>
              <Col xs={24}>
                <LocalizadorEstudante />
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                  {(form) => {
                    const anoLetivo = form.getFieldValue('anoLetivo');
                    const modalidade = form.getFieldValue('modalidade');

                    const disabled = !anoLetivo || !modalidade?.value;

                    if (disabled) {
                      const pareceresConclusivosIdAnoAnterior = form.getFieldValue(
                        'pareceresConclusivosIdAnoAnterior',
                      );

                      if (pareceresConclusivosIdAnoAnterior) {
                        form.setFieldValue('pareceresConclusivosIdAnoAnterior', undefined);
                      }
                    }

                    return (
                      <SelectParecerConclusivoAnoLetivoModalidadeItem
                        name="pareceresConclusivosIdAnoAnterior"
                        label="Parecer conclusivo do ano anterior"
                      >
                        <SelectParecerConclusivoAnoLetivoModalidade
                          mode="multiple"
                          disabled={disabled}
                          anoLetivo={anoLetivo}
                          modalidade={modalidade?.value}
                          placeholder="Parecer conclusivo do ano anterio"
                        />
                      </SelectParecerConclusivoAnoLetivoModalidadeItem>
                    );
                  }}
                </Form.Item>
              </Col>

              <RelMapeamentoEstudantesCamposFormDinamico />
            </Row>
          </CardContent>
        </Form>
      </Col>
    </Loader>
  );
};
