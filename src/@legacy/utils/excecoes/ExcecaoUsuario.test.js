import ExcecaoUsuario from './ExcecaoUsuario';
import RFNãoEncontradoExcecao from './RFNãoEncontradoExcecao';

describe('ExcecaoUsuario', () => {
  it('guarda nome, número e mensagem', () => {
    const erro = new ExcecaoUsuario('Teste', 9, 'falhou');
    expect(erro.nome).toBe('Teste');
    expect(erro.numero).toBe(9);
    expect(erro.mensagem).toBe('falhou');
  });
});

describe('RFNãoEncontradoExcecao', () => {
  it('usa os valores padrão de RF não encontrado', () => {
    const erro = new RFNãoEncontradoExcecao();
    expect(erro.nome).toBe('RF não encontrado');
    expect(erro.numero).toBe(1);
    expect(erro.mensagem).toBe('Registro funcional não foi encontrado!');
  });
});
