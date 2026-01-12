import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '@testing-library/jest-dom';
import { CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao } from './cadastroEncaminhamentoNAAPAInstitucionalBotoesAcao';
import { confirmar, sucesso, erros, setBreadcrumbManual } from '~/servicos';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { ROUTES } from '@/core/enum/routes';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('~/servicos', () => ({
  confirmar: jest.fn(),
  sucesso: jest.fn(),
  erros: jest.fn(),
  setBreadcrumbManual: jest.fn(),
}));

jest.mock('~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA', () => ({
  __esModule: true,
  default: {
    excluirEncaminhamento: jest.fn(),
    removerArquivoInstitucional: jest.fn(),
  },
}));

jest.mock(
  '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes',
  () => ({
    __esModule: true,
    default: {
      limparDadosOriginaisQuestionarioDinamico: jest.fn(),
    },
  })
);

jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => ({
  __esModule: true,
  default: ({ onClick }) => (
    <button data-testid="botao-voltar" onClick={onClick}>
      Voltar
    </button>
  ),
}));

jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao', () => ({
  __esModule: true,
  default: ({ onClick, disabled }) => (
    <button data-testid="botao-excluir" onClick={onClick} disabled={disabled}>
      Excluir
    </button>
  ),
}));

jest.mock('~/componentes', () => ({
  Button: ({ onClick, disabled, label, id }) => (
    <button data-testid={id} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
  Colors: {
    Roxo: '#roxo',
    Azul: '#azul',
  },
}));

describe('CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockFormEncInstitucional = {
    validateFields: jest.fn(),
    isFieldsTouched: jest.fn(),
    resetFields: jest.fn(),
  };
  const mockSalvarEncaminhamento = jest.fn();

  const mockUsuario = {
    permissoes: {
      [ROUTES.ENCAMINHAMENTO_NAAPA]: {
        podeAlterar: true,
        podeExcluir: true,
        podeConsultar: true,
        podeIncluir: true,
      },
    },
  };

  const mockLocation = {
    pathname: '/encaminhamento-naapa/institucional/123',
    state: { someData: 'test' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useParams.mockReturnValue({ id: null });
    useLocation.mockReturnValue(mockLocation);
    useSelector.mockImplementation(selector =>
      selector({
        usuario: mockUsuario,
        questionarioDinamico: {
          questionarioDinamicoEmEdicao: false,
        },
      })
    );
    mockFormEncInstitucional.validateFields.mockResolvedValue({});
    mockFormEncInstitucional.isFieldsTouched.mockReturnValue(false);
  });

  it('deve renderizar todos os botões corretamente', () => {
    render(
      <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
        formEncInstitucional={mockFormEncInstitucional}
        salvarEncaminhamento={mockSalvarEncaminhamento}
      />
    );

    expect(screen.getByTestId('botao-voltar')).toBeInTheDocument();
    expect(screen.getByTestId('botao-excluir')).toBeInTheDocument();
    expect(screen.getByTestId('SGP_BUTTON_CANCELAR')).toBeInTheDocument();
    expect(
      screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR')
    ).toBeInTheDocument();
  });

  it('deve exibir "Cadastrar" quando não há encaminhamentoId', () => {
    render(
      <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
        formEncInstitucional={mockFormEncInstitucional}
        salvarEncaminhamento={mockSalvarEncaminhamento}
      />
    );

    expect(
      screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR')
    ).toHaveTextContent('Cadastrar');
  });

  it('deve exibir "Alterar" quando há encaminhamentoId', () => {
    useParams.mockReturnValue({ id: '123' });

    render(
      <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
        formEncInstitucional={mockFormEncInstitucional}
        salvarEncaminhamento={mockSalvarEncaminhamento}
      />
    );

    expect(
      screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR')
    ).toHaveTextContent('Alterar');
  });

  it('deve chamar setBreadcrumbManual quando há encaminhamentoId', () => {
    useParams.mockReturnValue({ id: '123' });

    render(
      <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
        formEncInstitucional={mockFormEncInstitucional}
        salvarEncaminhamento={mockSalvarEncaminhamento}
      />
    );

    expect(setBreadcrumbManual).toHaveBeenCalledWith(
      mockLocation.pathname,
      'Encaminhamento Institucional',
      ROUTES.ENCAMINHAMENTO_NAAPA
    );
  });

  describe('Botão Voltar', () => {
    it('deve navegar diretamente quando não há alterações', async () => {
      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoVoltar = screen.getByTestId('botao-voltar');
      fireEvent.click(botaoVoltar);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ENCAMINHAMENTO_NAAPA, {
          state: mockLocation.state,
        });
      });

      expect(confirmar).not.toHaveBeenCalled();
    });

    it('deve confirmar e salvar antes de voltar quando há alterações', async () => {
      mockFormEncInstitucional.isFieldsTouched.mockReturnValue(true);
      confirmar.mockResolvedValue(true);
      mockSalvarEncaminhamento.mockResolvedValue(true);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoVoltar = screen.getByTestId('botao-voltar');
      fireEvent.click(botaoVoltar);

      await waitFor(() => {
        expect(confirmar).toHaveBeenCalledWith(
          'Atenção',
          '',
          'Suas alterações não foram salvas, deseja salvar agora?'
        );
      });

      await waitFor(() => {
        expect(mockSalvarEncaminhamento).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ENCAMINHAMENTO_NAAPA, {
          state: mockLocation.state,
        });
      });
    });

    it('deve voltar sem salvar quando usuário cancela confirmação', async () => {
      mockFormEncInstitucional.isFieldsTouched.mockReturnValue(true);
      confirmar.mockResolvedValue(false);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoVoltar = screen.getByTestId('botao-voltar');
      fireEvent.click(botaoVoltar);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ENCAMINHAMENTO_NAAPA, {
          state: mockLocation.state,
        });
      });

      expect(mockSalvarEncaminhamento).not.toHaveBeenCalled();
    });

    it('deve detectar alterações no questionário dinâmico', async () => {
      useSelector.mockImplementation(selector =>
        selector({
          usuario: mockUsuario,
          questionarioDinamico: {
            questionarioDinamicoEmEdicao: true,
          },
        })
      );
      confirmar.mockResolvedValue(false);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoVoltar = screen.getByTestId('botao-voltar');
      fireEvent.click(botaoVoltar);

      await waitFor(() => {
        expect(confirmar).toHaveBeenCalled();
      });
    });
  });

  describe('Botão Excluir', () => {
    it('deve estar desabilitado quando não há encaminhamentoId', () => {
      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      expect(screen.getByTestId('botao-excluir')).toBeDisabled();
    });

    it('deve estar desabilitado quando usuário não tem permissão', () => {
      useParams.mockReturnValue({ id: '123' });
      useSelector.mockImplementation(selector =>
        selector({
          usuario: {
            permissoes: {
              [ROUTES.ENCAMINHAMENTO_NAAPA]: {
                podeExcluir: false,
              },
            },
          },
          questionarioDinamico: {
            questionarioDinamicoEmEdicao: false,
          },
        })
      );

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      expect(screen.getByTestId('botao-excluir')).toBeDisabled();
    });

    it('deve excluir encaminhamento após confirmação', async () => {
      useParams.mockReturnValue({ id: '123' });
      confirmar.mockResolvedValue(true);
      ServicoEncaminhamentoNAAPA.excluirEncaminhamento.mockResolvedValue({
        status: 200,
      });

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoExcluir = screen.getByTestId('botao-excluir');
      fireEvent.click(botaoExcluir);

      await waitFor(() => {
        expect(confirmar).toHaveBeenCalledWith(
          'Excluir',
          '',
          'Você tem certeza que deseja excluir este encaminhamento institucional?'
        );
      });

      await waitFor(() => {
        expect(
          ServicoEncaminhamentoNAAPA.excluirEncaminhamento
        ).toHaveBeenCalledWith('123');
        expect(sucesso).toHaveBeenCalledWith(
          'Encaminhamento institucional excluído com sucesso'
        );
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ENCAMINHAMENTO_NAAPA, {
          state: mockLocation.state,
        });
      });
    });

    it('não deve excluir quando usuário cancela confirmação', async () => {
      useParams.mockReturnValue({ id: '123' });
      confirmar.mockResolvedValue(false);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoExcluir = screen.getByTestId('botao-excluir');
      fireEvent.click(botaoExcluir);

      await waitFor(() => {
        expect(confirmar).toHaveBeenCalled();
      });

      expect(
        ServicoEncaminhamentoNAAPA.excluirEncaminhamento
      ).not.toHaveBeenCalled();
    });

    it('deve tratar erro ao excluir encaminhamento', async () => {
      useParams.mockReturnValue({ id: '123' });
      confirmar.mockResolvedValue(true);
      const mockError = new Error('Erro ao excluir');
      ServicoEncaminhamentoNAAPA.excluirEncaminhamento.mockRejectedValue(
        mockError
      );

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoExcluir = screen.getByTestId('botao-excluir');
      fireEvent.click(botaoExcluir);

      await waitFor(() => {
        expect(erros).toHaveBeenCalledWith(mockError);
      });
    });
  });

  describe('Botão Cancelar', () => {
    it('não deve fazer nada quando não há alterações', async () => {
      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCancelar = screen.getByTestId('SGP_BUTTON_CANCELAR');
      fireEvent.click(botaoCancelar);

      await waitFor(() => {
        expect(confirmar).not.toHaveBeenCalled();
      });
    });

    it('deve recarregar página ao cancelar com encaminhamentoId', async () => {
      useParams.mockReturnValue({ id: '123' });
      mockFormEncInstitucional.isFieldsTouched.mockReturnValue(true);
      confirmar.mockResolvedValue(true);

      // Mock window.location.reload
      delete window.location;
      window.location = { reload: jest.fn() };

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCancelar = screen.getByTestId('SGP_BUTTON_CANCELAR');
      fireEvent.click(botaoCancelar);

      await waitFor(() => {
        expect(confirmar).toHaveBeenCalledWith(
          'Atenção',
          'Você não salvou as informações preenchidas.',
          'Deseja realmente cancelar as alterações?'
        );
      });

      await waitFor(() => {
        expect(
          QuestionarioDinamicoFuncoes.limparDadosOriginaisQuestionarioDinamico
        ).toHaveBeenCalledWith(
          ServicoEncaminhamentoNAAPA.removerArquivoInstitucional
        );
        expect(window.location.reload).toHaveBeenCalled();
      });
    });

    it('deve resetar form ao cancelar sem encaminhamentoId', async () => {
      mockFormEncInstitucional.isFieldsTouched.mockReturnValue(true);
      confirmar.mockResolvedValue(true);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCancelar = screen.getByTestId('SGP_BUTTON_CANCELAR');
      fireEvent.click(botaoCancelar);

      await waitFor(() => {
        expect(mockFormEncInstitucional.resetFields).toHaveBeenCalled();
      });
    });

    it('não deve cancelar quando usuário não confirma', async () => {
      mockFormEncInstitucional.isFieldsTouched.mockReturnValue(true);
      confirmar.mockResolvedValue(false);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCancelar = screen.getByTestId('SGP_BUTTON_CANCELAR');
      fireEvent.click(botaoCancelar);

      await waitFor(() => {
        expect(confirmar).toHaveBeenCalled();
      });

      expect(mockFormEncInstitucional.resetFields).not.toHaveBeenCalled();
    });
  });

  describe('Botão Cadastrar/Alterar', () => {
    it('deve estar desabilitado quando usuário não tem permissão de alterar', () => {
      useParams.mockReturnValue({ id: '123' });
      useSelector.mockImplementation(selector =>
        selector({
          usuario: {
            permissoes: {
              [ROUTES.ENCAMINHAMENTO_NAAPA]: {
                podeAlterar: false,
              },
            },
          },
          questionarioDinamico: {
            questionarioDinamicoEmEdicao: false,
          },
        })
      );

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      expect(screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR')).toBeDisabled();
    });

    it('deve cadastrar com sucesso', async () => {
      mockSalvarEncaminhamento.mockResolvedValue(true);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCadastrar = screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR');
      fireEvent.click(botaoCadastrar);

      await waitFor(() => {
        expect(mockFormEncInstitucional.validateFields).toHaveBeenCalled();
        expect(mockSalvarEncaminhamento).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(sucesso).toHaveBeenCalledWith('Registro cadastrado com sucesso');
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ENCAMINHAMENTO_NAAPA, {
          state: mockLocation.state,
        });
      });
    });

    it('deve alterar com sucesso', async () => {
      useParams.mockReturnValue({ id: '123' });
      mockSalvarEncaminhamento.mockResolvedValue(true);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoAlterar = screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR');
      fireEvent.click(botaoAlterar);

      await waitFor(() => {
        expect(sucesso).toHaveBeenCalledWith('Registro alterado com sucesso');
      });
    });

    it('não deve navegar se salvar falhar', async () => {
      mockSalvarEncaminhamento.mockResolvedValue(false);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCadastrar = screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR');
      fireEvent.click(botaoCadastrar);

      await waitFor(() => {
        expect(mockSalvarEncaminhamento).toHaveBeenCalled();
      });

      expect(sucesso).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('deve tratar erro de validação', async () => {
      const mockError = { errorFields: [{ name: 'campo', errors: ['erro'] }] };
      mockFormEncInstitucional.validateFields.mockRejectedValue(mockError);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCadastrar = screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR');
      fireEvent.click(botaoCadastrar);

      await waitFor(() => {
        expect(mockFormEncInstitucional.validateFields).toHaveBeenCalled();
      });

      expect(erros).not.toHaveBeenCalled();
      expect(mockSalvarEncaminhamento).not.toHaveBeenCalled();
    });

    it('deve tratar erro genérico', async () => {
      const mockError = new Error('Erro ao salvar');
      mockFormEncInstitucional.validateFields.mockRejectedValue(mockError);

      render(
        <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
          formEncInstitucional={mockFormEncInstitucional}
          salvarEncaminhamento={mockSalvarEncaminhamento}
        />
      );

      const botaoCadastrar = screen.getByTestId('SGP_BUTTON_ALTERAR_CADASTRAR');
      fireEvent.click(botaoCadastrar);

      await waitFor(() => {
        expect(erros).toHaveBeenCalledWith(mockError);
      });
    });
  });

  it('não deve renderizar nada quando não há permissões', () => {
    useSelector.mockImplementation(selector =>
      selector({
        usuario: {
          permissoes: {},
        },
        questionarioDinamico: {
          questionarioDinamicoEmEdicao: false,
        },
      })
    );

    const { container } = render(
      <CadastroEncaminhamentoNAAPAInstitucionalBotoesAcao
        formEncInstitucional={mockFormEncInstitucional}
        salvarEncaminhamento={mockSalvarEncaminhamento}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
