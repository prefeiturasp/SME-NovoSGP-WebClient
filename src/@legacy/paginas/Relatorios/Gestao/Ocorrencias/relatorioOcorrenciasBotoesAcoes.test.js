import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RelatorioOcorrenciasBotoesAcoes from './relatorioOcorrenciasBotoesAcoes';
import { BrowserRouter } from 'react-router-dom';
import ServicoRelatorioOcorrencias from '@/@legacy/servicos/Paginas/Relatorios/Gestao/Ocorrencias/ServicoRelatorioOcorrencias';
import { sucesso } from '~/servicos';

// Mock de dependências
jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  sucesso: jest.fn(),
}));

jest.mock(
  '@/@legacy/servicos/Paginas/Relatorios/Gestao/Ocorrencias/ServicoRelatorioOcorrencias',
  () => ({
    gerar: jest.fn(),
  })
);

const renderComponent = (props = {}) => {
  const defaultProps = {
    form: {
      values: {
        modoEdicao: false,
        anoLetivo: 2024,
        consideraHistorico: true,
        dreCodigo: '01',
        ueCodigo: '001',
        modalidade: '1',
        codigosTurma: ['T1'],
        imprimirDescricaoOcorrencia: true,
        semestre: '2',
        dataInicio: '2024-01-01',
        dataFim: '2024-12-31',
        ocorrenciaTipoIds: [1, 2],
      },
      errors: {},
      setFieldTouched: jest.fn(),
      setFieldValue: jest.fn(),
      validateForm: jest.fn().mockResolvedValue({}),
      isValid: true,
      resetForm: jest.fn(),
    },
    initialValues: {
      modoEdicao: false,
      anoLetivo: 2024,
    },
    desabilitarGerar: false,
    setGerandoRelatorio: jest.fn(),
    setDesabilitarGerar: jest.fn(),
    ...props,
  };

  return render(
    <BrowserRouter>
      <RelatorioOcorrenciasBotoesAcoes {...defaultProps} />
    </BrowserRouter>
  );
};

describe('RelatorioOcorrenciasBotoesAcoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar setDesabilitarGerar e resetForm ao clicar em "Cancelar"', () => {
    const resetFormMock = jest.fn();
    const setFieldValueMock = jest.fn();
    const setDesabilitarGerarMock = jest.fn();

    const form = {
      setFieldValue: setFieldValueMock,
      resetForm: resetFormMock,
      values: { modoEdicao: true },
    };

    const { getByText } = renderComponent({
      form,
      setDesabilitarGerar: setDesabilitarGerarMock,
    });

    const botaoCancelar = getByText('Cancelar');
    fireEvent.click(botaoCancelar);

    expect(setDesabilitarGerarMock).toHaveBeenCalledWith(false);
    expect(setFieldValueMock).toHaveBeenCalledWith('modoEdicao', false);
    expect(resetFormMock).toHaveBeenCalled();
  });

  it('deve chamar navegação ao clicar em "Voltar"', () => {
    const { container } = renderComponent();
    const voltarButton = container.querySelector('#SGP_BUTTON_VOLTAR');
    expect(voltarButton).toBeInTheDocument();

    fireEvent.click(voltarButton);
  });

  it('deve chamar gerar relatório com sucesso', async () => {
    ServicoRelatorioOcorrencias.gerar.mockResolvedValue({
      status: 200,
    });

    const props = {
      setGerandoRelatorio: jest.fn(),
      setDesabilitarGerar: jest.fn(),
    };

    const { getByText } = renderComponent(props);
    fireEvent.click(getByText(/gerar/i));

    await waitFor(() => {
      expect(ServicoRelatorioOcorrencias.gerar).toHaveBeenCalled();
      expect(sucesso).toHaveBeenCalled();
      expect(props.setDesabilitarGerar).toHaveBeenCalledWith(true);
      expect(props.setGerandoRelatorio).toHaveBeenCalledWith(false);
    });
  });
});
