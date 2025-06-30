import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AnoLetivoDropDown from './AnoLetivoDropDown';

jest.mock('~/componentes', () => ({
  Loader: ({ children }) => <div data-testid="loader">{children}</div>,
  SelectComponent: ({ valueOption, valueText, lista, ...rest }) => (
    <select data-testid="select" {...rest} />
  ),
}));
jest.mock('~/componentes-sgp/filtro/helper', () => ({
  obterAnosLetivos: jest.fn(),
}));

import FiltroHelper from '~/componentes-sgp/filtro/helper';

const mockForm = {
  setFieldValue: jest.fn(),
};

describe('AnoLetivoDropDown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader e SelectComponent', async () => {
    FiltroHelper.obterAnosLetivos.mockResolvedValue([]);
    let getByTestId;
    await act(async () => {
      ({ getByTestId } = render(
        <AnoLetivoDropDown
          form={mockForm}
          onChange={jest.fn()}
          consideraHistorico={false}
        />
      ));
    });
    expect(getByTestId('loader')).toBeInTheDocument();
    expect(getByTestId('select')).toBeInTheDocument();
  });

  it('chama obterAnosLetivos ao montar', async () => {
    FiltroHelper.obterAnosLetivos.mockResolvedValue([
      { valor: 2024, desc: '2024' },
    ]);
    const onChange = jest.fn();
    await act(async () => {
      render(
        <AnoLetivoDropDown
          form={mockForm}
          onChange={onChange}
          consideraHistorico={true}
        />
      );
    });
    await waitFor(() => {
      expect(FiltroHelper.obterAnosLetivos).toHaveBeenCalledWith({
        consideraHistorico: true,
      });
    });
  });

  it('seta anoLetivo e chama onChange quando recebe lista', async () => {
    FiltroHelper.obterAnosLetivos.mockResolvedValue([
      { valor: 2023, desc: '2023' },
    ]);
    const onChange = jest.fn();
    await act(async () => {
      render(
        <AnoLetivoDropDown
          form={mockForm}
          onChange={onChange}
          consideraHistorico={false}
        />
      );
    });
    await waitFor(() => {
      expect(mockForm.setFieldValue).toHaveBeenCalledWith(
        'anoLetivo',
        '2023',
        false
      );
      expect(onChange).toHaveBeenCalledWith('2023');
    });
  });

  it('seta anoLetivo vazio e chama onChange vazio se lista vazia', async () => {
    FiltroHelper.obterAnosLetivos.mockResolvedValue([]);
    const onChange = jest.fn();
    await act(async () => {
      render(
        <AnoLetivoDropDown
          form={mockForm}
          onChange={onChange}
          consideraHistorico={false}
        />
      );
    });
    await waitFor(() => {
      expect(mockForm.setFieldValue).toHaveBeenCalledWith(
        'anoLetivo',
        '',
        false
      );
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  it('desabilita select se só tem um ano', async () => {
    FiltroHelper.obterAnosLetivos.mockResolvedValue([
      { valor: 2022, desc: '2022' },
    ]);
    let getByTestId;
    await act(async () => {
      ({ getByTestId } = render(
        <AnoLetivoDropDown
          form={mockForm}
          onChange={jest.fn()}
          consideraHistorico={false}
        />
      ));
    });
    await waitFor(() => {
      expect(getByTestId('select')).toBeDisabled();
    });
  });
});
