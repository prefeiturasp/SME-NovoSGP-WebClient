import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';

const ListaoBotoesAcao = () => {
  const navigate = useNavigate();
  const onClickVoltar = () => navigate(URL_HOME);

  return <BotaoVoltarPadrao onClick={() => onClickVoltar()} />;
};

export default ListaoBotoesAcao;
