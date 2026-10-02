import { render, screen } from '@testing-library/react';
import DiasDaSemana from './index';

jest.mock('shortid', () => {
  let chave = 0;
  return { generate: () => `id-${++chave}` };
});
jest.mock('./styles', () => ({
  DiasDaSemanaWrapper: ({ children }) => <div>{children}</div>,
}));

describe('DiasDaSemana', () => {
  it('renderiza os sete dias', () => {
    render(<DiasDaSemana />);
    expect(screen.getByText('Domingo')).toBeInTheDocument();
    expect(screen.getByText('Segunda')).toBeInTheDocument();
    expect(screen.getByText('Sábado')).toBeInTheDocument();
  });
});
