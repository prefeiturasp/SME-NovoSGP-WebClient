import React from 'react';
import { Tabs, Row } from 'antd';
import { useSelector } from 'react-redux';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Grid from '~/componentes/grid';
import { URL_HOME } from '~/constantes/url';
import Card from '../../../../componentes/card';
import ReiniciarSenha from '../reiniciarSenha';
import ReiniciarSenhaEA from '../ReiniciarSenhaEA';

import { ContainerTabs } from './style';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

export default function TabsReiniciarSenha() {
  const navigate = useNavigate();

  const perfilSelecionado = useSelector(
    store => store.perfil.perfilSelecionado.nomePerfil
  );
  const onClickVoltar = () => navigate(URL_HOME);

  const verificaPerfil = perfil => {
    return perfil === 'CP' || perfil === 'AD' || perfil === 'Secretário';
  };

  return (
    <>
      <Row hidden={!verificaPerfil(perfilSelecionado)}>
        <Grid cols={12}>
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'AlertaPrincipal',
              mensagem:
                'Você não possui permissão para reiniciar a senha de usuários do SGP.',
              estiloTitulo: { fontSize: '18px' },
            }}
          />
        </Grid>
      </Row>
      <Cabecalho pagina="Reiniciar senha">
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Cabecalho>
      <Card>
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <ContainerTabs type="card" defaultActiveKey="1">
            <TabPane tab="SGP" key="1">
              <ReiniciarSenha
                perfilSelecionado={verificaPerfil(perfilSelecionado)}
              />
            </TabPane>
            <TabPane tab="Escola Aqui" key="2">
              <ReiniciarSenhaEA />
            </TabPane>
          </ContainerTabs>
        </div>
      </Card>
    </>
  );
}
