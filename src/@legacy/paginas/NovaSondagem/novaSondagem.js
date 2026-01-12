import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Provider } from 'react-redux';
import { store } from '@/core/redux';

const URL_BASE_SONDAGEM =
  process.env.REACT_APP_URL_SONDAGEM || 'http://localhost:5173';

const URL_REMOTE_ENTRY = `${URL_BASE_SONDAGEM}/assets/remoteEntry.js`;

const inicializarContainerRemoto = async container => {
  console.log('🔍 [SGP Host] Iniciando imports...');

  if (
    typeof __webpack_share_scopes__ !== 'undefined' &&
    __webpack_share_scopes__.default
  ) {
    console.log('🔍 [SGP Host] Usando __webpack_share_scopes__ do webpack');
    await __webpack_init_sharing__('default');
    await container.init(__webpack_share_scopes__.default);
    console.log(
      '🔍 [SGP Host] Container inicializado com webpack share scopes!'
    );
    return;
  }

  const ReactLib = await import('react');
  const ReactDOMLib = await import('react-dom');
  const ReactReduxLib = await import('react-redux');
  const AntdLib = await import('antd');
  console.log('🔍 [SGP Host] Imports concluídos');

  const shareScope = {
    react: {
      '^18.2.0': {
        get: async () => ReactLib,
        loaded: 1,
      },
    },
    'react-dom': {
      '^18.2.0': {
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
  };
  console.log('🔍 [SGP Host] ShareScope criado com formato alternativo');

  console.log('🔍 [SGP Host] Inicializando container...');
  await container.init(shareScope);
  console.log('🔍 [SGP Host] Container inicializado com sucesso!');
};

const carregarComponenteRemoto = async () => {
  const container = await import(/* webpackIgnore: true */ URL_REMOTE_ENTRY);

  console.log('🔍 [SGP Host] Container carregado:', container);

  if (!container?.init || !container?.get) {
    throw new Error('Container remoto inválido');
  }

  await inicializarContainerRemoto(container);

  const fabrica = await container.get('./Home');
  console.log('🔍 [SGP Host] Factory obtida:', typeof fabrica, fabrica);

  const modulo = typeof fabrica === 'function' ? fabrica() : fabrica;
  console.log('🔍 [SGP Host] Módulo obtido:', modulo);

  if (!modulo?.default) {
    throw new Error('O módulo remoto não possui exportação default');
  }

  return modulo.default;
};

const NovaSondagem = () => {
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
        <h2>Erro ao carregar o Sistema de Sondagem</h2>

        <p style={estilos.textoErro}>{erro}</p>

        <p style={estilos.dica}>
          Verifique se o projeto de Sondagem está rodando em{' '}
          <a href={URL_BASE_SONDAGEM} target="_blank" rel="noopener noreferrer">
            {URL_BASE_SONDAGEM}
          </a>
        </p>
      </div>
    );
  }

  if (carregando || !ComponenteRemoto) {
    return (
      <div style={estilos.centralizado}>
        <Spin size="large" tip="Carregando Sistema de Sondagem..." />
      </div>
    );
  }

  console.log('🔍 [SGP Host] Redux Provider está ativo');
  console.log(
    '🔍 [SGP Host] Store disponível:',
    typeof window !== 'undefined'
      ? !!window.__REDUX_DEVTOOLS_EXTENSION__
      : false
  );

  return (
    <div style={estilos.container}>
      <Provider store={store}>
        <ComponenteRemoto />
      </Provider>
    </div>
  );
};

const estilos = {
  centralizado: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  centralizadoColuna: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
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
  container: {
    margin: '-16px -32px',
    minHeight: 'calc(100vh - 70px)',
    background: '#f5f6f8',
  },
};

export default NovaSondagem;
