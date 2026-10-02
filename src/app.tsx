import { SGPTheme } from '@/core/config/theme';
import { AntdAppProvider } from '@/core/config/antd-app-provider';
import { persistor, store } from '@/core/redux';
import { ConfigProvider } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from 'styled-components';

import GlobalStyle from '~/estilos/global';
import { Deslogar } from '~/redux/modulos/usuario/actions';
import Routes from './routes';

const AppRoot: React.FC = () => {
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
  // @ts-ignore
  return (
    <ConfigProvider theme={SGPTheme}>
      <AntdAppProvider>
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
      </AntdAppProvider>
    </ConfigProvider>
  );
};

export default AppRoot;
