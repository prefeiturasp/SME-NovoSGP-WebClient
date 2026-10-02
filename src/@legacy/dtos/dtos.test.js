import DisciplinaDTO from './disciplinaDto';
import filtroPlanoAnualDto from './filtroPlanoAnualDto';
import FiltroPlanoAnualExpandidoDto from './filtroPlanoAnualExpandidoDto';

describe('DisciplinaDTO', () => {
  it('inicializa campos e selecionada=false', () => {
    const disciplina = new DisciplinaDTO('1', 'Matemática', true, false);
    expect(disciplina.codigo).toBe('1');
    expect(disciplina.nome).toBe('Matemática');
    expect(disciplina.possuiObjetivos).toBe(true);
    expect(disciplina.regencia).toBe(false);
    expect(disciplina.selecionada).toBe(false);
  });
});

describe('filtroPlanoAnualDto', () => {
  it('guarda os parâmetros do construtor', () => {
    const filtro = new filtroPlanoAnualDto(2024, 1, 'ue', 'turma', 10);
    expect(filtro.anoLetivo).toBe(2024);
    expect(filtro.bimestre).toBe(1);
    expect(filtro.escolaId).toBe('ue');
    expect(filtro.turmaId).toBe('turma');
    expect(filtro.ComponenteCurricularEolId).toBe(10);
  });
});

describe('FiltroPlanoAnualExpandidoDto', () => {
  it('guarda os parâmetros do construtor', () => {
    const filtro = new FiltroPlanoAnualExpandidoDto(2024, 10, 'ue', 5, 'turma');
    expect(filtro.anoLetivo).toBe(2024);
    expect(filtro.componenteCurricularEolId).toBe(10);
    expect(filtro.escolaId).toBe('ue');
    expect(filtro.modalidadePlanoAnual).toBe(5);
    expect(filtro.turmaId).toBe('turma');
  });
});
