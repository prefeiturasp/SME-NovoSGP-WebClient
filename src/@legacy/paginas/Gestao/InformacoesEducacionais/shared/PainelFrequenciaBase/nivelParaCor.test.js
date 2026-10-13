import nivelParaCor from './nivelParaCor';

describe('nivelParaCor', () => {
  it('retorna verde para nível alto', () => {
    expect(nivelParaCor('Alto')).toBe('#2ECC71');
  });

  it('retorna verde para nível alta', () => {
    expect(nivelParaCor('Alta')).toBe('#2ECC71');
  });

  it('retorna amarelo para nível médio', () => {
    expect(nivelParaCor('Médio')).toBe('#F1C40F');
  });

  it('retorna amarelo para nível média', () => {
    expect(nivelParaCor('Média')).toBe('#F1C40F');
  });

  it('retorna vermelho para nível baixo', () => {
    expect(nivelParaCor('Baixo')).toBe('#E74C3C');
  });

  it('retorna vermelho para nível baixa', () => {
    expect(nivelParaCor('Baixa')).toBe('#E74C3C');
  });

  it('retorna cinza para valor desconhecido', () => {
    expect(nivelParaCor('outro')).toBe('#ccc');
  });

  it('retorna cinza para null', () => {
    expect(nivelParaCor(null)).toBe('#ccc');
  });

  it('retorna cinza para undefined', () => {
    expect(nivelParaCor(undefined)).toBe('#ccc');
  });

  it('retorna cinza para string vazia', () => {
    expect(nivelParaCor('')).toBe('#ccc');
  });
});
