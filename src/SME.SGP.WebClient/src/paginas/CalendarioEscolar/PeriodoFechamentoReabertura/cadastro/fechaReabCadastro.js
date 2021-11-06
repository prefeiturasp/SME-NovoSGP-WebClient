import React from 'react';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import FechaReabCadastroBotoesAcao from './fechaReabCadastroBotoesAcao';
import FechaReabCadastroContextProvider from './fechaReabCadastroContextProvider';
import FechaReabCadastroForm from './fechaReabCadastroForm';
import FechaReabCadastroLoader from './fechaReabCadastroLoader';

const FechaReabCadastro = () => {
  return (
    <FechaReabCadastroContextProvider>
      <Cabecalho pagina="Período de Fechamento (Reabertura)" />
      <FechaReabCadastroLoader>
        <Card>
          <FechaReabCadastroBotoesAcao />
          <FechaReabCadastroForm />
        </Card>
      </FechaReabCadastroLoader>
    </FechaReabCadastroContextProvider>
  );
};

export default FechaReabCadastro;
