import { Modal, notification } from 'antd';
import { CANCELADO_USUARIO, TOKEN_EXPIRADO } from '~/constantes';
import { store } from '../redux';
import {
  alertaConfirmar,
  alertaFechar,
} from '../redux/modulos/alertas/actions';

const { confirm } = Modal;

const exibirAlerta = (tipo, mensagem) => {
  let titulo;
  let classeTipo;
  switch (tipo) {
    case 'success':
      titulo = 'Sucesso';
      classeTipo = 'alerta-sucesso';
      break;
    case 'error':
      titulo = 'Erro';
      classeTipo = 'alerta-erro';
      break;
    case 'warning':
      titulo = 'Aviso';
      classeTipo = 'alerta-aviso';
      break;

    default:
      titulo = '';
      classeTipo = '';
      break;
  }
  notification[tipo]({
    message: titulo,
    description: mensagem,
    duration: 6,
    className: classeTipo,
  });
};

const sucesso = mensagem => {
  exibirAlerta('success', mensagem);
};

const erro = (mensagem, ehInformativo = false) => {
  exibirAlerta(ehInformativo ? 'warning' : 'error', mensagem);
};

const aviso = mensagem => {
  exibirAlerta('warning', mensagem);
};

const acharErro = (dados, resposta) => {
  return dados?.indexOf(resposta) >= 0;
};

const erros = listaErros => {
  const temErroIgual =
    acharErro(listaErros?.message, TOKEN_EXPIRADO) ||
    acharErro(listaErros?.message, CANCELADO_USUARIO);
  const state = store.getState();

  if (!state?.usuario?.logado || temErroIgual) return;
  if (listaErros?.response?.data?.mensagens) {
    listaErros.response.data.mensagens.forEach(mensagem => erro(mensagem));
    return;
  }
  erro('Ocorreu um erro interno.');
};

const confirmacao = (
  titulo,
  texto,
  confirmar,
  cancelar,
  okText,
  okType,
  cancelText
) => {
  confirm({
    title: titulo,
    content: texto,
    okText: okText || 'Confirmar',
    okType: okType || 'primary',
    cancelText: cancelText || 'Cancelar',
    onOk() {
      confirmar();
    },
    onCancel() {
      cancelar();
    },
  });
};

const confirmar = (
  titulo,
  texto,
  textoNegrito,
  textoOk,
  textoCancelar,
  primeiroExibirTextoNegrito
) => {
  return new Promise((resolve, _) => {
    store.dispatch(
      alertaConfirmar(
        titulo,
        texto,
        textoNegrito,
        resolve,
        textoOk,
        textoCancelar,
        primeiroExibirTextoNegrito
      )
    );
  });
};

const fecharModalConfirmacao = () => {
  store.dispatch(alertaFechar());
};

export {
  exibirAlerta,
  sucesso,
  erro,
  confirmacao,
  confirmar,
  fecharModalConfirmacao,
  erros,
  aviso,
};
