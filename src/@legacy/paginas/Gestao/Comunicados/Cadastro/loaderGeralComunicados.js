import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

const LoaderGeralComunicados = props => {
  const { children } = props;
  const exibirLoaderGeralComunicados = useSelector(
    store => store.comunicados.exibirLoaderGeralComunicados
  );

  return (
    <Loader loading={exibirLoaderGeralComunicados} ignorarTip>
      {children}
    </Loader>
  );
};

LoaderGeralComunicados.propTypes = {
  children: PropTypes.node,
};

LoaderGeralComunicados.defaultProps = {
  children: () => {},
};

export default LoaderGeralComunicados;
