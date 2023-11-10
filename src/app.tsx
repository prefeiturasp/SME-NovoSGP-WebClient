import { SGPTheme } from '@/core/config/theme';
import { persistor, store } from '@/core/redux';
import { ConfigProvider } from 'antd';
import React from 'react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from 'styled-components';

import GlobalStyle from '~/estilos/global';
import { Deslogar } from '~/redux/modulos/usuario/actions';
import { obterTrackingID } from '~/servicos/variaveis';
import Routes from './routes';

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
    <ConfigProvider theme={SGPTheme}>
      <ThemeProvider theme={SGPTheme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <GlobalStyle />
              <Routes />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
