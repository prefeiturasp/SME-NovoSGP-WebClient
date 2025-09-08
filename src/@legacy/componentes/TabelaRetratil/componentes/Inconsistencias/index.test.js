import { render, screen } from '@testing-library/react';
import InconsistenciasEstudante from './index';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { SGP_POPOVER_INCONSISTENCIAS_ESTUDANTE } from '@/@legacy/constantes/ids/popover';

jest.mock('antd', () => ({
  Popover: ({ id, content, children }) => (
    <div data-testid="popover" id={id}>
      {children}
      {content}
    </div>
  ),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('shortid', () => {
  let count = 0;
  return {
    generate: jest.fn(() => `key${++count}`),
  };
});

describe('Componente InconsistenciasEstudante', () => {
  const sampleStore = [{ alunoCodigo: 123, inconsistencias: ['Err1', 'Err2'] }];

  beforeEach(() => {
    useSelector.mockClear();
    shortid.generate.mockClear();
  });

  it('não renderiza quando codigoAluno não é informado', () => {
    useSelector.mockReturnValue(sampleStore);
    render(<InconsistenciasEstudante />);
    expect(screen.queryByTestId('popover')).toBeNull();
  });

  it('não renderiza quando store está vazio', () => {
    useSelector.mockReturnValue([]);
    render(<InconsistenciasEstudante codigoAluno="123" />);
    expect(screen.queryByTestId('popover')).toBeNull();
  });

  it('não renderiza quando não há aluno correspondente', () => {
    useSelector.mockReturnValue([{ alunoCodigo: 999, inconsistencias: ['X'] }]);
    render(<InconsistenciasEstudante codigoAluno="123" />);
    expect(screen.queryByTestId('popover')).toBeNull();
  });

  it('renderiza Popover com inconsistências quando existe correspondência', () => {
    useSelector.mockReturnValue(sampleStore);
    render(<InconsistenciasEstudante codigoAluno="123" />);
    const popover = screen.getByTestId('popover');
    expect(popover).toBeInTheDocument();
    expect(popover).toHaveAttribute(
      'id',
      SGP_POPOVER_INCONSISTENCIAS_ESTUDANTE
    );

    const alertIcon = popover.querySelector('.icone-inconsistencia');
    expect(alertIcon).toBeInTheDocument();

    expect(screen.getByText('Err1')).toBeInTheDocument();
    expect(screen.getByText('Err2')).toBeInTheDocument();

    expect(shortid.generate).toHaveBeenCalledTimes(2);
  });

  it('renderiza Popover com apenas uma inconsistência (cobre o renderContent por completo)', () => {
    useSelector.mockReturnValue([
      { alunoCodigo: 123, inconsistencias: ['ErroUnico'] },
    ]);
    render(<InconsistenciasEstudante codigoAluno="123" />);
    const popover = screen.getByTestId('popover');
    expect(popover).toBeInTheDocument();
    expect(screen.getByText('ErroUnico')).toBeInTheDocument();
    expect(shortid.generate).toHaveBeenCalledTimes(1);
  });
});
