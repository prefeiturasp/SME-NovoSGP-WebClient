import { ROUTES } from '@/core/enum/routes';
import React from 'react';
import { useLocation } from 'react-router-dom';
import Listao from './lista/listao';
import ListaoContextProvider from './listaoContextProvider';
import ListaoOperacoes from './operacoes/listaoOperacoes';

const ListaoPrincipal = () => {
  const { pathname } = useLocation();
  return (
    <ListaoContextProvider>
      {pathname === ROUTES.LISTAO && <Listao />}
      {pathname === ROUTES.LISTAO_OPERACOES && <ListaoOperacoes />}
    </ListaoContextProvider>
  );
};

export default ListaoPrincipal;
