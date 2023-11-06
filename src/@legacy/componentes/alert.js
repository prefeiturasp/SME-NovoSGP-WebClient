import React from 'react';
import { useDispatch } from 'react-redux';
import { SGP_BUTTON_FECHAR_ALERTA } from '~/constantes/ids/button';
import { removerAlerta } from '../redux/modulos/alertas/actions';
import { MessageClick } from './alert.css';

const Alert = props => {
  const { tipo, id, mensagem, estiloTitulo, mensagemClick, marginBottom } =
    props.alerta;
  const { closable, className, onClickMessage } = props;

  const dispatch = useDispatch();
  return (
    <div
      className={`alert alert-${tipo} alert-dismissible fade show text-center ${className}`}
      role="alert"
      style={marginBottom ? { marginBottom } : {}}
    >
      <b style={estiloTitulo || { fontSize: '18px' }}>
        {mensagem}
        <MessageClick onClick={onClickMessage}>{mensagemClick}</MessageClick>
      </b>
      {closable ? (
        <button
          id={SGP_BUTTON_FECHAR_ALERTA}
          type="button"
          className="close"
          onClick={() => dispatch(removerAlerta(id))}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default Alert;
