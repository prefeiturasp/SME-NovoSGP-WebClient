// InformesCadastro.test.js

import { render, screen, waitFor } from '@testing-library/react';
import InformesCadastro from './InformesCadastro';

// Mocks do react-router, redux, moment, componentes e serviços
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/informes/novo' }),
  useParams: () => ({}),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => ({
    permissoes: {
      '/informes': {
        podeIncluir: true,
        podeExcluir: true,
      },
    },
  })),
}));
window.moment = () => ({
  format: () => '2025',
});

jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
  Card: props => <div data-testid="card">{props.children}</div>,
}));
jest.mock('~/componentes-sgp', () => ({
  Cabecalho: props => <div data-testid="cabecalho">{props.children}</div>,
}));
jest.mock('./informesCadastroBotoesAcoes', () => props => (
  <div data-testid="botoes-acoes" {...props} />
));
jest.mock('./informesCadastroForm', () => props => (
  <div data-testid="cadastro-form" {...props} />
));
jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  setBreadcrumbManual: jest.fn(),
  verificaSomenteConsulta: jest.fn(() => false),
}));
jest.mock('@/core/services/informes-service', () => ({
  obterInformePorId: jest.fn().mockResolvedValue({}),
}));
jest.mock('./utils', () => ({
  temPerfisValidosCadstroInformes: jest.fn(() => true),
}));
jest.mock('formik', () => {
  const actual = jest.requireActual('formik');
  return {
    ...actual,
    Formik: ({ initialValues, children }) => (
      <form data-testid="formik-form">
        {children({ values: initialValues })}
      </form>
    ),
  };
});
jest.mock('~/constantes', () => ({
  OPCAO_TODOS: 0,
}));
jest.mock('@/core/enum/routes', () => ({
  ROUTES: { INFORMES: '/informes' },
}));
jest.mock('axios', () => ({
  HttpStatusCode: { Ok: 200 },
}));

describe('InformesCadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader, Cabecalho, Card e InformesCadastroForm com initialValues padrão', async () => {
    render(<InformesCadastro />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Aguarda o Formik e componentes filhos renderizarem
    await waitFor(() => {
      expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
      expect(screen.getByTestId('botoes-acoes')).toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('cadastro-form')).toBeInTheDocument();
      expect(screen.getByTestId('formik-form')).toBeInTheDocument();
    });
  });
});
