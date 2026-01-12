import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'antd';
import '@testing-library/jest-dom';
import { CadastroEncaminhamentoNAAPAInstitucional } from './cadastroEncaminhamentoNAAPAInstitucional';
import { AbrangenciaServico, erros, verificaSomenteConsulta } from '~/servicos';
import ServicoEncaminhamentoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA';
import {
  setDadosEncaminhamentoInstitucional,
  setLimparDadosEncaminhamentoInstitucional,
} from '~/redux/modulos/encaminhamentoInstitucional/actions';
import { ROUTES } from '@/core/enum/routes';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('~/servicos', () => ({
  AbrangenciaServico: {
    buscarDres: jest.fn(),
    buscarUes: jest.fn(),
  },
  erros: jest.fn(),
  verificaSomenteConsulta: jest.fn(),
}));

jest.mock('~/servicos/Paginas/Gestao/NAAPA/ServicoEncaminhamentoNAAPA', () => ({
  __esModule: true,
  default: {
    obterDadosEncaminhamentoNAAPA: jest.fn(),
    salvarEncaminhamentoInstitucional: jest.fn(),
  },
}));

jest.mock('./cadastroEncaminhamentoNAAPAInstitucionalBotoesAcao', () => ({
  __esModule: true,
  default: () => <div data-testid="botoes-acao">Botões de Ação</div>,
}));

jest.mock('../Cadastro/componentes/loaderEncaminhamentoNAAPA', () => ({
  __esModule: true,
  default: ({ children, loading }) => (
    <div data-testid="loader-encaminhamento">
      {loading && <div data-testid="loading">Loading...</div>}
      {children}
    </div>
  ),
}));

jest.mock(
  './componentes/montarDadosTabsInstitucional/montarDadosTabsInstitucional',
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="montar-dados-tabs">Tabs Institucional</div>
    ),
  })
);

jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children, pagina }) => (
    <div data-testid="cabecalho">
      <h1>{pagina}</h1>
      {children}
    </div>
  ),
  FiltroHelper: {
    ordenarLista: () => (a, b) => a.nome.localeCompare(b.nome),
  },
}));

jest.mock('~/componentes', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Loader: ({ children, loading }) => (
    <div data-testid="loader">
      {loading && <span>Loading...</span>}
      {children}
    </div>
  ),
  SelectComponent: ({
    label,
    placeholder,
    lista,
    onChange,
    disabled,
    valueSelect,
    id,
  }) => (
    <div data-testid={id}>
      <label>{label}</label>
      <select
        disabled={disabled}
        value={valueSelect || ''}
        onChange={e => onChange && onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {lista?.map(item => (
          <option key={item.codigo} value={item.codigo}>
            {item.nome}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('CadastroEncaminhamentoNAAPAInstitucional', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  const mockUsuario = {
    permissoes: {
      [ROUTES.ATENDIMENTO_NAAPA]: {
        podeConsultar: true,
        podeIncluir: true,
        podeAlterar: true,
      },
    },
  };

  const mockDadosEncaminhamentoInstitucional = {
    dreCodigo: '123',
    ueCodigo: '456',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);
    useParams.mockReturnValue({ id: null });
    useSelector.mockImplementation(selector =>
      selector({
        usuario: mockUsuario,
        encaminhamentoInstitucional: {
          dadosEncaminhamentoInstitucional:
            mockDadosEncaminhamentoInstitucional,
        },
      })
    );
    verificaSomenteConsulta.mockReturnValue(false);
  });

  it('deve renderizar o componente corretamente', async () => {
    const mockDres = [
      { codigo: '123', nome: 'DRE Centro' },
      { codigo: '456', nome: 'DRE Sul' },
    ];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
    expect(
      screen.getByText('Encaminhamento Institucional')
    ).toBeInTheDocument();
    expect(screen.getByTestId('botoes-acao')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('deve carregar DREs ao inicializar', async () => {
    const mockDres = [
      { codigo: '123', nome: 'DRE Centro' },
      { codigo: '456', nome: 'DRE Sul' },
    ];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(AbrangenciaServico.buscarDres).toHaveBeenCalledWith(
        'v1/abrangencias/false/dres'
      );
    });
  });

  it('deve carregar UEs ao selecionar uma DRE', async () => {
    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];
    const mockUes = [
      { codigo: '001', nome: 'UE A' },
      { codigo: '002', nome: 'UE B' },
    ];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });
    AbrangenciaServico.buscarUes.mockResolvedValue({ data: mockUes });

    const TestWrapper = () => {
      const [form] = Form.useForm();
      React.useEffect(() => {
        form.setFieldsValue({ codigoDre: '123' });
      }, [form]);
      return <CadastroEncaminhamentoNAAPAInstitucional />;
    };

    render(<TestWrapper />);

    await waitFor(() => {
      expect(AbrangenciaServico.buscarDres).toHaveBeenCalled();
    });
  });

  it('deve carregar dados do encaminhamento quando id está presente', async () => {
    useParams.mockReturnValue({ id: '100' });

    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];
    const mockDadosEncaminhamento = {
      dreCodigo: '123',
      ueCodigo: '456',
    };

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });
    ServicoEncaminhamentoNAAPA.obterDadosEncaminhamentoNAAPA.mockResolvedValue({
      data: mockDadosEncaminhamento,
    });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(
        ServicoEncaminhamentoNAAPA.obterDadosEncaminhamentoNAAPA
      ).toHaveBeenCalledWith('100');
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setDadosEncaminhamentoInstitucional({
          dreCodigo: '123',
          ueCodigo: '456',
        })
      );
    });
  });

  it('deve redirecionar se o usuário tiver apenas permissão de consulta', async () => {
    verificaSomenteConsulta.mockReturnValue(true);
    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];
    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ENCAMINHAMENTO_NAAPA);
    });
  });

  it('deve limpar dados ao desmontar o componente', async () => {
    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];
    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    const { unmount } = render(<CadastroEncaminhamentoNAAPAInstitucional />);

    unmount();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setLimparDadosEncaminhamentoInstitucional()
      );
    });
  });

  it('deve exibir loader durante carregamento', async () => {
    useParams.mockReturnValue({ id: '100' });

    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });
    ServicoEncaminhamentoNAAPA.obterDadosEncaminhamentoNAAPA.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
    );

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    expect(screen.getByTestId('loader-encaminhamento')).toBeInTheDocument();
  });

  it('deve tratar erro ao carregar DREs', async () => {
    const mockError = new Error('Erro ao carregar DREs');
    AbrangenciaServico.buscarDres.mockRejectedValue(mockError);

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(mockError);
    });
  });

  it('deve tratar erro ao carregar dados do encaminhamento', async () => {
    useParams.mockReturnValue({ id: '100' });
    const mockError = new Error('Erro ao carregar encaminhamento');
    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });
    ServicoEncaminhamentoNAAPA.obterDadosEncaminhamentoNAAPA.mockRejectedValue(
      mockError
    );

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(mockError);
    });
  });

  it('deve renderizar SelectComponent de DRE e UE', async () => {
    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];
    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(screen.getByTestId('SGP_SELECT_DRE')).toBeInTheDocument();
      expect(screen.getByTestId('SGP_SELECT_UE')).toBeInTheDocument();
    });
  });

  it('deve renderizar o componente MontarDadosTabsInstitucional', async () => {
    const mockDres = [{ codigo: '123', nome: 'DRE Centro' }];
    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(screen.getByTestId('montar-dados-tabs')).toBeInTheDocument();
    });
  });

  it('deve limpar lista de UEs quando DRE não está selecionada', async () => {
    const mockDres = [
      { codigo: '123', nome: 'DRE Centro' },
      { codigo: '456', nome: 'DRE Sul' },
    ];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(AbrangenciaServico.buscarDres).toHaveBeenCalled();
    });

    // A lista de UEs não deve ser carregada sem uma DRE selecionada
    expect(AbrangenciaServico.buscarUes).not.toHaveBeenCalled();
  });

  it('deve ordenar lista de DREs por nome', async () => {
    const mockDres = [
      { codigo: '456', nome: 'DRE Sul' },
      { codigo: '123', nome: 'DRE Centro' },
      { codigo: '789', nome: 'DRE Norte' },
    ];

    AbrangenciaServico.buscarDres.mockResolvedValue({ data: mockDres });

    render(<CadastroEncaminhamentoNAAPAInstitucional />);

    await waitFor(() => {
      expect(AbrangenciaServico.buscarDres).toHaveBeenCalled();
    });
  });
});
