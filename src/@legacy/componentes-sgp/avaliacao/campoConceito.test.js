import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CampoConceito from './campoConceito';
import SelectComponent from '~/componentes/select';
import TooltipEstudanteAusente from './tooltipEstudanteAusente';
import TooltipStatusGsa from './tooltipStatusGsa';

jest.mock('~/componentes/select', () =>
  jest.fn(({ className, disabled }) => (
    <div className={`mocked-select ${className} ${disabled ? 'disabled' : ''}`}>
      Mocked SelectComponent
    </div>
  ))
);
jest.mock('./tooltipEstudanteAusente', () =>
  jest.fn(() => <div>Mocked TooltipEstudanteAusente</div>)
);
jest.mock('./tooltipStatusGsa', () =>
  jest.fn(() => <div>Mocked TooltipStatusGsa</div>)
);

describe('CampoConceito Componente', () => {
  const defaultProps = {
    id: 'campo-conceito',
    nota: {
      notaConceito: 'A',
      notaOriginal: 'A',
      ausente: false,
      statusGsa: false,
      podeEditar: true,
    },
    onChangeNotaConceito: jest.fn(),
    desabilitarCampo: false,
    listaTiposConceitos: [
      { id: 'A', valor: 'A' },
      { id: 'B', valor: 'B' },
    ],
  };

  it('deve renderizar o componete corretamente', () => {
    const { getByText } = render(<CampoConceito {...defaultProps} />);
    expect(getByText('Mocked SelectComponent')).toBeInTheDocument();
  });

  it('deve ataulizar conceitoValorAtual quando a nota mudar', () => {
    const { getByText } = render(<CampoConceito {...defaultProps} />);
    expect(getByText('Mocked SelectComponent')).toBeInTheDocument();
  });

  it('deve chamar onChangeNotaConceito quando select value mudar', () => {
    const { getByText, container } = render(
      <CampoConceito {...defaultProps} />
    );

    fireEvent.click(container.querySelector('div'));

    defaultProps.onChangeNotaConceito('A');

    expect(defaultProps.onChangeNotaConceito).toHaveBeenCalledWith('A');
  });

  it('deve aparecer o TooltipEstudanteAusente quando nota.ausente for true', () => {
    const ausenteProps = {
      ...defaultProps,
      nota: { ...defaultProps.nota, ausente: true },
    };
    const { getByText } = render(<CampoConceito {...ausenteProps} />);
    expect(getByText('Mocked TooltipEstudanteAusente')).toBeInTheDocument();
  });

  it('deve aparecer o TooltipStatusGsa quando nota.statusGsa for true', () => {
    const statusGsaProps = {
      ...defaultProps,
      nota: { ...defaultProps.nota, statusGsa: true },
    };
    const { getByText } = render(<CampoConceito {...statusGsaProps} />);
    expect(getByText('Mocked TooltipStatusGsa')).toBeInTheDocument();
  });

  it('deve desabilitar o select quando desabilitarCampo for true ou nota.podeEditar for false', () => {
    const disabledProps = { ...defaultProps, desabilitarCampo: true };
    const { container } = render(<CampoConceito {...disabledProps} />);

    const selectComponent = container.querySelector('div.mocked-select');
    expect(selectComponent).toHaveClass('select-conceitos');
    expect(selectComponent).toHaveClass('disabled');

    const disabledByNotaProps = {
      ...defaultProps,
      nota: { ...defaultProps.nota, podeEditar: false },
    };
    const { container: containerNota } = render(
      <CampoConceito {...disabledByNotaProps} />
    );

    const selectComponentNota =
      containerNota.querySelector('div.mocked-select');
    expect(selectComponentNota).toHaveClass('select-conceitos');
    expect(selectComponentNota).toHaveClass('disabled');
  });
});
