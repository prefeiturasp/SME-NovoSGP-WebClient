import { render } from '@testing-library/react';
import AlertaSemTurmaSelecionada from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('~/componentes', () => ({
  Alert: ({ alerta }) => <div data-testid="alert">{alerta.mensagem}</div>,
}));
jest.mock('@/@legacy/servicos', () => ({
  ehTurmaInfantil: jest.fn(),
}));

import { useSelector } from 'react-redux';
import { ehTurmaInfantil } from '@/@legacy/servicos';

describe('AlertaSemTurmaSelecionada', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup({
    turmaSelecionada = {},
    modalidadesFiltroPrincipal = [],
    turmaEhInfantil = false,
  } = {}) {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada };
      if (selectorCalls === 2) return modalidadesFiltroPrincipal;
      return undefined;
    });
    ehTurmaInfantil.mockReturnValue(turmaEhInfantil);
    return render(<AlertaSemTurmaSelecionada />);
  }

  it('renderiza o alerta quando não há turma selecionada e não é infantil', () => {
    const { getByTestId } = setup({
      turmaSelecionada: {},
      turmaEhInfantil: false,
    });
    expect(getByTestId('alert')).toHaveTextContent(
      'Você precisa escolher uma turma.'
    );
  });

  it('não renderiza alerta se turmaSelecionada.turma existe', () => {
    const { queryByTestId } = setup({ turmaSelecionada: { turma: 'turma 1' } });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('não renderiza alerta se turma é infantil', () => {
    const { queryByTestId } = setup({ turmaEhInfantil: true });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('renderiza alerta se turmaSelecionada é undefined e não é infantil', () => {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada: undefined };
      if (selectorCalls === 2) return [];
      return undefined;
    });
    ehTurmaInfantil.mockReturnValue(false);
    const { getByTestId } = render(<AlertaSemTurmaSelecionada />);
    expect(getByTestId('alert')).toHaveTextContent(
      'Você precisa escolher uma turma.'
    );
  });
});
