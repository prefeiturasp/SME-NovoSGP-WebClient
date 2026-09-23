import {
  converterAcaoTecla,
  acharItem,
  esperarMiliSegundos,
  tratarStringComponenteCurricularNome,
} from './direcaoSetas';

describe('converterAcaoTecla', () => {
  it('retorna -1 para seta para cima (38)', () => {
    expect(converterAcaoTecla(38)).toBe(-1);
  });

  it('retorna 1 para seta para baixo (40)', () => {
    expect(converterAcaoTecla(40)).toBe(1);
  });

  it('retorna 0 para tecla 0 (48 e 96)', () => {
    expect(converterAcaoTecla(48)).toBe(0);
    expect(converterAcaoTecla(96)).toBe(0);
  });

  it('retorna false para tecla desconhecida', () => {
    expect(converterAcaoTecla(13)).toBe(false);
  });
});

describe('acharItem', () => {
  const dados = [
    { id: 1, nome: 'Ana' },
    { id: 2, nome: 'Bia' },
    { id: 3, nome: 'Cida' },
  ];

  it('retorna o próximo item quando numero é 1', () => {
    expect(acharItem(dados, { id: 1 }, 1, 'id')).toEqual([
      { id: 2, nome: 'Bia' },
    ]);
  });

  it('retorna string vazia quando lista está vazia', () => {
    expect(acharItem([], { id: 1 }, 1, 'id')).toBe('');
  });

  it('retorna string vazia quando dados é undefined', () => {
    expect(acharItem(undefined, { id: 1 }, 1, 'id')).toBe('');
  });
});

describe('tratarStringComponenteCurricularNome', () => {
  it('normaliza nome removendo acentos e espaços', () => {
    expect(tratarStringComponenteCurricularNome('Língua Portuguesa')).toBe(
      'linguaportuguesa'
    );
  });

  it('retorna undefined quando item é undefined', () => {
    expect(tratarStringComponenteCurricularNome(undefined)).toBeUndefined();
  });
});

describe('esperarMiliSegundos', () => {
  it('resolve após o tempo informado', async () => {
    jest.useFakeTimers();
    const promise = esperarMiliSegundos(100);
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBeUndefined();
    jest.useRealTimers();
  });
});
