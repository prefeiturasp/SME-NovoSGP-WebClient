import CardCollapse from '~/componentes/cardCollapse';
import ServicoNotas from '~/servicos/InformacoesEducacionais/ServicoNotas';
import { useState, useEffect } from 'react';
import { Table, Select, Row, Col } from 'antd';
import { Base } from '~/componentes';
import './tabelaNotasUE.css';

function TabelaNotasUe({ dreCodigo, ueCodigo, anoLetivo }) {
  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  return (
    <>
      <CardCollapse
        titulo="Notas"
        configCabecalho={configCabecalho}
      ></CardCollapse>
    </>
  );
}

export default TabelaNotasUe;
