import { render, screen } from '@testing-library/react';
import DataInicioFim from './DataInicioFim';

jest.mock('@/core/date/adapter', () => ({
  dateAdapter: {
    format: (valor, formato) => {
      if (formato === 'YYYY-MM-DD') return String(valor).slice(0, 10);
      if (valor === '2024-01-01') return '01/01/2024';
      if (valor === '2024-01-10') return '10/01/2024';
      return String(valor);
    },
  },
}));

describe('DataInicioFim', () => {
  it('não renderiza quando as datas são iguais', () => {
    const { container } = render(
      <DataInicioFim
        dadosAula={{ dataInicio: '2024-01-01', dataFim: '2024-01-01' }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('não renderiza quando falta data', () => {
    const { container } = render(
      <DataInicioFim dadosAula={{ dataInicio: '2024-01-01' }} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('exibe início e fim quando as datas diferem', () => {
    render(
      <DataInicioFim
        dadosAula={{ dataInicio: '2024-01-01', dataFim: '2024-01-10' }}
      />
    );
    expect(screen.getByText(/Data Início/)).toBeInTheDocument();
    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('10/01/2024')).toBeInTheDocument();
  });
});
