import React from 'react';
import { useLocation } from 'react-router-dom';
import { RotasDto } from '~/dtos';
import ListaoOperacoes from './cadastro/listaoOperacoes';
import Listao from './lista/listao';

const ListaoConteudo = () => {
  const location = useLocation();
  const rotaAtual = location?.pathname;

  return rotaAtual === RotasDto.LISTAO_OPERACOES ? (
    <ListaoOperacoes />
  ) : (
    <Listao />
  );
};

export default ListaoConteudo;
