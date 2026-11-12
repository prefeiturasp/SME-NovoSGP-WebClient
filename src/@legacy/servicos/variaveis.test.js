describe('variaveis de sessao', () => {
  it('usa 10 minutos como padrao para o aviso de expiracao', () => {
    jest.isolateModules(() => {
      delete globalThis.process.env
        .REACT_APP_TEMPO_AVISO_EXPIRACAO_SESSAO_MINUTOS;
      const { tempoAvisoExpiracaoSessaoMinutos } =
        jest.requireActual('./variaveis');

      expect(tempoAvisoExpiracaoSessaoMinutos).toBe(10);
    });
  });
});
