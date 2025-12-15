import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

const URL_BASE_SONDAGEM =
  process.env.REACT_APP_URL_SONDAGEM || 'http://localhost:5173';

const URL_REMOTE_ENTRY = `${URL_BASE_SONDAGEM}/assets/remoteEntry.js`;

const inicializarContainerRemoto = async (container) => {
  if (typeof __webpack_share_scopes__ !== 'undefined') {
    await __webpack_init_sharing__('default');
    await container.init(__webpack_share_scopes__.default);
    return;
  }

  const ReactLib = await import('react');
  const ReactDOMLib = await import('react-dom');

  await container.init({
    react: {
      '18.2.0': {
        get: async () => () => ReactLib,
        loaded: 1,
      },
    },
    'react-dom': {
      '18.2.0': {
        get: async () => () => ReactDOMLib,
        loaded: 1,
      },
    },
  });
};

const carregarComponenteRemoto = async () => {
  const container = await import(
    /* webpackIgnore: true */ URL_REMOTE_ENTRY
  );

  if (!container?.init || !container?.get) {
    throw new Error('Container remoto inválido');
  }

  await inicializarContainerRemoto(container);

  const fabrica = await container.get('./Home');
  const modulo = fabrica();

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
      .then((Componente) =>
        setComponenteRemoto(() => Componente)
      )
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (erro) {
    return (
      <div style={estilos.centralizadoColuna}>
        <h2>Erro ao carregar o Sistema de Sondagem</h2>

        <p style={estilos.textoErro}>{erro}</p>

        <p style={estilos.dica}>
          Verifique se o projeto de Sondagem está rodando em{' '}
          <a
            href={URL_BASE_SONDAGEM}
            target="_blank"
            rel="noopener noreferrer"
          >
            {URL_BASE_SONDAGEM}
          </a>
        </p>
      </div>
    );
  }

  if (carregando || !ComponenteRemoto) {
    return (
      <div style={estilos.centralizado}>
        <Spin
          size="large"
          tip="Carregando Sistema de Sondagem..."
        />
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <ComponenteRemoto />
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
    background: '#fff',
  },
};

export default NovaSondagem;
