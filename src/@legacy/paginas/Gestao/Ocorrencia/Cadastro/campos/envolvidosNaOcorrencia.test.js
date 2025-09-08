// EnvolvidosNaOcorrencia.test.js

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EnvolvidosNaOcorrencia from './EnvolvidosNaOcorrencia';

// Mocks dos componentes e serviços
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Col: props => (
      <div data-testid="col" {...props}>
        {props.children}
      </div>
    ),
  };
});
jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
  SelectComponent: props => (
    <div
      data-testid={`select-component-${props.name}`}
      data-lista={JSON.stringify(props.lista)}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-placeholder={props.placeholder}
      data-label={props.label}
      data-valueoption={props.valueOption}
      data-valuetext={props.valueText}
      data-multiple={props.multiple ? 'true' : 'false'}
      onClick={props.onChange}
    />
  ),
}));
const mockBuscarCriancas = jest.fn();
const mockApiGet = jest.fn();
jest.mock('~/servicos', () => ({
  ServicoOcorrencias: {
    buscarCriancas: (...args) => mockBuscarCriancas(...args),
  },
  api: { get: (...args) => mockApiGet(...args) },
  erros: jest.fn(),
}));

describe('EnvolvidosNaOcorrencia', () => {
  const mockSetFieldValue = jest.fn();
  const mockOnChangeCampos = jest.fn();
  const getForm = (values = {}) => ({
    values,
    setFieldValue: mockSetFieldValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza dois Col, dois Loader e dois SelectComponent', () => {
    render(
      <EnvolvidosNaOcorrencia
        form={getForm({ turmaId: null })}
        ueCodigo={null}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    expect(screen.getAllByTestId('col').length).toBe(2);
    expect(screen.getAllByTestId('loader').length).toBe(2);
    expect(
      screen.getByTestId('select-component-codigosAlunos')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('select-component-codigosServidores')
    ).toBeInTheDocument();
  });

  it('busca e seta lista de alunos ao informar turmaId', async () => {
    mockBuscarCriancas.mockResolvedValue({
      data: [
        { nome: 'Aluno 1', codigoEOL: 123 },
        { nome: 'Aluno 2', codigoEOL: 456 },
      ],
    });

    render(
      <EnvolvidosNaOcorrencia
        form={getForm({ turmaId: 99 })}
        ueCodigo={null}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      const lista = JSON.parse(
        screen
          .getByTestId('select-component-codigosAlunos')
          .getAttribute('data-lista')
      );
      expect(lista[0].nomeExibicao).toBe('Aluno 1 - (123)');
      expect(lista[1].nomeExibicao).toBe('Aluno 2 - (456)');
    });
  });

  it('seta codigosAlunos se só houver um aluno', async () => {
    mockBuscarCriancas.mockResolvedValue({
      data: [{ nome: 'Aluno Único', codigoEOL: 999 }],
    });
    const form = getForm({ turmaId: 77 });
    render(
      <EnvolvidosNaOcorrencia
        form={form}
        ueCodigo={null}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('codigosAlunos', ['999']);
    });
  });

  it('busca e seta lista de servidores ao informar ueCodigo', async () => {
    mockApiGet.mockResolvedValue({
      data: [
        { nomeServidor: 'Servidor 1', codigoRf: 111 },
        { nomeServidor: 'Servidor 2', codigoRf: 222 },
      ],
    });

    render(
      <EnvolvidosNaOcorrencia
        form={getForm({ turmaId: null })}
        ueCodigo={10}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      const lista = JSON.parse(
        screen
          .getByTestId('select-component-codigosServidores')
          .getAttribute('data-lista')
      );
      expect(lista[0].nomeExibicao).toBe('Servidor 1 - (111)');
      expect(lista[1].nomeExibicao).toBe('Servidor 2 - (222)');
    });
  });

  it('seta codigosServidores se só houver um servidor', async () => {
    mockApiGet.mockResolvedValue({
      data: [{ nomeServidor: 'Servidor Único', codigoRf: 555 }],
    });
    const form = getForm({ turmaId: null });
    render(
      <EnvolvidosNaOcorrencia
        form={form}
        ueCodigo={20}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('codigosServidores', [
        '555',
      ]);
    });
  });

  it('limpa lista de alunos e servidores e campos ao remover turmaId ou ueCodigo', async () => {
    const form = getForm({ turmaId: null });
    render(
      <EnvolvidosNaOcorrencia
        form={form}
        ueCodigo={null}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('codigosAlunos', []);
      expect(form.setFieldValue).toHaveBeenCalledWith('codigosServidores', []);
    });
  });

  it('chama onChangeCampos ao trocar seleção', () => {
    render(
      <EnvolvidosNaOcorrencia
        form={getForm({ turmaId: null })}
        ueCodigo={null}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    fireEvent.click(screen.getByTestId('select-component-codigosAlunos'));
    fireEvent.click(screen.getByTestId('select-component-codigosServidores'));
    expect(mockOnChangeCampos).toHaveBeenCalledTimes(2);
  });
});
