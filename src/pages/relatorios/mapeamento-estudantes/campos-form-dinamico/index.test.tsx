import { render, waitFor, act } from '@testing-library/react';
import { Form } from 'antd';
import { RelMapeamentoEstudantesCamposFormDinamico } from './index';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { OPCAO_TODOS } from '~/constantes';

jest.mock('@/core/services/mapeamento-estudantes-service', () => ({
  obterFiltrosOpcoesRespostaMapeamentoEstudante: jest.fn(),
}));

jest.mock('@/components/lib/inputs/select', () => (props) => (
  <select data-testid={`select-${props.placeholder}`} disabled={props.disabled || false} />
));

describe('RelMapeamentoEstudantesCamposFormDinamico', () => {
  it('renderiza <></> enquanto initialValues está vazio', async () => {
    (
      mapeamentoEstudantesService.obterFiltrosOpcoesRespostaMapeamentoEstudante as jest.Mock
    ).mockResolvedValue({
      sucesso: false,
    });

    let container, queryAllByRole;
    await act(async () => {
      const renderResult = render(
        <Form initialValues={{ turmas: [] }}>
          <RelMapeamentoEstudantesCamposFormDinamico />
        </Form>,
      );
      container = renderResult.container;
      queryAllByRole = renderResult.queryAllByRole;
    });
    expect(container.querySelector('form')).toBeInTheDocument();
    expect(queryAllByRole('combobox').length).toBe(0);
  });

  it('renderiza os campos select após obter dados', async () => {
    (
      mapeamentoEstudantesService.obterFiltrosOpcoesRespostaMapeamentoEstudante as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: {
        opcoesRespostaDistorcaoIdadeAnoSerie: [{ id: 1, nome: 'Distorção' }],
        opcoesRespostaPossuiPlanoAEE: [],
        opcoesRespostaAcompanhadoNAAPA: [],
        opcoesRespostaProgramaSPIntegral: [],
        opcoesRespostaAvaliacoesExternasProvaSP: ['Avaliação A'],
        opcoesRespostaHipoteseEscritaEstudante: ['Silábico'],
        opcoesRespostaFrequencia: [],
      },
    });

    let findByTestId;
    await act(async () => {
      const renderResult = render(
        <Form initialValues={{ turmas: [] }}>
          <RelMapeamentoEstudantesCamposFormDinamico />
        </Form>,
      );
      findByTestId = renderResult.findByTestId;
    });
    await waitFor(() => findByTestId('select-Distorção idade/ano/série'));
    expect(await findByTestId('select-Distorção idade/ano/série')).toBeInTheDocument();
    expect(await findByTestId('select-Hipótese de escrita do estudante')).toBeInTheDocument();
  });

  it('desabilita o campo Hipótese de escrita se não há turmas', async () => {
    (
      mapeamentoEstudantesService.obterFiltrosOpcoesRespostaMapeamentoEstudante as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: {
        opcoesRespostaDistorcaoIdadeAnoSerie: [],
        opcoesRespostaPossuiPlanoAEE: [],
        opcoesRespostaAcompanhadoNAAPA: [],
        opcoesRespostaProgramaSPIntegral: [],
        opcoesRespostaAvaliacoesExternasProvaSP: [],
        opcoesRespostaHipoteseEscritaEstudante: ['Pré-silábico'],
        opcoesRespostaFrequencia: [],
      },
    });

    let findByTestId;
    await act(async () => {
      const renderResult = render(
        <Form initialValues={{}}>
          <RelMapeamentoEstudantesCamposFormDinamico />
        </Form>,
      );
      findByTestId = renderResult.findByTestId;
    });
    const select = await findByTestId('select-Hipótese de escrita do estudante');
    expect(select).toHaveAttribute('disabled');
  });

  it('habilita o campo Hipótese de escrita se turma for TODOS', async () => {
    (
      mapeamentoEstudantesService.obterFiltrosOpcoesRespostaMapeamentoEstudante as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: {
        opcoesRespostaDistorcaoIdadeAnoSerie: [],
        opcoesRespostaPossuiPlanoAEE: [],
        opcoesRespostaAcompanhadoNAAPA: [],
        opcoesRespostaProgramaSPIntegral: [],
        opcoesRespostaAvaliacoesExternasProvaSP: [],
        opcoesRespostaHipoteseEscritaEstudante: ['Pré-silábico'],
        opcoesRespostaFrequencia: [],
      },
    });

    let findByTestId;
    await act(async () => {
      const renderResult = render(
        <Form initialValues={{ turmas: [{ value: OPCAO_TODOS }] }}>
          <RelMapeamentoEstudantesCamposFormDinamico />
        </Form>,
      );
      findByTestId = renderResult.findByTestId;
    });
    const select = await findByTestId('select-Hipótese de escrita do estudante');
    expect(select).not.toHaveAttribute('disabled');
  });
});
