// alertas.test.js
import { notification, Modal } from 'antd';
import { store } from '@/core/redux';
import {
  sucesso,
  erro,
  aviso,
  erros,
  confirmacao,
  confirmar,
  fecharModalConfirmacao,
} from './alertas';
import { CANCELADO_USUARIO, TOKEN_EXPIRADO } from '~/constantes';

// Mock das dependências
jest.mock('antd', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
  Modal: {
    confirm: jest.fn(),
  },
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe('Serviço de Alertas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.getState.mockReturnValue({ usuario: { logado: true } });
  });

  describe('Funções básicas de alerta', () => {
    it('deve exibir notificação de sucesso', () => {
      sucesso('Operação realizada com sucesso');
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Operação realizada com sucesso',
        duration: 6,
        className: 'alerta-sucesso',
      });
    });

    it('deve exibir notificação de erro', () => {
      erro('Erro crítico ocorreu');
      expect(notification.error).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Erro crítico ocorreu',
        duration: 6,
        className: 'alerta-erro',
      });
    });

    it('deve exibir notificação de aviso', () => {
      aviso('Atenção necessária');
      expect(notification.warning).toHaveBeenCalledWith({
        message: 'Aviso',
        description: 'Atenção necessária',
        duration: 6,
        className: 'alerta-aviso',
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve exibir múltiplos erros da resposta', () => {
      const errorResponse = {
        response: {
          data: {
            mensagens: ['Erro 1', 'Erro 2'],
          },
        },
      };
      erros(errorResponse);
      expect(notification.error).toHaveBeenCalledTimes(2);
    });

    it('deve exibir erro genérico para erros sem estrutura', () => {
      erros({});
      expect(notification.error).toHaveBeenCalledWith({
        message: 'Erro',
        description: 'Ocorreu um erro interno.',
        duration: 6,
        className: 'alerta-erro',
      });
    });

    it('não deve exibir alertas quando usuário não está logado', () => {
      store.getState.mockReturnValue({ usuario: { logado: false } });
      erros({ response: { data: { mensagens: ['Erro'] } } });
      expect(notification.error).not.toHaveBeenCalled();
    });

    it('deve ignorar erros de token expirado', () => {
      const error = { message: TOKEN_EXPIRADO };
      erros(error);
      expect(notification.error).not.toHaveBeenCalled();
    });
  });

  describe('Confirmações', () => {
    it('deve exibir modal de confirmação padrão', () => {
      confirmacao('Confirmar ação', 'Deseja continuar?', jest.fn(), jest.fn());

      expect(Modal.confirm).toHaveBeenCalledWith({
        title: 'Confirmar ação',
        content: 'Deseja continuar?',
        okText: 'Confirmar',
        okType: 'primary',
        cancelText: 'Cancelar',
        onOk: expect.any(Function),
        onCancel: expect.any(Function),
      });
    });
  });
});
