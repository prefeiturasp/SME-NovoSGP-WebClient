import React, { useContext } from 'react';
import { Alert } from '~/componentes';
import ListaoContext from '../../../listaoContext';

const TabListaoAvaliacoes = () => {
  const { componenteCurricular } = useContext(ListaoContext);

  return (
    <>
      {componenteCurricular?.codigoComponenteCurricular &&
      !componenteCurricular?.lancaNota ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-listao-avaliacao',
            mensagem: 'Componente selecionado não lança nota',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <></>
      )}
      Listão Avaliações
    </>
  );
};

export default TabListaoAvaliacoes;
