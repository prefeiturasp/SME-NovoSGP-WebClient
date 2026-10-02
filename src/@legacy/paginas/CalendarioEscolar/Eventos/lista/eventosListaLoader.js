import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import EventosListaContext from './eventosListaContext';

import comDefaultProps from '~/utils/comDefaultProps';
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

export default comDefaultProps(EventosListaLoader, EventosListaLoader.defaultProps);