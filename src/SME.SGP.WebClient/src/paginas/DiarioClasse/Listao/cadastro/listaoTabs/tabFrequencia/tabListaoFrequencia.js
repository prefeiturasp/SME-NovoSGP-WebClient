import React, { useContext } from 'react';
import { Alert } from '~/componentes';
import ListaoContext from '../../../listaoContext';

const TabListaoFrequencia = () => {
  const { componenteCurricular } = useContext(ListaoContext);

  return (
    <>
      {componenteCurricular?.codigoComponenteCurricular &&
      !componenteCurricular?.registraFrequencia ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-listao-frequencia',
            mensagem: 'Componente selecionado não lança frequência',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <></>
      )}
      Listão frequência
    </>
  );
};

export default TabListaoFrequencia;
