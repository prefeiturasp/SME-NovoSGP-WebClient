import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Container } from './listaNotificacoes.css';

const ListaNotificacoes = ({ obs, somenteLeitura }) => {
  const [usuariosNotificacao, setUsuariosNotificacao] = useState();

  useEffect(() => {
    if (!usuariosNotificacao && obs.usuariosNotificacao) {
      setUsuariosNotificacao(obs.usuariosNotificacao);
    }
  }, [usuariosNotificacao, obs.usuariosNotificacao]);

  return (
    <>
      {obs?.usuariosNotificacao?.length ? (
        <Container
          temLinhaAlteradoPor={obs?.auditoria?.alteradoPor}
          listagemDiario={obs?.listagemDiario}
          somenteLeitura={somenteLeitura}
        >
          <span>{`Usuários notificados: ${usuariosNotificacao}`}</span>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
};

ListaNotificacoes.propTypes = {
  obs: PropTypes.oneOfType([PropTypes.object]),
  somenteLeitura: PropTypes.bool,
};

ListaNotificacoes.defaultProps = {
  obs: {},
  somenteLeitura: false,
};

export default ListaNotificacoes;
