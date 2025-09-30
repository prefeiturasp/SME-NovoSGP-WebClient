import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const mockInputCodigoProps = {};
const mockInputNomeProps = {};

jest.mock('./componentes/InputCodigo', () => props => {
  Object.assign(mockInputCodigoProps, props);
  return (
    <input
      data-testid="input-codigo"
      value={props.pessoaSelecionada?.alunoCodigo || ''}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.desabilitado}
    />
  );
});

jest.mock('./componentes/InputNome', () => props => {
  Object.assign(mockInputNomeProps, props);
  return (
    <input
      data-testid="input-nome"
      value={props.pessoaSelecionada?.alunoNome || ''}
      onChange={e => props.onChange(e.target.value)}
      disabled={props.desabilitado}
    />
  );
});

jest.mock('~/componentes/Label', () => ({ text }) => <span>{text}</span>);

jest.mock('./services/LocalizadorEstudanteService', () => ({
  buscarPorNome: jest.fn(),
  buscarPorCodigo: jest.fn(),
}));
jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
  erro: jest.fn(),
}));
jest.mock('~/utils/funcoes/gerais', () => ({
  removerNumeros: jest.fn(val => String(val).replace(/\d/g, '')),
}));

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));
jest.mock('~/redux/modulos/localizadorEstudante/actions', () => ({
  setAlunosCodigo: jest.fn(payload => ({ type: 'SET_ALUNOS_CODIGO', payload })),
}));

import LocalizadorEstudante from './index';
import service from './services/LocalizadorEstudanteService';
import { store } from '@/core/redux';
import { setAlunosCodigo } from '~/redux/modulos/localizadorEstudante/actions';

const mockAlunoUnico = {
  data: {
    items: [{ codigo: '123', nome: 'JOAO DA SILVA', codigoTurma: 'T1' }],
  },
};

describe('Componente: LocalizadorEstudante', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key in mockInputCodigoProps) delete mockInputCodigoProps[key];
    for (const key in mockInputNomeProps) delete mockInputNomeProps[key];
    service.buscarPorNome.mockResolvedValue({ data: { items: [] } });
    service.buscarPorCodigo.mockResolvedValue({ data: { items: [] } });
  });

  describe('Renderização e Efeitos Iniciais', () => {
    it('deve renderizar a estrutura antiga por padrão', () => {
      render(<LocalizadorEstudante />);
      expect(screen.getByTestId('input-nome')).toBeInTheDocument();
      expect(screen.getByTestId('input-codigo')).toBeInTheDocument();
    });

    it('deve renderizar a nova estrutura quando novaEstrutura for true', () => {
      render(<LocalizadorEstudante novaEstrutura showLabel />);
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Código EOL')).toBeInTheDocument();
    });

    it('não deve renderizar o campo de código se exibirCodigoEOL for false', () => {
      render(<LocalizadorEstudante exibirCodigoEOL={false} />);
      expect(screen.queryByTestId('input-codigo')).not.toBeInTheDocument();
    });

    it('deve buscar aluno inicial se valorInicialAlunoCodigo for fornecido', async () => {
      service.buscarPorCodigo.mockResolvedValue(mockAlunoUnico);
      render(
        <LocalizadorEstudante
          ueId="1"
          anoLetivo="2025"
          valorInicialAlunoCodigo="123"
        />
      );
      await act(async () => {
        jest.runAllTimers();
      });
      expect(service.buscarPorCodigo).toHaveBeenCalledWith({
        codigo: '123',
        codigoUe: '1',
        anoLetivo: '2025',
      });
    });

    it('deve resetar o estado ao mudar ueId', () => {
      const { rerender } = render(<LocalizadorEstudante ueId="1" />);
      act(() => {
        mockInputNomeProps.onSelect({ key: '123', props: { value: 'NOME' } });
      });

      rerender(<LocalizadorEstudante ueId="2" />);

      expect(mockInputNomeProps.pessoaSelecionada.alunoCodigo).toBe('');
    });
  });

  describe('Busca por Nome', () => {
    it('não deve buscar se o nome tiver menos de 3 caracteres', () => {
      render(<LocalizadorEstudante ueId="1" />);
      userEvent.type(screen.getByTestId('input-nome'), 'Jo');
      act(() => {
        jest.runAllTimers();
      });
      expect(service.buscarPorNome).not.toHaveBeenCalled();
    });
  });

  describe('Busca por Código', () => {
    it('deve buscar e selecionar aluno ao submeter um código', async () => {
      const onChangeMock = jest.fn();
      service.buscarPorCodigo.mockResolvedValue(mockAlunoUnico);
      render(
        <LocalizadorEstudante
          ueId="1"
          anoLetivo="2025"
          onChange={onChangeMock}
        />
      );

      act(() => {
        mockInputCodigoProps.onSelect({ codigo: '123' });
      });
      await act(async () => {
        jest.runAllTimers();
      });

      expect(service.buscarPorCodigo).toHaveBeenCalledWith({
        codigo: '123',
        codigoUe: '1',
        anoLetivo: '2025',
      });
      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith(
          expect.objectContaining({ alunoCodigo: 123 })
        );
      });
    });

    it('deve limpar dados se o input de código for limpo', () => {
      const onChangeMock = jest.fn();
      render(<LocalizadorEstudante ueId="1" onChange={onChangeMock} />);

      act(() => {
        mockInputCodigoProps.onChange('');
      });

      expect(onChangeMock).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('Interação e Redux', () => {
    it('deve disparar ação para o Redux ao selecionar uma pessoa', () => {
      render(<LocalizadorEstudante />);
      store.dispatch.mockClear();
      const mockPessoa = {
        key: '123',
        props: { value: 'ALUNO NOVO', codigoTurma: 'T1' },
      };

      act(() => {
        mockInputNomeProps.onSelect(mockPessoa);
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(setAlunosCodigo([123]));
    });

    it('deve disparar ação para o Redux com array vazio ao limpar a seleção', async () => {
      render(<LocalizadorEstudante ueId="1" />);
      const mockPessoa = {
        key: '123',
        props: { value: 'ALUNO SELECIONADO', codigoTurma: 'T1' },
      };

      act(() => {
        mockInputNomeProps.onSelect(mockPessoa);
      });

      store.dispatch.mockClear();

      const inputNome = screen.getByTestId('input-nome');
      await userEvent.clear(inputNome);

      await act(async () => {
        jest.runAllTimers();
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(setAlunosCodigo([]));
    });
  });
});
