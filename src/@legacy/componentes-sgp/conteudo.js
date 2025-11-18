import React from 'react';
import { Outlet } from 'react-router-dom';
import BreadcrumbSgp from './breadcrumb-sgp';
import Mensagens from './mensagens/mensagens';
import ModalConfirmacao from './modalConfirmacao';
import TempoExpiracaoSessao from './tempoExpiracaoSessao/tempoExpiracaoSessao';
import Versao from './versao';

const Conteudo = () => {
  return (
    <div className="secao-conteudo">
      <TempoExpiracaoSessao />
      <BreadcrumbSgp />
      <div className="row h-100">
        <main role="main" className="col-md-12 col-lg-12 col-sm-12 col-xl-12">
          <ModalConfirmacao />
          <Mensagens />
        </main>
      </div>
      <Outlet />
      <div
        className="row"
        style={{ bottom: 0, position: 'relative', padding: '1rem 1rem' }}
      >
        <div className="col-md-12">
          <Versao />
        </div>
      </div>
    </div>
  );
};

export default Conteudo;
