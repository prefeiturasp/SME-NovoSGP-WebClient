import { gerarCoresDinamicas } from './coresDinamicas';

describe('gerarCoresDinamicas', () => {
  it('retorna fatia da paleta quando quantidade cabe nela', () => {
    const cores = gerarCoresDinamicas(3);
    expect(cores).toHaveLength(3);
    expect(cores[0]).toBe('#1976D2');
    expect(cores[1]).toBe('#512DA8');
  });

  it('retorna paleta completa quando quantidade é igual ao tamanho da paleta', () => {
    const cores = gerarCoresDinamicas(20);
    expect(cores).toHaveLength(20);
  });

  it('gera cores extras em hex quando quantidade ultrapassa a paleta', () => {
    const cores = gerarCoresDinamicas(25);
    expect(cores).toHaveLength(25);
    expect(cores[20]).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
