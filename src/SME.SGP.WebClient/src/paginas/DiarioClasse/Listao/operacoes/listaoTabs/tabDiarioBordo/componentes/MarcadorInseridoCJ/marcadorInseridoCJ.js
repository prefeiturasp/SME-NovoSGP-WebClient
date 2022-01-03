import React from 'react';

import { MarcadorSituacao } from '~/componentes';

import { Container } from './marcadorInseridoCJ.css';

const MarcadorInseridoCJ = () => {
  return (
    <Container>
      <MarcadorSituacao>Registro inserido pelo CJ</MarcadorSituacao>
    </Container>
  );
};

export default MarcadorInseridoCJ;
