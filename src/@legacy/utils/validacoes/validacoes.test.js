jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(() => ({ geral: { telaEmEdicao: false } })),
    dispatch: jest.fn(),
  },
}));
jest.mock('~/servicos', () => ({ confirmar: jest.fn() }));
jest.mock('~/redux/modulos/geral/actions', () => ({
  setTelaEmEdicao: jest.fn(valor => ({ type: 'SET_TELA', payload: valor })),
}));

import { store } from '@/core/redux';
import { confirmar } from '~/servicos';
import {
  verificarTelaEdicao,
  validarAcaoTela,
  validarNavegacaoTela,
  isFieldRequired,
  ocultarColunaAvaliacaoComponenteRegencia,
  validaAntesDoSubmit,
} from './index';

describe('verificarTelaEdicao', () => {
  it('retorna o estado de edição', () => {
    store.getState.mockReturnValue({ geral: { telaEmEdicao: true } });
    expect(verificarTelaEdicao()).toBe(true);
  });
});

describe('validarAcaoTela', () => {
  it('retorna false quando a tela não está em edição', async () => {
    store.getState.mockReturnValue({ geral: { telaEmEdicao: false } });
    await expect(validarAcaoTela()).resolves.toBe(false);
  });

  it('confirma e retorna o inverso da resposta', async () => {
    store.getState.mockReturnValue({ geral: { telaEmEdicao: true } });
    confirmar.mockResolvedValue(true);
    await expect(validarAcaoTela()).resolves.toBe(false);
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('validarNavegacaoTela', () => {
  it('previne o evento e retorna false quando não há edição', async () => {
    store.getState.mockReturnValue({ geral: { telaEmEdicao: false } });
    const e = { preventDefault: jest.fn() };
    await expect(validarNavegacaoTela(e)).resolves.toBe(false);
    expect(e.preventDefault).toHaveBeenCalled();
  });
});

describe('isFieldRequired', () => {
  it('lê a flag required do schema', () => {
    expect(
      isFieldRequired('nome', { fields: { nome: { _exclusive: { required: true } } } })
    ).toBe(true);
    expect(isFieldRequired('nome', undefined)).toBeUndefined();
  });
});

describe('ocultarColunaAvaliacaoComponenteRegencia', () => {
  it('retorna false quando não é regência', () => {
    expect(ocultarColunaAvaliacaoComponenteRegencia(['Mat'], [{ nome: 'Mat' }], false)).toBe(
      false
    );
  });

  it('retorna true quando todos os componentes estão inativos', () => {
    expect(
      ocultarColunaAvaliacaoComponenteRegencia(
        ['Mat', 'Cie'],
        [
          { nome: 'Mat', ativo: false },
          { nome: 'Cie', ativo: false },
        ],
        true
      )
    ).toBe(true);
  });

  it('retorna false quando algum componente está ativo', () => {
    expect(
      ocultarColunaAvaliacaoComponenteRegencia(
        ['Mat', 'Cie'],
        [
          { nome: 'Mat', ativo: false },
          { nome: 'Cie', ativo: true },
        ],
        true
      )
    ).toBe(false);
  });
});

describe('validaAntesDoSubmit', () => {
  it('chama acaoPosValidar quando não há erros', async () => {
    jest.useFakeTimers();
    const form = {
      setFieldTouched: jest.fn(),
      validateForm: jest.fn().mockResolvedValue({}),
      values: { nome: 'ok' },
    };
    const acao = jest.fn();
    validaAntesDoSubmit(form, { nome: '' }, acao);
    expect(form.setFieldTouched).toHaveBeenCalledWith('nome', true, true);
    jest.runAllTimers();
    await Promise.resolve();
    expect(acao).toHaveBeenCalledWith({ nome: 'ok' });
    jest.useRealTimers();
  });
});
