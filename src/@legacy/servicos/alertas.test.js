import { store } from '@/core/redux';
import { confirmar, confirmarComOpcoes } from './alertas';

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

const obterPayloadDespachado = () => store.dispatch.mock.calls[0][0].payload;

describe('confirmarComOpcoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia as opções nomeadas para o modal de confirmação', () => {
    confirmarComOpcoes({
      titulo: 'Atenção',
      texto: 'Texto de apoio',
      textoNegrito: 'Deseja continuar?',
      textoOk: 'Continuar',
      textoCancelar: 'Voltar',
      primeiroExibirTextoNegrito: true,
      inverterBotoes: true,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: '@alertas/confirmar',
      payload: {
        titulo: 'Atenção',
        texto: 'Texto de apoio',
        textoNegrito: 'Deseja continuar?',
        resolve: expect.any(Function),
        textoOk: 'Continuar',
        textoCancelar: 'Voltar',
        primeiroExibirTextoNegrito: true,
        inverterBotoes: true,
      },
    });
  });

  it('deixa sem valor as opções não informadas', () => {
    confirmarComOpcoes({
      titulo: 'Atenção',
      textoNegrito: 'Deseja continuar?',
    });

    const payload = obterPayloadDespachado();
    expect(payload.texto).toBeUndefined();
    expect(payload.textoOk).toBeUndefined();
    expect(payload.textoCancelar).toBeUndefined();
    expect(payload.inverterBotoes).toBeUndefined();
  });

  it('resolve com a resposta escolhida no modal', async () => {
    const resposta = confirmarComOpcoes({ titulo: 'Atenção' });

    obterPayloadDespachado().resolve(true);

    await expect(resposta).resolves.toBe(true);
  });
});

describe('confirmar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('continua aceitando os parâmetros por posição', () => {
    confirmar('Atenção', 'Texto de apoio', 'Deseja continuar?');

    expect(obterPayloadDespachado()).toEqual(
      expect.objectContaining({
        titulo: 'Atenção',
        texto: 'Texto de apoio',
        textoNegrito: 'Deseja continuar?',
        inverterBotoes: undefined,
      })
    );
  });
});
