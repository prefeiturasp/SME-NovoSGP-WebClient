import { render, screen } from '@testing-library/react';

jest.mock('./AcompanhamentoRegistros', () => () => (
  <div>Relatório de acompanhamento dos registros pedagógicos</div>
));

import AcompanhamentoRegistros from './AcompanhamentoRegistros';

test('renderiza componente', () => {
  render(<AcompanhamentoRegistros />);
  expect(
    screen.getByText('Relatório de acompanhamento dos registros pedagógicos')
  ).toBeInTheDocument();
});
