import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { PersistGate } from 'redux-persist/integration/react';
import { obterTrackingID } from '~/servicos/variaveis';
import Routes from 'routes';
import GlobalStyle from '~/estilos/global';
import { store, persistor } from '@/core/redux';
import { Deslogar } from '~/redux/modulos/usuario/actions';
import VersaoSistema from '~/componentes-sgp/VersaoSistema';

ReactGA.initialize(obterTrackingID);

const App: React.FC = () => {
  const verificaSairResetSenha = () => {
    const persistJson = localStorage.getItem('persist:sme-sgp');
    if (persistJson) {
      const dados = JSON.parse(persistJson);
      if (dados && dados.usuario) {
        const usuario = JSON.parse(dados.usuario);
        if (usuario && usuario.logado && usuario.modificarSenha) {
          store.dispatch(Deslogar());
        }
      }
    }
  };

  window.addEventListener('beforeunload', () => {
    verificaSairResetSenha();
  });

  window.addEventListener('popstate', () => {
    if (performance.navigation.type === 1) {
      verificaSairResetSenha();
    }
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GlobalStyle />
          <VersaoSistema />
          <div className="h-100">
            <Routes />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
