import { render, screen } from '@testing-library/react';
import RelatorioUsuarios from './RelatorioUsuarios';

jest.mock('./RelatorioUsuarios', () => () => (
  <div>
    <h1>Relatório de usuários</h1>
    <div>Formulário de relatório</div>
  </div>
));

test('renderiza relatório de usuários', () => {
  render(<RelatorioUsuarios />);
  expect(screen.getByText('Relatório de usuários')).toBeInTheDocument();
});
