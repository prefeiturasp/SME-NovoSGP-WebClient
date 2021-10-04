import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import EventosListaContext from './eventosListaContext';

const EventosListaLoader = props => {
  const { children } = props;
  const { exibirLoaderListaEventos } = useContext(EventosListaContext);

  return (
    <Loader loading={exibirLoaderListaEventos} ignorarTip>
      {children}
    </Loader>
  );
};

EventosListaLoader.propTypes = {
  children: PropTypes.node,
};

EventosListaLoader.defaultProps = {
  children: () => {},
};

export default EventosListaLoader;
