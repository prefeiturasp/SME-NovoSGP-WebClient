import React, { useContext } from 'react';
import { Alert } from '~/componentes';
import ListaoContext from '../../../listaoContext';

const TabListaoFechamento = () => {
  const { componenteCurricular } = useContext(ListaoContext);

  return (
    <>
      {!componenteCurricular?.lancaNota ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alertas-listao',
            mensagem: 'Componente selecionado não lança nota',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <></>
      )}
      Listão Fechamento
    </>
  );
};

export default TabListaoFechamento;
