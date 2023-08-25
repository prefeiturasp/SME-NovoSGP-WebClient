import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Container } from './listaNotificacoes.css';

const ListaNotificacoes = ({ obs, somenteLeitura }) => {

  return (
    <>
      {obs?.usuarios?.length ? (
        <Container
          temLinhaAlteradoPor={obs?.auditoria?.alteradoPor}
          listagemDiario={obs?.listagemDiario}
          somenteLeitura={somenteLeitura}
        >
        <span style={{ whiteSpace: 'pre-line' }}>Usuários notificados:
            {obs.usuarios.map(usuario => usuario.nome).join(' / ')}
        </span>
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
