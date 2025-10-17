import React from 'react';
import { render } from '@testing-library/react';
import LinhaTempo from './linhaTempo/linhaTempo';

describe('LinhaTempo', () => {
  it('renderiza sem erros', () => {
    const listaDeStatus = [{ titulo: 'Status 1' }, { titulo: 'Status 2' }];
    render(<LinhaTempo listaDeStatus={listaDeStatus} />);
  });
});
