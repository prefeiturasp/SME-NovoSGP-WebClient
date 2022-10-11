import React from 'react';
import { useSelector } from 'react-redux';

import { Alert } from '~/componentes';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';

const Mensagens = () => {
  const { turmaSelecionada } = useSelector(state => state.usuario);

  if (!turmaSelecionada.turma) {
    return (
      <Alert
        alerta={{
          tipo: 'warning',
          id: 'alerta-sem-turma-registro-individual',
          mensagem: 'Você precisa escolher uma turma.',
          estiloTitulo: { fontSize: '18px' },
        }}
        className="mb-2 mt-2"
      />
    );
  }

  return <AlertaPermiteSomenteTurmaInfantil />;
};

export default Mensagens;
