import React from 'react';
import { render } from '@testing-library/react';
import RelatorioEncaminhamentoNAAPAForm from './RelatorioEncaminhamentoNAAPAForm';

jest.mock('~/componentes-sgp/inputs', () => ({
  Dre: ({ form, onChange }) => <div data-testid="dre-input">Dre Input</div>,
  Ue: ({ form, onChange }) => <div data-testid="ue-input">Ue Input</div>,
}));

jest.mock('~/componentes-sgp/inputs/situacao-encaminhamento-naapa', () => ({
  SituacaoEncaminhamentoNAAPA: ({ form, onChange, updateData }) => (
    <div data-testid="situacao-input">Situacao Input</div>
  ),
}));

jest.mock('~/componentes-sgp/inputs/exibir-encaminhamentos-encerrados', () => ({
  ExibirEncaminhamentosEncerrados: ({ form, onChange, name, disabled }) => (
    <div data-testid="exibir-enc-input">Exibir Encerrados Input</div>
  ),
}));

jest.mock('~/componentes-sgp/inputs/porta-entrada-naapa', () => ({
  PortaEntradaNAAPA: ({ form, onChange }) => (
    <div data-testid="porta-entrada-input">Porta Entrada Input</div>
  ),
}));

jest.mock('~/componentes-sgp/inputs/fluxo-alerta-naapa', () => ({
  FluxoAlertaNAAPA: ({ form, onChange }) => (
    <div data-testid="fluxo-alerta-input">Fluxo Alerta Input</div>
  ),
}));

describe('RelatorioEncaminhamentoNAAPAForm', () => {
  const mockForm = {
    values: {
      situacaoIds: [],
    },
    setFieldValue: jest.fn(),
  };

  const defaultProps = {
    form: mockForm,
    onChangeCampos: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza todos os inputs', () => {
    const { getByTestId } = render(
      <RelatorioEncaminhamentoNAAPAForm {...defaultProps} />
    );

    expect(getByTestId('dre-input')).toBeInTheDocument();
    expect(getByTestId('ue-input')).toBeInTheDocument();
    expect(getByTestId('situacao-input')).toBeInTheDocument();
    expect(getByTestId('exibir-enc-input')).toBeInTheDocument();
    expect(getByTestId('porta-entrada-input')).toBeInTheDocument();
    expect(getByTestId('fluxo-alerta-input')).toBeInTheDocument();
  });

  test('renderiza com form vazio', () => {
    const props = { ...defaultProps, form: null };

    const { getByTestId } = render(
      <RelatorioEncaminhamentoNAAPAForm {...props} />
    );

    expect(getByTestId('dre-input')).toBeInTheDocument();
  });

  test('renderiza sem onChangeCampos', () => {
    const props = { ...defaultProps, onChangeCampos: undefined };

    const { getByTestId } = render(
      <RelatorioEncaminhamentoNAAPAForm {...props} />
    );

    expect(getByTestId('dre-input')).toBeInTheDocument();
  });
});
