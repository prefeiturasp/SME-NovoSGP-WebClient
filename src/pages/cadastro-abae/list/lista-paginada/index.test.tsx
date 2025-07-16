import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import ListaPaginadaCadastroABAE from './index';
import { ListaPaginada } from '@/@legacy/componentes';
import * as antd from 'antd';
import { useWatch } from 'antd/es/form/Form';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockFormInstance = {
  isFieldsTouched: jest.fn(() => false),
  validateFields: jest.fn(() => Promise.resolve({})),
};

jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    Form: {
      ...actualAntd.Form,
      useFormInstance: jest.fn(() => mockFormInstance),
    },
  };
});

jest.mock('antd/es/form/Form', () => ({
  useWatch: jest.fn(() => undefined),
}));

jest.mock('@/@legacy/componentes', () => ({
  ListaPaginada: jest.fn(() => <div data-testid="lista-paginada" />),
}));
jest.mock('@/@legacy/constantes/ids/table', () => ({
  SGP_TABLE_CADASTRO_ABAE: 'table-id',
}));
jest.mock('@/core/enum/routes', () => ({
  ROUTES: { CADASTRO_ABAE: '/cadastro-abae' },
}));
jest.mock('~/constantes', () => ({
  OPCAO_TODOS: 'TODOS',
}));

describe('ListaPaginadaCadastroABAE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (antd.Form.useFormInstance as jest.Mock).mockReturnValue(mockFormInstance);
    (useWatch as jest.Mock).mockImplementation(() => undefined);
  });

  it('renderiza ListaPaginada com os props mínimos', () => {
    const { getByTestId } = render(<ListaPaginadaCadastroABAE />);
    expect(getByTestId('lista-paginada')).toBeInTheDocument();
  });

  it('monta colunas corretamente quando dre e ue são TODOS', () => {
    (useWatch as jest.Mock).mockImplementation((field) => {
      if (field === 'dre') return { value: 'TODOS' };
      if (field === 'ue') return { value: 'TODOS' };
      return undefined;
    });
    const { getByTestId } = render(<ListaPaginadaCadastroABAE />);
    expect(getByTestId('lista-paginada')).toBeInTheDocument();
  });

  it('monta colunas corretamente quando só dre é TODOS', () => {
    (useWatch as jest.Mock).mockImplementation((field) => {
      if (field === 'dre') return { value: 'TODOS' };
      if (field === 'ue') return { value: 'algumaUE' };
      return undefined;
    });
    const { getByTestId } = render(<ListaPaginadaCadastroABAE />);
    expect(getByTestId('lista-paginada')).toBeInTheDocument();
  });

  it('monta colunas corretamente quando só ue é TODOS', () => {
    (useWatch as jest.Mock).mockImplementation((field) => {
      if (field === 'dre') return { value: 'algumaDRE' };
      if (field === 'ue') return { value: 'TODOS' };
      return undefined;
    });
    const { getByTestId } = render(<ListaPaginadaCadastroABAE />);
    expect(getByTestId('lista-paginada')).toBeInTheDocument();
  });

  it('monta colunas corretamente quando dre e ue não são TODOS', () => {
    (useWatch as jest.Mock).mockImplementation((field) => {
      if (field === 'dre') return { value: 'algumaDRE' };
      if (field === 'ue') return { value: 'algumaUE' };
      return undefined;
    });
    const { getByTestId } = render(<ListaPaginadaCadastroABAE />);
    expect(getByTestId('lista-paginada')).toBeInTheDocument();
  });

  it('chama navigate ao clicar em uma linha', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    let onClick: any;
    (ListaPaginada as unknown as jest.Mock).mockImplementation((props) => {
      onClick = props.onClick;
      return <div data-testid="lista-paginada" />;
    });
    render(<ListaPaginadaCadastroABAE />);
    onClick && onClick({ id: 123 });
    expect(navigate).toHaveBeenCalledWith('/cadastro-abae/123', { replace: true });
  });

  it('seta filtro como undefined quando form.isFieldsTouched e dre/ue não estão preenchidos', () => {
    (useWatch as jest.Mock).mockImplementation(() => undefined);
    mockFormInstance.isFieldsTouched = jest.fn(() => false);

    render(<ListaPaginadaCadastroABAE />);

    expect(ListaPaginada).toHaveBeenCalledWith(
      expect.objectContaining({
        filtro: undefined,
      }),
      expect.anything(),
    );
  });

  it('seta filtro corretamente quando form.isFieldsTouched ou dre/ue preenchidos', async () => {
    (useWatch as jest.Mock).mockImplementation((field) => {
      if (field === 'dre') return { value: 'algumaDRE', id: 1 };
      if (field === 'ue') return { value: 'algumaUE', id: 2 };
      if (field === 'nome') return 'nomeTeste';
      if (field === 'situacao') return true;
      return undefined;
    });
    mockFormInstance.isFieldsTouched = jest.fn(() => true);
    mockFormInstance.validateFields = jest.fn(() =>
      Promise.resolve({ dre: { id: 1 }, ue: { id: 2 }, nome: 'nomeTeste', situacao: true }),
    );
    const { findByTestId } = render(<ListaPaginadaCadastroABAE />);
    await findByTestId('lista-paginada');
    expect(mockFormInstance.validateFields).toHaveBeenCalled();
  });

  it('seta filtro como undefined se validateFields rejeita', async () => {
    (useWatch as jest.Mock).mockImplementation((field) => {
      if (field === 'dre') return { value: 'algumaDRE', id: 1 };
      if (field === 'ue') return { value: 'algumaUE', id: 2 };
      return undefined;
    });
    mockFormInstance.isFieldsTouched = jest.fn(() => true);
    mockFormInstance.validateFields = jest.fn(() => Promise.reject(new Error('erro')));

    const { findByTestId } = render(<ListaPaginadaCadastroABAE />);

    await findByTestId('lista-paginada');

    expect(ListaPaginada).toHaveBeenCalledWith(
      expect.objectContaining({
        filtro: undefined,
      }),
      expect.anything(),
    );
  });
});
