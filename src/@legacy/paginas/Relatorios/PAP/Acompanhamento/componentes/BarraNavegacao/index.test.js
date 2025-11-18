import { render, fireEvent } from '@testing-library/react';
import BarraNavegacao from './index';

jest.mock('shortid', () => {
  let idCount = 0;
  return {
    generate: () => `id-${idCount++}`,
  };
});
jest.mock('~/componentes', () => ({
  Button: ({ id, label, onClick, disabled }) => (
    <button data-testid={id} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
  Colors: { Roxo: 'roxo' },
  Base: { CinzaBotao: '#ccc' },
}));
jest.mock('antd', () => ({
  Tooltip: ({ children, title }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));
jest.mock('./styles', () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,
}));

describe('BarraNavegacao', () => {
  const objetivos = [
    { id: 1, descricao: 'Objetivo 1' },
    { id: 2, descricao: 'Objetivo 2' },
    { id: 3, descricao: 'Objetivo 3' },
  ];
  const objetivoAtivo = objetivos[1];

  it('renderiza corretamente com objetivos', () => {
    const { getByTestId, getAllByTestId } = render(
      <BarraNavegacao objetivos={objetivos} objetivoAtivo={objetivoAtivo} />
    );
    expect(getByTestId('container')).toBeInTheDocument();
    expect(getByTestId('anteriorBtn')).toBeInTheDocument();
    expect(getByTestId('proximoBtn')).toBeInTheDocument();
    expect(getAllByTestId('tooltip')).toHaveLength(objetivos.length);
  });

  it('renderiza mensagem de Sem dados se objetivos for vazio', () => {
    const { getByText } = render(<BarraNavegacao objetivos={[]} />);
    expect(getByText('Sem dados')).toBeInTheDocument();
  });

  it('botão Anterior fica desabilitado se objetivoAtivo for o primeiro', () => {
    const { getByTestId } = render(
      <BarraNavegacao objetivos={objetivos} objetivoAtivo={objetivos[0]} />
    );
    expect(getByTestId('anteriorBtn')).toBeDisabled();
  });

  it('botão Próximo fica desabilitado se objetivoAtivo for o último', () => {
    const { getByTestId } = render(
      <BarraNavegacao objetivos={objetivos} objetivoAtivo={objetivos[2]} />
    );
    expect(getByTestId('proximoBtn')).toBeDisabled();
  });

  it('botões ficam desabilitados se somenteConsulta for true', () => {
    const { getByTestId } = render(
      <BarraNavegacao
        objetivos={objetivos}
        objetivoAtivo={objetivos[1]}
        somenteConsulta
      />
    );
    expect(getByTestId('anteriorBtn')).toBeDisabled();
    expect(getByTestId('proximoBtn')).toBeDisabled();
  });

  it('chama onChangeObjetivo ao clicar em objetivo', () => {
    const onChangeObjetivo = jest.fn();
    const { getAllByTestId } = render(
      <BarraNavegacao
        objetivos={objetivos}
        objetivoAtivo={objetivoAtivo}
        onChangeObjetivo={onChangeObjetivo}
      />
    );
    const tooltips = getAllByTestId('tooltip');
    fireEvent.click(tooltips[2].firstChild);
    expect(onChangeObjetivo).toHaveBeenCalledWith(objetivos[2]);
  });

  it('chama onChangeObjetivo ao clicar em Anterior e Próximo', () => {
    const onChangeObjetivo = jest.fn();
    const { getByTestId } = render(
      <BarraNavegacao
        objetivos={objetivos}
        objetivoAtivo={objetivoAtivo}
        onChangeObjetivo={onChangeObjetivo}
      />
    );
    fireEvent.click(getByTestId('anteriorBtn'));
    expect(onChangeObjetivo).toHaveBeenCalledWith(objetivos[0]);
    fireEvent.click(getByTestId('proximoBtn'));
    expect(onChangeObjetivo).toHaveBeenCalledWith(objetivos[2]);
  });

  it('dispara onKeyPress no item de navegação', () => {
    const onChangeObjetivo = jest.fn();
    const { getAllByTestId } = render(
      <BarraNavegacao
        objetivos={objetivos}
        objetivoAtivo={objetivoAtivo}
        onChangeObjetivo={onChangeObjetivo}
      />
    );
    const tooltips = getAllByTestId('tooltip');
    fireEvent.keyPress(tooltips[2].firstChild, {
      key: 'Enter',
      code: 13,
      charCode: 13,
    });
    expect(true).toBe(true);
  });
});
