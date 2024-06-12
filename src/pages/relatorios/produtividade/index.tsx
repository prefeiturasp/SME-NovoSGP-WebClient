import CardContent from '@/components/lib/card-content';
import HeaderPage from '@/components/lib/header-page';
import { BotoesAcoesRelatorio } from '@/components/sgp/botoes-acoes/relatorio';
import SelectAnoLetivo from '@/components/sgp/inputs/form/anoLetivo';
import SelectDRE from '@/components/sgp/inputs/form/dre';
import CheckboxExibirHistorico from '@/components/sgp/inputs/form/exibir-historico';
import SelectUE from '@/components/sgp/inputs/form/ue';
import { ANO_INICIO_PRODUTIVIDADE } from '@/core/constants/contants';
import { validateMessages } from '@/core/constants/validate-messages';
import { FiltroRelatorioProdutividadeFrequenciaDto } from '@/core/dto/FiltroRelatorioProdutividadeFrequenciaDto';
import relatoriosService from '@/core/services/relatorios-service';
import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { Loader } from '~/componentes';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO, OPCAO_TODOS } from '~/constantes';
import { sucesso } from '~/servicos';
import { SelectBimestresFrequenciaProdutividade } from './components/bimestres';
import { LocalizadorProfessorRelProdutividade } from './components/professores';
import { SelectTipoRelatorioFrequenciaProdutividade } from './components/tipo-produtividade';

export const RelatorioProdutividade: React.FC = () => {
  const [form] = useForm();

  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState<boolean>(false);

  const onClickGerar = async (formValues: any) => {
    const codigoDre = formValues?.dre?.value === OPCAO_TODOS ? null : formValues?.dre?.value;
    const codigoUe = formValues?.ue?.value === OPCAO_TODOS ? null : formValues?.ue?.value;
    const bimestre = formValues?.bimestre === OPCAO_TODOS ? null : formValues?.bimestre;

    const params: FiltroRelatorioProdutividadeFrequenciaDto = {
      anoLetivo: formValues?.anoLetivo,
      codigoDre,
      codigoUe,
      bimestre,
      tipoRelatorioProdutividade: formValues?.tipoRelatorioProdutividade,
      rfProfessor: formValues?.localizadorProfessor?.codigoRF,
    };

    setExibirLoader(true);
    const resposta = await relatoriosService.produtividadeFrequencia(params);

    if (resposta.sucesso) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
      setDesabilitarGerar(true);
    }

    setExibirLoader(false);
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
          <HeaderPage title="Produtividade">
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
                  anoMinimo={ANO_INICIO_PRODUTIVIDADE}
                />
              </Col>

              <Col xs={24} md={10}>
                <SelectDRE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
              </Col>

              <Col xs={24} md={10}>
                <SelectUE formItemProps={{ rules: [{ required: true }] }} mostrarOpcaoTodas />
              </Col>
            </Row>

            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <SelectBimestresFrequenciaProdutividade />
              </Col>

              <Col xs={24} md={12}>
                <SelectTipoRelatorioFrequenciaProdutividade />
              </Col>

              <Col xs={24}>
                <LocalizadorProfessorRelProdutividade />
              </Col>
            </Row>
          </CardContent>
        </Form>
      </Col>
    </Loader>
  );
};
