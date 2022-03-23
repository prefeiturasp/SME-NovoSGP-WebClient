import _ from 'lodash';
import React from 'react';
import { CONTEXT_LISTAO } from '~/constantes';
import ListaoContextProvider from '~/paginas/DiarioClasse/Listao/listaoContextProvider';

const montarContextProviders = (rotasComContextProvider, montarRota) => {
  if (rotasComContextProvider?.length) {
    const contextsArupados = _.groupBy(
      rotasComContextProvider,
      'contextProviderName'
    );

    const listaContextsAgrupados = Object.values(contextsArupados);

    return listaContextsAgrupados?.length ? (
      listaContextsAgrupados?.map(contexts => {
        if (contexts?.length) {
          switch (contexts?.[0]?.contextProviderName) {
            case CONTEXT_LISTAO:
              return (
                <ListaoContextProvider>
                  {contexts?.map(c => montarRota(c))}
                </ListaoContextProvider>
              );
            default:
              return <></>;
          }
        }
        return <></>;
      })
    ) : (
      <></>
    );
  }

  return <></>;
};

export { montarContextProviders };
