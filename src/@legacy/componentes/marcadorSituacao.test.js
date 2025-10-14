import React from 'react';
import { render } from '@testing-library/react';
import MarcadorSituacao from './marcadorSituacao/marcadorSituacao';

describe('MarcadorSituacao', () => {
  it('renderiza sem erros', () => {
    render(
      <MarcadorSituacao corFundo="#000" corTexto="#fff">Texto</MarcadorSituacao>
    );
  });
});
