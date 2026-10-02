import { render, screen } from '@testing-library/react';
import MarcadorMigrado from './MarcadorMigrado';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('~/componentes-sgp', () => ({
  RegistroMigrado: ({ children }) => (
    <span data-testid="registro-migrado">{children}</span>
  ),
}));

const { useSelector } = require('react-redux');

describe('MarcadorMigrado', () => {
  it('renderiza "Registro Migrado" quando ehRegistroMigrado é true', () => {
    useSelector.mockImplementation(cb =>
      cb({ planoAnual: { ehRegistroMigrado: true } })
    );
    render(<MarcadorMigrado />);
    expect(screen.getByTestId('registro-migrado')).toBeInTheDocument();
    expect(screen.getByText('Registro Migrado')).toBeInTheDocument();
  });

  it('não renderiza marcador quando ehRegistroMigrado é false', () => {
    useSelector.mockImplementation(cb =>
      cb({ planoAnual: { ehRegistroMigrado: false } })
    );
    render(<MarcadorMigrado />);
    expect(screen.queryByTestId('registro-migrado')).not.toBeInTheDocument();
  });
});
