import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '~/componentes';

const ListaoAlertaTurma = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  return !turma ? (
    <Alert
      alerta={{
        tipo: 'warning',
        id: 'alertas-listao',
        mensagem: 'Você precisa escolher uma turma',
        estiloTitulo: { fontSize: '18px' },
      }}
      className="mb-2"
    />
  ) : (
    <></>
  );
};

export default ListaoAlertaTurma;
