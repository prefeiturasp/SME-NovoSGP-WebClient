import { render, waitFor, act } from '@testing-library/react';
import TurmasDropDown from './TurmasDropDown';

jest.mock('~/componentes', () => ({
  SelectComponent: ({ valueOption, valueText, lista, showSearch, ...rest }) => (
    <select data-testid="select" {...rest} />
  ),
}));
jest.mock('~/servicos/Abrangencia', () => ({
  buscarTurmas: jest.fn(),
}));

import AbrangenciaServico from '~/servicos/Abrangencia';

const mockForm = {
  values: { ueId: '1', modalidadeId: '2' },
  setFieldValue: jest.fn(),
};

describe('TurmasDropDown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza SelectComponent', async () => {
    AbrangenciaServico.buscarTurmas.mockResolvedValue({ data: [] });
    let getByTestId;
    await act(async () => {
      ({ getByTestId } = render(
        <TurmasDropDown
          form={mockForm}
          onChange={jest.fn()}
          label="Turma"
          anoLetivo="2024"
        />
      ));
    });
    expect(getByTestId('select')).toBeInTheDocument();
  });

  it('chama buscarTurmas se ueId e modalidadeId existem', async () => {
    AbrangenciaServico.buscarTurmas.mockResolvedValue({ data: [] });
    await act(async () => {
      render(
        <TurmasDropDown form={mockForm} onChange={jest.fn()} anoLetivo="2024" />
      );
    });
    await waitFor(() => {
      expect(AbrangenciaServico.buscarTurmas).toHaveBeenCalledWith(
        '1',
        '2',
        '',
        '2024',
        false,
        true
      );
    });
  });

  it('não chama buscarTurmas se ueId ou modalidadeId não existem', async () => {
    const form = { values: {}, setFieldValue: jest.fn() };
    await act(async () => {
      render(<TurmasDropDown form={form} onChange={jest.fn()} />);
    });
    expect(AbrangenciaServico.buscarTurmas).not.toHaveBeenCalled();
  });

  it('seta turmaId e chama onChange se só tem uma turma', async () => {
    AbrangenciaServico.buscarTurmas.mockResolvedValue({ data: [] });
    const form = {
      values: { ueId: '1', modalidadeId: '2' },
      setFieldValue: jest.fn(),
    };
    const onChange = jest.fn();
    await act(async () => {
      render(
        <TurmasDropDown form={form} onChange={onChange} anoLetivo="2024" />
      );
    });
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('turmaId', '0');
      expect(onChange).toHaveBeenCalledWith('0');
    });

    AbrangenciaServico.buscarTurmas.mockResolvedValue({
      data: [{ nome: 'Turma 1', codigo: '10', nomeFiltro: 'Turma 1' }],
    });
    const form2 = {
      values: { ueId: '1', modalidadeId: '2' },
      setFieldValue: jest.fn(),
    };
    const onChange2 = jest.fn();
    await act(async () => {
      render(
        <TurmasDropDown form={form2} onChange={onChange2} anoLetivo="2024" />
      );
    });
    await waitFor(() => {
      expect(form2.setFieldValue).not.toHaveBeenCalledWith('turmaId', '10');
      expect(onChange2).not.toHaveBeenCalledWith('10');
    });
  });

  it('desabilita select se não tem ueId ou modalidadeId', async () => {
    const form = { values: {}, setFieldValue: jest.fn() };
    let getByTestId;
    await act(async () => {
      ({ getByTestId } = render(
        <TurmasDropDown form={form} onChange={jest.fn()} />
      ));
    });
    expect(getByTestId('select')).toBeDisabled();
  });
});
