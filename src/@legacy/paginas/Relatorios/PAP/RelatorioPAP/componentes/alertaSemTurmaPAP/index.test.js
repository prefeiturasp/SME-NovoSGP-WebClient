import { render } from '@testing-library/react';
import AlertaSemTurmaPAP from './index';

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

describe('AlertaSemTurmaPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup({
    turmaSelecionada = { turma: 'turma 1' },
    modalidadesFiltroPrincipal = [],
    listaPeriodosPAP = [],
    turmaEhInfantil = false,
  } = {}) {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada };
      if (selectorCalls === 2) return modalidadesFiltroPrincipal;
      if (selectorCalls === 3) return listaPeriodosPAP;
      return undefined;
    });
    ehTurmaInfantil.mockReturnValue(turmaEhInfantil);
    return render(<AlertaSemTurmaPAP />);
  }

  it('renderiza o alerta quando não há periodos PAP e turma não é infantil', () => {
    const { getByTestId } = setup({
      listaPeriodosPAP: [],
      turmaEhInfantil: false,
    });
    expect(getByTestId('alert')).toHaveTextContent(
      'Somente é possivel realizar o preenchimento do PAP para turmas PAP'
    );
  });

  it('não renderiza alerta se há periodos PAP', () => {
    const { queryByTestId } = setup({ listaPeriodosPAP: [1, 2, 3] });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('não renderiza alerta se turma é infantil', () => {
    const { queryByTestId } = setup({ turmaEhInfantil: true });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('renderiza alerta se listaPeriodosPAP é undefined', () => {
    const { getByTestId } = setup({ listaPeriodosPAP: undefined });
    expect(getByTestId('alert')).toHaveTextContent(
      'Somente é possivel realizar o preenchimento do PAP para turmas PAP'
    );
  });

  it('renderiza alerta se listaPeriodosPAP é null', () => {
    const { getByTestId } = setup({ listaPeriodosPAP: null });
    expect(getByTestId('alert')).toHaveTextContent(
      'Somente é possivel realizar o preenchimento do PAP para turmas PAP'
    );
  });

  it('renderiza alerta se turmaSelecionada é undefined', () => {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada: undefined };
      if (selectorCalls === 2) return [];
      if (selectorCalls === 3) return [];
      return undefined;
    });
    ehTurmaInfantil.mockReturnValue(false);
    const { getByTestId } = render(<AlertaSemTurmaPAP />);
    expect(getByTestId('alert')).toHaveTextContent(
      'Somente é possivel realizar o preenchimento do PAP para turmas PAP'
    );
  });
});
