import { render, screen } from '@testing-library/react';
import Erro from './erro';

describe('Erro', () => {
  it('exibe a mensagem recebida', () => {
    render(<Erro mensagem="Usuário não encontrado" />);
    expect(screen.getByText('Usuário não encontrado')).toBeInTheDocument();
  });
});
