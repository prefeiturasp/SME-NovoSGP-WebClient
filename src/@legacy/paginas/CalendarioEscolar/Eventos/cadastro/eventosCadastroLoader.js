import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import EventosCadastroContext from './eventosCadastroContext';

const EventosCadastroLoader = props => {
  const { children } = props;
  const { exibirLoaderSalvar } = useContext(EventosCadastroContext);

  return (
    <Loader loading={exibirLoaderSalvar} ignorarTip>
      {children}
    </Loader>
  );
};

EventosCadastroLoader.propTypes = {
  children: PropTypes.node,
};

EventosCadastroLoader.defaultProps = {
  children: () => {},
};

export default EventosCadastroLoader;
