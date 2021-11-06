import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import FechaReabListaContext from './fechaReabListaContext';

const FechaReabListaLoader = props => {
  const { children } = props;
  const { exibirLoaderLista } = useContext(FechaReabListaContext);

  return (
    <Loader loading={exibirLoaderLista} ignorarTip>
      {children}
    </Loader>
  );
};

FechaReabListaLoader.propTypes = {
  children: PropTypes.node,
};

FechaReabListaLoader.defaultProps = {
  children: () => {},
};

export default FechaReabListaLoader;
