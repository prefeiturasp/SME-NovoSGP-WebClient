import _ from 'lodash';
import React from 'react';
import { CONTEXT_LISTAO } from '~/constantes';
import ListaoContextProvider from '~/paginas/DiarioClasse/Listao/listaoContextProvider';

const montarContextProviders = (rotasComContextProvider, montarRota) => {
  if (!rotasComContextProvider || rotasComContextProvider?.length === 0)
    return <></>;

  const contextosArupados = _.groupBy(
    rotasComContextProvider,
    'contextProviderName'
  );

  const contextos = Object.keys(contextosArupados);
  const contextProviderMap = {
    [CONTEXT_LISTAO]: ListaoContextProvider,
  };

  return contextos
    .filter(contexto => !!contextProviderMap[contexto])
    .map(contexto => {
      const ContextProvider = contextProviderMap[contexto];

      return (
        <ContextProvider key={contexto}>
          {contextosArupados[contexto].map(rota => montarRota(rota))}
        </ContextProvider>
      );
    });
};

export { montarContextProviders };
