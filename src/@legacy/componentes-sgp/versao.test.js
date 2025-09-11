import { render, screen } from '@testing-library/react';
import Versao from './versao';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

import { useSelector } from 'react-redux';

describe('Versao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza a versão quando versao está presente', () => {
    useSelector.mockReturnValue({ versao: '1.2.3' });
    render(<Versao />);
    expect(screen.getByText('1.2.3')).toBeInTheDocument();
    expect(
      screen.getByText(/Sistema homologado para navegadores/)
    ).toBeInTheDocument();
  });

  it('não renderiza <strong> quando versao está ausente', () => {
    useSelector.mockReturnValue({ versao: '' });
    render(<Versao />);
    expect(screen.queryByText(/strong/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Sistema homologado para navegadores/)
    ).toBeInTheDocument();
  });

  it('não renderiza <strong> quando versao é undefined', () => {
    useSelector.mockReturnValue({});
    render(<Versao />);
    expect(screen.queryByText(/strong/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Sistema homologado para navegadores/)
    ).toBeInTheDocument();
  });

  it('não renderiza <strong> quando versao é null', () => {
    useSelector.mockReturnValue({ versao: null });
    render(<Versao />);
    expect(screen.queryByText(/strong/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Sistema homologado para navegadores/)
    ).toBeInTheDocument();
  });
});
