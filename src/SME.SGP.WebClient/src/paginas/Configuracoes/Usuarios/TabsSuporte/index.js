import React, { useEffect } from 'react';
import { Tabs, Row } from 'antd';
import { useSelector } from 'react-redux';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import Alert from '~/componentes/alert';
import Grid from '~/componentes/grid';

import { Colors } from '~/componentes/colors';
import history from '~/servicos/history';
import { URL_HOME } from '~/constantes/url';
import Card from '../../../../componentes/card';

import Suporte from '../suporte';

export default function TabsSuporte() {
  const perfilSelecionado = useSelector(
    store => store.perfil.perfilSelecionado.nomePerfil
  );
  const onClickVoltar = () => history.push(URL_HOME);

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
                'Você não possui permissão para acessar o suporte do usuários do SGP.',
              estiloTitulo: { fontSize: '18px' },
            }}
          />
        </Grid>
      </Row>
      <Cabecalho pagina="Suporte" />
      <Card>
        <div className="col-md-12 d-flex justify-content-end pb-4">
          <Button
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickVoltar}
          />
        </div>

        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <Suporte perfilSelecionado={verificaPerfil(perfilSelecionado)} />
        </div>
      </Card>
    </>
  );
}
