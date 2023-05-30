import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import DashboardNAAPAFiltros from './dashboardNAAPAFiltros';
import DashboardNAAPATabs from './dashboardNAAPATabs';
import NAAPAContextProvider from './naapaContextProvider';
import { Col, Row } from 'antd';

const DashboardNAAPA = () => {
  const navigate = useNavigate();

  return (
    <NAAPAContextProvider>
      <Cabecalho pagina="Dashboard NAAPA">
        <BotaoVoltarPadrao onClick={() => navigate(URL_HOME)} />
      </Cabecalho>
      <Card padding="24px 24px">
        <Col span={24}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <DashboardNAAPAFiltros />
            </Col>
            <Col span={24}>
              <DashboardNAAPATabs />
            </Col>
          </Row>
        </Col>
      </Card>
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
