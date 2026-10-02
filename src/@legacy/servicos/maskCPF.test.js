import cpfMask from './maskCPF';

describe('cpfMask', () => {
  it('formata CPF completo corretamente', () => {
    expect(cpfMask('12345678901')).toBe('123.456.789-01');
  });

  it('formata CPF parcial', () => {
    expect(cpfMask('123456')).toBe('123.456');
  });

  it('retorna string vazia para entrada vazia', () => {
    expect(cpfMask('')).toBe('');
  });

  it('ignora caracteres não numéricos', () => {
    expect(cpfMask('123.456.789-01')).toBe('123.456.789-01');
  });

  it('limita a 14 caracteres formatados', () => {
    expect(cpfMask('123456789012345')).toBe('123.456.789-01');
  });
});
