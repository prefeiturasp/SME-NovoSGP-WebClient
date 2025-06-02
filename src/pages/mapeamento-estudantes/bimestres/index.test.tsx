import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BimestresMapeamentoEstudantes } from './index';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import {
  setBimestreSelecionado,
  setDadosSecoesMapeamentoEstudantes,
  setMapeamentoEstudanteId,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';

jest.mock('@/core/hooks/use-redux');
jest.mock('@/core/services/mapeamento-estudantes-service');
jest.mock('~/redux/modulos/mapeamentoEstudantes/actions', () => ({
  setBimestreSelecionado: jest.fn(),
  setDadosSecoesMapeamentoEstudantes: jest.fn(),
  setMapeamentoEstudanteId: jest.fn(),
}));
jest.mock('~/redux/modulos/questionarioDinamico/actions', () => ({
  setLimparDadosQuestionarioDinamico: jest.fn(),
  setListaSecoesEmEdicao: jest.fn(),
}));

const mockDispatch = jest.fn();
const turmaPadrao = { modalidade: 1 };
const usuarioMock = { turmaSelecionada: turmaPadrao };
const stateMock = {
  usuario: usuarioMock,
  mapeamentoEstudantes: { bimestreSelecionado: 'BIMESTRE_1' },
};

jest.mock('@/components/lib/inputs/select', () => (props: any) => (
  <select
    data-testid="select-bimestre"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
  >
    {props.options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
));

describe('BimestresMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(stateMock));
    (mapeamentoEstudantesService.salvar as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    stateMock.usuario.turmaSelecionada = { modalidade: 1 };
  });

  it('renderiza as opções de bimestre corretamente para modalidade comum', () => {
    render(<BimestresMapeamentoEstudantes />);
    const select = screen.getByTestId('select-bimestre');
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(4);
  });

  it('renderiza apenas 2 bimestres para modalidade EJA', () => {
    stateMock.usuario.turmaSelecionada = { modalidade: ModalidadeEnum.EJA };
    render(<BimestresMapeamentoEstudantes />);
    const select = screen.getByTestId('select-bimestre');
    expect(select.children).toHaveLength(2);
  });
  it('chama as actions corretas ao trocar de bimestre', async () => {
    (mapeamentoEstudantesService.salvar as jest.Mock).mockResolvedValue(true);
    render(<BimestresMapeamentoEstudantes />);
    fireEvent.change(screen.getByTestId('select-bimestre'), { target: { value: 'BIMESTRE_2' } });
    await waitFor(() => {
      expect(mapeamentoEstudantesService.salvar).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setDadosSecoesMapeamentoEstudantes(undefined));
      expect(mockDispatch).toHaveBeenCalledWith(setMapeamentoEstudanteId(undefined));
      expect(mockDispatch).toHaveBeenCalledWith(setLimparDadosQuestionarioDinamico());
      expect(mockDispatch).toHaveBeenCalledWith(setListaSecoesEmEdicao([]));
      expect(mockDispatch).toHaveBeenCalledWith(setBimestreSelecionado('BIMESTRE_2'));
    });
  });

  it('não troca o bimestre se salvar retornar falso', async () => {
    (mapeamentoEstudantesService.salvar as jest.Mock).mockResolvedValue(false);
    render(<BimestresMapeamentoEstudantes />);
    fireEvent.change(screen.getByTestId('select-bimestre'), { target: { value: 'BIMESTRE_2' } });
    await waitFor(() => {
      expect(mapeamentoEstudantesService.salvar).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalledWith(setBimestreSelecionado('BIMESTRE_2'));
    });
  });
});
