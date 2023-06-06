import { Col, Row, Tabs } from 'antd';
import React, { useContext, useState } from 'react';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { ModalidadeDTO } from '~/dtos';
import GraficosEvasaoEscolar from './GraficosEvasaoEscolar/graficosEvasaoEscolar';
import NAAPAContext from './naapaContext';
import GraficosEncaminhamento from './GraficosEncaminhamento/graficosEncaminhamento';

const DashboardNAAPATabs = () => {
  const { anoLetivo, dre, ue, modalidade, semestre } = useContext(NAAPAContext);

  const [tabSelecionada, setTabSelecionada] = useState(0);

  const TAB_RISCO_ABANDONO = '1';
  const TAB_ENCAMINHAMENTO = '2';

  const ehModalidadeEJA = Number(modalidade) === ModalidadeDTO.EJA;
  const exibirAbas = anoLetivo && dre?.codigo && ue?.codigo;

  const exibirDadosRiscoAbandono =
    exibirAbas && modalidade && (ehModalidadeEJA ? !!semestre : true);

  const montarDadosRiscoAbandono = () => {
    if (exibirDadosRiscoAbandono) return <GraficosEvasaoEscolar />;

    return (
      <div className="text-center">
        Para visualizar esta seção é necessário selecionar a modalidade e
        semestre no caso de EJA
      </div>
    );
  };

  const montarDados = () => {
    return (
      <>
        <div className="col-md-12 p-0">
          {tabSelecionada === TAB_RISCO_ABANDONO ? (
            montarDadosRiscoAbandono()
          ) : (
            <></>
          )}

          {tabSelecionada === TAB_ENCAMINHAMENTO ? (
            <GraficosEncaminhamento />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  };

  const onChangeTab = tabAtiva => {
    setTabSelecionada(tabAtiva);
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          {exibirAbas && (
            <>
              <ContainerTabsCard
                width="auto"
                type="card"
                onChange={onChangeTab}
                activeKey={tabSelecionada}
              >
                <Tabs.TabPane tab="Risco de abandono" key={TAB_RISCO_ABANDONO}>
                  {montarDados()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Encaminhamento" key={TAB_ENCAMINHAMENTO}>
                  {montarDados()}
                </Tabs.TabPane>
              </ContainerTabsCard>
              {!tabSelecionada ? (
                <Row justify="center">Selecione uma aba</Row>
              ) : (
                <></>
              )}
            </>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export default DashboardNAAPATabs;
