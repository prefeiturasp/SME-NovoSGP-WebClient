import { render, screen } from '@testing-library/react';
import { useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { FormDinamicoMapeamentoEstudantesSecoes } from './index';
import '@testing-library/jest-dom';

jest.mock('@/core/hooks/use-redux');
jest.mock('@/core/services/mapeamento-estudantes-service');
jest.mock('../form-dinamico-campos', () => ({
  FormDinamicoMapeamentoEstudantesCampos: (props: any) => (
    <div data-testid={`secao-${props.secao.id}`}>{JSON.stringify(props)}</div>
  ),
}));

describe('FormDinamicoMapeamentoEstudantesSecoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza nada se não houver seções', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { id: 1 } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: { codigoEOL: 123 },
          bimestreSelecionado: 1,
          dadosSecoesMapeamentoEstudantes: [],
          mapeamentoEstudanteId: 10,
        },
      }),
    );
    const { container } = render(<FormDinamicoMapeamentoEstudantesSecoes />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza campos dinâmicos para cada seção', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { id: 1 } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: { codigoEOL: 123 },
          bimestreSelecionado: 1,
          dadosSecoesMapeamentoEstudantes: [
            { id: 1, nome: 'Secao 1' },
            { id: 2, nome: 'Secao 2' },
          ],
          mapeamentoEstudanteId: 10,
        },
      }),
    );
    render(<FormDinamicoMapeamentoEstudantesSecoes />);
    expect(screen.getByTestId('secao-1')).toBeInTheDocument();
    expect(screen.getByTestId('secao-2')).toBeInTheDocument();
  });

  it('chama mapeamentoEstudantesService.obterIdentificador ao montar', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        usuario: { turmaSelecionada: { id: 1 } },
        mapeamentoEstudantes: {
          dadosAlunoObjectCard: { codigoEOL: 123 },
          bimestreSelecionado: 1,
          dadosSecoesMapeamentoEstudantes: [{ id: 1, nome: 'Secao 1' }],
          mapeamentoEstudanteId: 10,
        },
      }),
    );
    render(<FormDinamicoMapeamentoEstudantesSecoes />);
    expect(mapeamentoEstudantesService.obterIdentificador).toHaveBeenCalledWith(123, 1, 1);
  });
});
