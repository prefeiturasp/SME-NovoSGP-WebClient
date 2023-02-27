import React from 'react';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import { history } from '~/servicos';

const ListaoBotoesAcao = () => {
  const onClickVoltar = () => history.push(URL_HOME);

  return <BotaoVoltarPadrao onClick={() => onClickVoltar()} />;
};

export default ListaoBotoesAcao;
