import { render, fireEvent, waitFor } from '@testing-library/react';
import SelectPeridosPAP from './index';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('~/servicos', () => ({ erros: jest.fn() }));
jest.mock(
  '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP',
  () => ({
    __esModule: true,
    default: {
      obterPeriodos: jest.fn(() =>
        Promise.resolve({
          data: [{ periodoRelatorioPAP: 1, descricaoPeriodo: '1º Semestre' }],
        })
      ),
    },
  })
);
jest.mock('@/@legacy/componentes', () => ({
  SelectComponent: ({
    id,
    lista,
    valueOption,
    valueText,
    valueSelect,
    onChange,
    placeholder,
    disabled,
    allowClear,
  }) => (
    <select
      data-testid="select-component"
      id={id}
      disabled={disabled}
      value={valueSelect || ''}
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {lista &&
        lista.map(item => (
          <option key={item[valueOption]} value={item[valueOption]}>
            {item[valueText]}
          </option>
        ))}
    </select>
  ),
}));
jest.mock('antd', () => ({
  Col: ({ children }) => <div data-testid="col">{children}</div>,
}));
jest.mock('@/@legacy/constantes/ids/select', () => ({
  SGP_SELECT_PERIODO_PAP: 'select-pap',
}));
jest.mock('@/@legacy/redux/modulos/relatorioPAP/actions', () => ({
  limparDadosRelatorioPAP: jest.fn(() => ({ type: 'LIMPAR' })),
  setEstudantesRelatorioPAP: jest.fn(() => ({ type: 'SET_ESTUDANTES' })),
  setExibirLoaderRelatorioPAP: jest.fn(() => ({ type: 'SET_LOADER' })),
  setListaPeriodosPAP: jest.fn(() => ({ type: 'SET_LISTA_PERIODOS' })),
  setPeriodoSelecionadoPAP: jest.fn(() => ({ type: 'SET_PERIODO' })),
}));
jest.mock('@/@legacy/redux/modulos/questionarioDinamico/actions', () => ({
  setLimparDadosQuestionarioDinamico: jest.fn(() => ({ type: 'LIMPAR_QD' })),
  setListaSecoesEmEdicao: jest.fn(() => ({ type: 'LIMPAR_SECOES' })),
}));

import { useDispatch, useSelector } from 'react-redux';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { setPeriodoSelecionadoPAP } from '@/@legacy/redux/modulos/relatorioPAP/actions';

describe('SelectPeridosPAP', () => {
  let dispatch;
  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
  });

  function setup({
    listaPeriodosPAP = [
      { periodoRelatorioPAP: 1, descricaoPeriodo: '1º Semestre' },
    ],
    turmaSelecionada = { turma: 'T1' },
    periodoSelecionadoPAP = { periodoRelatorioPAP: 1 },
  } = {}) {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return listaPeriodosPAP;
      if (selectorCalls === 2) return turmaSelecionada;
      if (selectorCalls === 3) return periodoSelecionadoPAP;
      return undefined;
    });
    return render(<SelectPeridosPAP />);
  }

  it('renderiza SelectComponent com os períodos e valor selecionado', () => {
    const { getByTestId } = setup();
    const select = getByTestId('select-component');
    expect(select).toBeInTheDocument();
    expect(select.value).toBe('1');
    expect(select).not.toBeDisabled();
  });

  it('desabilita SelectComponent se listaPeriodosPAP estiver vazia', () => {
    const { getByTestId } = setup({ listaPeriodosPAP: [] });
    const select = getByTestId('select-component');
    expect(select).toBeDisabled();
  });

  it('chama dispatchs corretos ao trocar o período para um existente', () => {
    const { getByTestId } = setup();
    const select = getByTestId('select-component');
    fireEvent.change(select, { target: { value: '1' } });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_ESTUDANTES' })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LIMPAR' })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LIMPAR_SECOES' })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LIMPAR_QD' })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_PERIODO' })
    );
  });

  it('chama setPeriodoSelecionadoPAP sem payload se período não existir na lista', () => {
    const { getByTestId } = setup();
    const select = getByTestId('select-component');
    fireEvent.change(select, { target: { value: '999' } });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_PERIODO' })
    );
  });

  it('executa obetPeriodosPAP ao montar e popula lista', async () => {
    setup();
    await waitFor(() => {
      expect(ServicoRelatorioPAP.obterPeriodos).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SET_LISTA_PERIODOS' })
      );
    });
  });
});
