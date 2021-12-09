import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import shortid from 'shortid';
import { montarContextProviders } from '~/rotas/rotaMontarContextProviders';
import rotasArray from '~/rotas/rotas';
import RotaAutenticadaEstruturada from '../rotas/rotaAutenticadaEstruturada';
import BreadcrumbSgp from './breadcrumb-sgp';
import Mensagens from './mensagens/mensagens';
import ModalConfirmacao from './modalConfirmacao';
import TempoExpiracaoSessao from './tempoExpiracaoSessao/tempoExpiracaoSessao';

const Conteudo = () => {
  const { versao } = useSelector(store => store.sistema);

  const rotasSemContextProvider = rotasArray.filter(
    r => !r?.contextProviderName
  );
  const rotasComContextProvider = rotasArray.filter(
    r => !!r?.contextProviderName
  );

  const montarRota = r => {
    return (
      <RotaAutenticadaEstruturada
        key={shortid.generate()}
        path={r.path}
        component={r.component}
        temPermissionamento={r.temPermissionamento}
        chavePermissao={r.chavePermissao}
        exact={r.exact}
      />
    );
  };

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
      <Switch>
        {rotasSemContextProvider.map(rota => montarRota(rota))}

        {rotasComContextProvider?.length ? (
          montarContextProviders(rotasComContextProvider, montarRota)
        ) : (
          <></>
        )}
      </Switch>
      <div
        className="row"
        style={{ bottom: 0, position: 'relative', padding: '1rem 1rem' }}
      >
        <div className="col-md-12">
          {!versao ? '' : <strong>{versao}&nbsp;</strong>} - Sistema homologado
          para navegadores: Google Chrome e Firefox
        </div>
      </div>
    </div>
  );
};

export default Conteudo;
