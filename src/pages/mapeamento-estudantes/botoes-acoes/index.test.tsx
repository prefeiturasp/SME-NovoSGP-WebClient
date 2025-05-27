import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BotoesAcoesMapeamentoEstudantes } from './index';
import { useAppSelector } from '@/core/hooks/use-redux';
import { useNavigate } from 'react-router-dom';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { confirmar } from '@/@legacy/servicos';

jest.mock('@/core/hooks/use-redux');
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }));
jest.mock('@/core/services/mapeamento-estudantes-service');
jest.mock('@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes');
jest.mock('@/@legacy/servicos', () => ({ confirmar: jest.fn() }));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoCancelarPadrao', () => (props: any) => (
  <button {...props}>Cancelar</button>
));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoSalvarPadrao', () => (props: any) => (
  <button {...props}>Salvar</button>
));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props: any) => (
  <button {...props}>Voltar</button>
));
jest.mock('@ckeditor/ckeditor5-build-classic', () => ({
  __esModule: true,
  default: class {},
}));
jest.mock('@ckeditor/ckeditor5-build-classic/build/translations/pt-br', () => ({}));

jest.mock('@ckeditor/ckeditor5-react', () => ({
  __esModule: true,
  default: function MockCKEditor(props: any) {
    return <div data-testid="mock-ckeditor" />;
  },
}));

const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

const mockSalvar = mapeamentoEstudantesService.salvar as jest.Mock;
const mockLimpar =
  QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico as jest.Mock;
const mockConfirmar = confirmar as jest.Mock;

function setup({ estudantes = [{}], desabilitar = false, emEdicao = true } = {}) {
  (useAppSelector as jest.Mock).mockImplementation((fn: any) => {
    return fn({
      mapeamentoEstudantes: {
        estudantesMapeamentoEstudantes: estudantes,
        desabilitarCamposMapeamentoEstudantes: desabilitar,
      },
      questionarioDinamico: {
        questionarioDinamicoEmEdicao: emEdicao,
      },
    });
  });
  return render(<BotoesAcoesMapeamentoEstudantes />);
}

describe('BotoesAcoesMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('desabilita botões quando apropriado', () => {
    setup({ estudantes: [], desabilitar: true, emEdicao: false });
    expect(screen.getByText('Salvar')).toBeDisabled();
    expect(screen.getByText('Cancelar')).toBeDisabled();
  });

  it('aciona salvar ao clicar em Salvar', () => {
    setup();
    fireEvent.click(screen.getByText('Salvar'));
    expect(mockSalvar).toHaveBeenCalledWith(false, true);
  });

  it('aciona navegação ao clicar em Voltar sem edição', async () => {
    setup({ emEdicao: false });
    fireEvent.click(screen.getByText('Voltar'));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('aciona confirmação ao clicar em Voltar com edição', async () => {
    mockConfirmar.mockResolvedValueOnce(true);
    mockSalvar.mockResolvedValueOnce(true);
    setup({ emEdicao: true });
    fireEvent.click(screen.getByText('Voltar'));
    await waitFor(() => {
      expect(mockConfirmar).toHaveBeenCalled();
      expect(mockSalvar).toHaveBeenCalledWith(false, false, false);
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('aciona limpar dados ao cancelar com confirmação', async () => {
    mockConfirmar.mockResolvedValueOnce(true);
    setup({ desabilitar: false, emEdicao: true });
    fireEvent.click(screen.getByText('Cancelar'));
    await waitFor(() => {
      expect(mockConfirmar).toHaveBeenCalled();
      expect(mockLimpar).toHaveBeenCalled();
    });
  });

  it('não chama limpar dados se cancelar sem confirmação', async () => {
    mockConfirmar.mockResolvedValueOnce(false);
    setup({ desabilitar: false, emEdicao: true });
    fireEvent.click(screen.getByText('Cancelar'));
    await waitFor(() => {
      expect(mockConfirmar).toHaveBeenCalled();
      expect(mockLimpar).not.toHaveBeenCalled();
    });
  });
});
