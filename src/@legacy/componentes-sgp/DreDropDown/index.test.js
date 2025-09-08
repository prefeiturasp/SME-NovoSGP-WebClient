import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DreDropDown from './index';

jest.mock('~/componentes', () => ({
  SelectComponent: jest.fn(({ label, onChange, lista = [], ...props }) => (
    <>
      {label && <label>{label}</label>}
      <select
        data-testid="dre-select"
        {...props}
        onChange={e => onChange(e.target.value, lista, true)}
      >
        {lista.map(opt => (
          <option key={opt.valor} value={opt.valor}>
            {opt.desc}
          </option>
        ))}
      </select>
    </>
  )),
}));
jest.mock('~/componentes/loader', () => ({
  __esModule: true,
  default: ({ loading, children }) =>
    loading ? <div>Carregando...</div> : children,
}));
jest.mock('~/servicos/Abrangencia', () => ({
  buscarDres: jest.fn(() =>
    Promise.resolve({
      data: [
        { nome: 'DRE 1', codigo: '1', abreviacao: 'D1' },
        { nome: 'DRE 2', codigo: '2', abreviacao: 'D2' },
      ],
    })
  ),
}));
jest.mock('~/componentes-sgp/filtro/helper', () => ({
  ordenarLista: () => () => 0,
}));
jest.mock('~/utils/funcoes/gerais', () => ({
  valorNuloOuVazio: jest.fn(val => !val),
}));

describe('DreDropDown', () => {
  const setFieldValue = jest.fn();
  const onChange = jest.fn();
  const form = {
    values: { anoLetivo: 2024, dreId: '' },
    setFieldValue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente e buscar DREs', async () => {
    const { getByTestId, getByText } = render(
      <DreDropDown form={form} onChange={onChange} label="DRE" url="/dre" />
    );
    await waitFor(() => expect(getByTestId('dre-select')).toBeInTheDocument());
    expect(getByTestId('dre-select')).toBeInTheDocument();
    expect(getByText('DRE')).toBeInTheDocument();
  });

  it('deve chamar setFieldValue se só houver uma DRE', async () => {
    jest.useFakeTimers();
    const buscarDres = require('~/servicos/Abrangencia').buscarDres;
    buscarDres.mockResolvedValueOnce({
      data: [{ nome: 'Única DRE', codigo: '99', abreviacao: 'U' }],
    });
    const formUnica = {
      ...form,
      setFieldValue: jest.fn(),
      values: { anoLetivo: 2024, dreId: '' },
    };
    render(<DreDropDown form={formUnica} onChange={onChange} url="/dre" />);
    jest.runAllTimers();
    await waitFor(() =>
      expect(formUnica.setFieldValue).toHaveBeenCalledWith('dreId', '99')
    );
    jest.useRealTimers();
  });

  it('deve adicionar opção "Todas" se opcaoTodas for true', async () => {
    const { getByTestId } = render(
      <DreDropDown form={form} onChange={onChange} url="/dre" opcaoTodas />
    );
    await waitFor(() => expect(getByTestId('dre-select')).toBeInTheDocument());
  });

  it('deve chamar onChange ao alterar dreId', async () => {
    const formComDre = {
      ...form,
      values: { ...form.values, dreId: '1' },
    };
    render(<DreDropDown form={formComDre} onChange={onChange} url="/dre" />);
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith('1', expect.any(Array))
    );
  });

  it('deve desabilitar o select se desabilitado for true', async () => {
    const { getByTestId } = render(
      <DreDropDown form={form} onChange={onChange} url="/dre" desabilitado />
    );
    await waitFor(() => expect(getByTestId('dre-select')).toBeDisabled());
  });

  it('deve chamar onChange ao selecionar uma DRE manualmente', async () => {
    const { getByTestId } = render(
      <DreDropDown form={form} onChange={onChange} url="/dre" />
    );
    await waitFor(() => expect(getByTestId('dre-select')).toBeInTheDocument());
    fireEvent.change(getByTestId('dre-select'), { target: { value: '2' } });
    expect(onChange).toHaveBeenCalledWith('2', expect.any(Array), true);
  });

  it('não deve buscar DREs se temModalidade for false', async () => {
    const buscarDres = require('~/servicos/Abrangencia').buscarDres;
    render(
      <DreDropDown
        form={form}
        onChange={onChange}
        url="/dre"
        temModalidade={false}
      />
    );
    await waitFor(() => expect(buscarDres).not.toHaveBeenCalled());
  });
});
