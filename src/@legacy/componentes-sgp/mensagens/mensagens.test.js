import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Mensagens from './mensagens';

// Mock do Redux e componente Alert
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('~/componentes/alert', () => ({
  __esModule: true,
  default: ({ alerta }) => <div data-testid="alerta">{alerta.mensagem}</div>,
}));

describe('Componente Mensagens', () => {
  const mockState = {
    navegacao: { somenteConsulta: false },
    alertas: { alertas: [] },
  };

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(mockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar nada quando não houver alertas e não for somente consulta', () => {
    const { container } = render(<Mensagens />);
    expect(container).toBeEmptyDOMElement();
  });

  it('deve exibir alertas quando existirem no estado', () => {
    mockState.alertas.alertas = [
      { id: 1, tipo: 'success', mensagem: 'Alerta teste 1' },
      { id: 2, tipo: 'error', mensagem: 'Alerta teste 2' },
    ];

    const { getAllByTestId } = render(<Mensagens />);
    expect(getAllByTestId('alerta')).toHaveLength(2);
  });

  it('deve exibir alerta de consulta quando a tela for somente leitura', () => {
    mockState.navegacao.somenteConsulta = true;

    const { getByText } = render(<Mensagens />);
    expect(getByText(/permissão de consulta/i)).toBeInTheDocument();
  });

  it('deve exibir ambos os alertas quando houver mensagens e for somente consulta', () => {
    mockState.alertas.alertas = [
      { id: 3, tipo: 'info', mensagem: 'Alerta combinado' },
    ];
    mockState.navegacao.somenteConsulta = true;

    const { getAllByTestId } = render(<Mensagens />);
    expect(getAllByTestId('alerta')).toHaveLength(2);
  });
});
