import { renderizarMes } from './dataMes';

describe('renderizarMes', () => {
  it('retorna Janeiro para mês 1', () => {
    expect(renderizarMes(1)).toBe('Janeiro');
  });

  it('retorna Junho para mês 6', () => {
    expect(renderizarMes(6)).toBe('Junho');
  });

  it('retorna Dezembro para mês 12', () => {
    expect(renderizarMes(12)).toBe('Dezembro');
  });

  it('retorna undefined para mês inválido', () => {
    expect(renderizarMes(0)).toBeUndefined();
    expect(renderizarMes(13)).toBeUndefined();
  });

  it('retorna undefined para null', () => {
    expect(renderizarMes(null)).toBeUndefined();
  });
});
