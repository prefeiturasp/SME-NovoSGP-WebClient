import { render, screen } from '@testing-library/react';
import { ListRegistroColetivo } from './index';
import { MemoryRouter } from 'react-router-dom';

// 🧱 Mocks obrigatórios

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => ({
    permissoes: {
      '/naapa/registro-coletivo': {
        podeIncluir: true,
        podeAlterar: true,
        podeExcluir: true,
      },
    },
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('~/servicos', () => ({
  verificaSomenteConsulta: jest.fn(() => false),
}));

// Mocks visuais básicos
jest.mock('@/components/lib/header-page', () => ({ children, title }: any) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
));
jest.mock('@/components/lib/button/primary', () => (props: any) => (
  <button {...props}>{props.children}</button>
));
jest.mock('@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props: any) => (
  <button onClick={props.onClick}>Voltar</button>
));
jest.mock('@/components/sgp/inputs/form/anoLetivo', () => () => <div>SelectAnoLetivo</div>);
jest.mock('@/components/sgp/inputs/form/dre', () => () => <div>SelectDRE</div>);
jest.mock('@/components/sgp/inputs/form/ue', () => () => <div>SelectUE</div>);
jest.mock('@/components/sgp/inputs/form/data-inicio', () => () => <div>DataInicio</div>);
jest.mock('@/components/sgp/inputs/form/data-fim', () => () => <div>DataFim</div>);
jest.mock('@/components/sgp/inputs/form/tipo-reuniao', () => ({
  SelectTipoReuniao: () => <div>TipoReuniao</div>,
  SelectTipoReuniaoFormItem: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('@/components/sgp/inputs/form/exibir-historico', () => () => (
  <div>CheckboxExibirHistorico</div>
));
jest.mock('./lista-paginada', () => ({
  ListaPaginadaRegistroColetivo: () => <div>ListaPaginada</div>,
}));

describe('ListRegistroColetivo', () => {
  it('renderiza corretamente e mostra o botão "Novo"', () => {
    render(
      <MemoryRouter>
        <ListRegistroColetivo />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Registro Coletivo' })).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByText('CheckboxExibirHistorico')).toBeInTheDocument();
    expect(screen.getByText('SelectAnoLetivo')).toBeInTheDocument();
    expect(screen.getByText('ListaPaginada')).toBeInTheDocument();
  });
});
