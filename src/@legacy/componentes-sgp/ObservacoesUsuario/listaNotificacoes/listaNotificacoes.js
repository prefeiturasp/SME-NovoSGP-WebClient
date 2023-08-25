import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Container } from './listaNotificacoes.css';

const ListaNotificacoes = ({ obs, somenteLeitura }) => {

const [usuariosNotificacao, setUsuariosNotificacao] = useState();

  useEffect(() => {
    if (!usuariosNotificacao && obs.usuarios) {
      setUsuariosNotificacao(obs.usuarios);
    }

  }, [usuariosNotificacao, obs.usuarios]);

  return (
    <>
      {obs?.usuarios?.length ? (
        <Container
          temLinhaAlteradoPor={obs?.auditoria?.alteradoPor}
          listagemDiario={obs?.listagemDiario}
          somenteLeitura={somenteLeitura}
        >
       <span> 
          {usuariosNotificacao ? (
            `Usuários notificados: ${usuariosNotificacao.map(usuario => usuario.nome).join(", ")}`
          ) : (
            ""
          )}
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
