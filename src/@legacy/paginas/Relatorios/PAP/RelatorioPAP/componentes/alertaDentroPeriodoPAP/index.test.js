import { render } from '@testing-library/react';
import AlertaDentroPeriodoPAP from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('~/componentes/alert', () => ({
  __esModule: true,
  default: ({ alerta }) => <div data-testid="alert">{alerta.mensagem}</div>,
}));
jest.mock('~/servicos/Validacoes/validacoesInfatil', () => ({
  ehTurmaInfantil: jest.fn(),
}));

import { useSelector } from 'react-redux';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';

describe('AlertaDentroPeriodoPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup({
    periodoSelecionadoPAP = { periodoAberto: false },
    turmaSelecionada = { turma: 'turma 1' },
    modalidadesFiltroPrincipal = [],
    turmaEhInfantil = false,
  } = {}) {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return periodoSelecionadoPAP;
      if (selectorCalls === 2) return { turmaSelecionada };
      if (selectorCalls === 3) return modalidadesFiltroPrincipal;
      return undefined;
    });
    ehTurmaInfantil.mockReturnValue(turmaEhInfantil);
    return render(<AlertaDentroPeriodoPAP />);
  }

  it('renderiza o alerta quando periodo está fechado, turma selecionada existe e não é infantil', () => {
    const { getByTestId } = setup();
    expect(getByTestId('alert')).toHaveTextContent(
      'Não é possível preencher o relatório fora do período estipulado pela SME'
    );
  });

  it('não renderiza alerta se periodo está aberto', () => {
    const { queryByTestId } = setup({
      periodoSelecionadoPAP: { periodoAberto: true },
    });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('não renderiza alerta se não há turma selecionada', () => {
    const { queryByTestId } = setup({ turmaSelecionada: {} });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('não renderiza alerta se turma é infantil', () => {
    const { queryByTestId } = setup({ turmaEhInfantil: true });
    expect(queryByTestId('alert')).toBeNull();
  });

  it('não renderiza alerta se periodoSelecionadoPAP é undefined', () => {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return undefined;
      if (selectorCalls === 2) return { turmaSelecionada: undefined };
      if (selectorCalls === 3) return [];
      return undefined;
    });
    ehTurmaInfantil.mockReturnValue(false);
    const { queryByTestId } = render(<AlertaDentroPeriodoPAP />);
    expect(queryByTestId('alert')).toBeNull();
  });
});
