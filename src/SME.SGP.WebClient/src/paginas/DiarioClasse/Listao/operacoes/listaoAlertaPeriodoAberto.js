import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import Alert from '~/componentes/alert';
import ListaoContext from '../listaoContext';

const ListaoAlertaPeriodoAberto = () => {
  const { periodoAbertoListao, bimestreOperacoes } = useContext(ListaoContext);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  return (
    <div className="col-md-12">
      {turma && bimestreOperacoes && !periodoAbertoListao ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-perido-listao',
            mensagem:
              'Apenas é possível consultar este registro pois o período não está em aberto.',
            estiloTitulo: { fontSize: '18px' },
          }}
          className="mb-2"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ListaoAlertaPeriodoAberto;
