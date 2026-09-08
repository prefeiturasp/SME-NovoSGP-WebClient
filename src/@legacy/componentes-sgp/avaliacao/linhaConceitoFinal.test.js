import { render, screen } from '@testing-library/react';
import LinhaConceitoFinal from './linhaConceitoFinal';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('shortid', () => ({ generate: () => 'id' }));
jest.mock('antd', () => ({
  Tooltip: ({ children, title }) => (
    <div title={title}>{children}</div>
  ),
}));
jest.mock('~/componentes', () => ({
  MarcadorTriangulo: () => <span data-testid="marcador" />,
}));
jest.mock('~/utils', () => ({
  tratarStringComponenteCurricularNome: nome => nome?.toLowerCase(),
}));

import { useSelector } from 'react-redux';

describe('LinhaConceitoFinal', () => {
  const montarCampo = jest.fn((disciplina, index) => (
    <span data-testid={`campo-${index}`}>{disciplina}</span>
  ));

  const renderNaTabela = ui =>
    render(
      <table>
        <tbody>{ui}</tbody>
      </table>
    );

  it('não renderiza quando a linha não está expandida', () => {
    useSelector.mockReturnValue([]);
    const { container } = renderNaTabela(
      <LinhaConceitoFinal indexLinha={0} montarCampoNotaConceitoFinal={montarCampo} />
    );
    expect(container.querySelector('.linha-conceito-final')).toBeNull();
  });

  it('renderiza notas do aluno quando expandida', () => {
    useSelector.mockReturnValue([true]);
    renderNaTabela(
      <LinhaConceitoFinal
        indexLinha={0}
        dados={{ avaliacoes: [1, 2] }}
        montarCampoNotaConceitoFinal={montarCampo}
        aluno={{
          id: 9,
          notasBimestre: [
            { disciplina: 'Mat', emAprovacao: true },
            { disciplina: 'Cie', emAprovacao: false },
          ],
        }}
      />
    );
    expect(screen.getByTestId('campo-0')).toHaveTextContent('Mat');
    expect(screen.getByTestId('campo-1')).toHaveTextContent('Cie');
    expect(screen.getByTestId('marcador')).toBeInTheDocument();
  });
});
