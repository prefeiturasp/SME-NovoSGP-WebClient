import { ROUTES } from '@/core/enum/routes';
import BuscaAtivaRegistroAcoesForm from '@/pages/busca-ativa/registro-acoes/form';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BuscaAtivaHistoricoRegistroAcoesForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onClickVoltar = () => {
    navigate(ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES, { state: location.state });
  };

  return <BuscaAtivaRegistroAcoesForm onClickVoltar={onClickVoltar} />;
};

export default BuscaAtivaHistoricoRegistroAcoesForm;
