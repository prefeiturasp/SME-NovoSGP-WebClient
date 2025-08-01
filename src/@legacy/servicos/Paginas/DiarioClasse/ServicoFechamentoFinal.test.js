import ServicoFechamentoFinal from './ServicoFechamentoFinal';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoFechamentoFinal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar api.get com os parâmetros corretos em obter()', () => {
    const turmaCodigo = 101;
    const disciplinaCodigo = 202;
    const ehRegencia = true;
    const semestre = 2;

    ServicoFechamentoFinal.obter(turmaCodigo, disciplinaCodigo, ehRegencia, semestre);

    expect(api.get).toHaveBeenCalledWith(
      'v1/fechamentos/finais?DisciplinaCodigo=202&TurmaCodigo=101&ehRegencia=true&semestre=2'
    );
  });

  it('deve usar semestre 0 como default se não for fornecido', () => {
    ServicoFechamentoFinal.obter(101, 202, false);

    expect(api.get).toHaveBeenCalledWith(
      'v1/fechamentos/finais?DisciplinaCodigo=202&TurmaCodigo=101&ehRegencia=false&semestre=0'
    );
  });

  it('deve chamar api.post com os dados de fechamento final em salvar()', () => {
    const dadosFechamento = {
      turmaCodigo: 101,
      disciplinaCodigo: 202,
      notas: [],
    };

    ServicoFechamentoFinal.salvar(dadosFechamento);

    expect(api.post).toHaveBeenCalledWith('v1/fechamentos/finais', dadosFechamento);
  });
});
