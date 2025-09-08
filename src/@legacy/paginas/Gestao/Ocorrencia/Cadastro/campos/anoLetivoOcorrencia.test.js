// AnoLetivoOcorrencia.test.js

import { render, screen, waitFor } from '@testing-library/react';
import AnoLetivoOcorrencia from './AnoLetivoOcorrencia';

// Mocks dos helpers e componentes
jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
  SelectComponent: props => (
    <div
      data-testid="select-component"
      data-lista={JSON.stringify(props.lista)}
      data-valueoption={props.valueOption}
      data-valuetext={props.valueText}
      data-disabled={props.disabled ? 'true' : 'false'}
      {...props}
    />
  ),
}));
const mockObterAnosLetivos = jest.fn();
jest.mock('~/componentes-sgp', () => ({
  FiltroHelper: {
    obterAnosLetivos: (...args) => mockObterAnosLetivos(...args),
  },
}));
jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_ANO_LETIVO: 'select-ano-letivo',
}));
jest.mock('~/servicos', () => ({
  erros: jest.fn(),
}));
jest.mock('~/utils', () => ({
  ordenarDescPor: (arr, key) => arr.sort((a, b) => b[key] - a[key]),
}));

describe('AnoLetivoOcorrencia', () => {
  const mockSetFieldValue = jest.fn();
  const mockForm = { setFieldValue: mockSetFieldValue };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader e SelectComponent', async () => {
    mockObterAnosLetivos.mockResolvedValue([
      { valor: 2024, desc: '2024' },
      { valor: 2023, desc: '2023' },
    ]);

    render(<AnoLetivoOcorrencia form={mockForm} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('select-component')).toBeInTheDocument();

    await waitFor(() => {
      const lista = JSON.parse(
        screen.getByTestId('select-component').getAttribute('data-lista')
      );
      expect(lista).toEqual([
        { valor: 2024, desc: '2024' },
        { valor: 2023, desc: '2023' },
      ]);
      expect(mockSetFieldValue).toHaveBeenCalledWith('anoLetivo', 2024);
    });
  });

  it('SelectComponent recebe props corretas', async () => {
    mockObterAnosLetivos.mockResolvedValue([{ valor: 2022, desc: '2022' }]);
    render(<AnoLetivoOcorrencia form={mockForm} />);
    await waitFor(() => {
      const select = screen.getByTestId('select-component');
      expect(select.getAttribute('id')).toBe('select-ano-letivo');
      expect(select.getAttribute('label')).toBe('Ano Letivo');
      expect(select.getAttribute('placeholder')).toBe('Ano letivo');
      expect(select.getAttribute('data-disabled')).toBe('true');
      expect(select.getAttribute('name')).toBe('anoLetivo');
      expect(select.getAttribute('data-valueoption')).toBe('valor');
      expect(select.getAttribute('data-valuetext')).toBe('desc');
    });
  });

  it('não chama setFieldValue se lista de anos vier vazia', async () => {
    mockObterAnosLetivos.mockResolvedValue([]);
    render(<AnoLetivoOcorrencia form={mockForm} />);
    await waitFor(() => {
      expect(mockSetFieldValue).not.toHaveBeenCalled();
      const lista = JSON.parse(
        screen.getByTestId('select-component').getAttribute('data-lista')
      );
      expect(lista).toEqual([]);
    });
  });
});
