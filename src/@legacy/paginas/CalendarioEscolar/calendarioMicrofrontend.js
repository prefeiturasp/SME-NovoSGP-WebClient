import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Provider } from 'react-redux';
import { store } from '@/core/redux';

const URL_BASE_CALENDARIO =
  process.env.REACT_APP_URL_CALENDARIO || 'http://localhost:5175';

const URL_REMOTE_ENTRY = `${URL_BASE_CALENDARIO}/assets/remoteEntry.js?v=${Date.now()}`;

let componenteEmCache = null;
let carregamentoEmAndamento = null;

const inicializarContainerRemoto = async container => {
  if (
    typeof __webpack_share_scopes__ !== 'undefined' &&
    __webpack_share_scopes__.default
  ) {
    await __webpack_init_sharing__('default');
    await container.init(__webpack_share_scopes__.default);
    return;
  }

  const ReactLib = await import('react');
  const ReactDOMLib = await import('react-dom');
  const ReactReduxLib = await import('react-redux');
  const AntdLib = await import('antd');
  const ReactRouterLib = await import('react-router-dom');

  const shareScope = {
    react: {
      '^19.2.8': {
        get: async () => ReactLib,
        loaded: 1,
      },
    },
    'react-dom': {
      '^19.2.8': {
        get: async () => ReactDOMLib,
        loaded: 1,
      },
    },
    'react-redux': {
      '^8.1.3': {
        get: async () => ReactReduxLib,
        loaded: 1,
      },
    },
    antd: {
      '^5.4.0': {
        get: async () => AntdLib,
        loaded: 1,
      },
    },
    'react-router-dom': {
      '^6.10.0': {
        get: async () => ReactRouterLib,
        loaded: 1,
      },
    },
  };

  await container.init(shareScope);
};

const carregarComponenteRemoto = async () => {
  if (componenteEmCache) return componenteEmCache;
  if (!carregamentoEmAndamento) {
    carregamentoEmAndamento = (async () => {
      const container = await import(
        /* webpackIgnore: true */ URL_REMOTE_ENTRY
      );

      if (!container?.init || !container?.get) {
        throw new Error('Container remoto inválido');
      }

      await inicializarContainerRemoto(container);

      const fabrica = await container.get('./Calendario');
      const modulo = typeof fabrica === 'function' ? fabrica() : fabrica;
      const Componente = modulo?.default || modulo;

      if (!Componente) {
        throw new Error('O módulo remoto não possui exportação válida');
      }

      componenteEmCache = Componente;
      return Componente;
    })().catch(erro => {
      carregamentoEmAndamento = null;
      throw erro;
    });
  }

  return carregamentoEmAndamento;
};

const CalendarioMicrofrontend = () => {
  const [ComponenteRemoto, setComponenteRemoto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarComponenteRemoto()
      .then(Componente => setComponenteRemoto(() => Componente))
      .catch(err => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (erro) {
    return (
      <div style={estilos.centralizadoColuna}>
        <h2>Erro ao carregar o Calendário Escolar</h2>

        <p style={estilos.textoErro}>{erro}</p>

        <p style={estilos.dica}>
          Verifique se o projeto de Calendário está rodando em{' '}
          <a
            href={URL_BASE_CALENDARIO}
            target="_blank"
            rel="noopener noreferrer"
          >
            {URL_BASE_CALENDARIO}
          </a>
        </p>
      </div>
    );
  }

  if (carregando || !ComponenteRemoto) {
    return (
      <div style={estilos.centralizado}>
        <Spin size="large" tip="Carregando Calendário Escolar..." />
      </div>
    );
  }

  return (
    <Provider store={store}>
      <ComponenteRemoto apiUrl={process.env.REACT_APP_URL_API} />
    </Provider>
  );
};

const estilos = {
  centralizado: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 240,
  },
  centralizadoColuna: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 240,
    gap: 20,
    padding: 20,
  },
  textoErro: {
    textAlign: 'center',
    maxWidth: 600,
  },
  dica: {
    fontSize: 14,
    color: '#666',
  },
};

export default CalendarioMicrofrontend;
