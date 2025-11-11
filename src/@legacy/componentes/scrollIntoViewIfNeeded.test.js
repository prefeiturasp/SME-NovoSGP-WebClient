describe('scrollIntoViewIfNeeded', () => {
  it('executa sem erros', () => {
    Element.prototype.scrollIntoViewIfNeeded = jest.fn();
    const el = document.createElement('div');
    expect(() => {
      el.scrollIntoViewIfNeeded();
    }).not.toThrow();
  });
});
