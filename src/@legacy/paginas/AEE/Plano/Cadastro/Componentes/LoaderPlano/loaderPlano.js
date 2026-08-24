import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

import comDefaultProps from '~/utils/comDefaultProps';
const LoaderPlano = props => {
  const { children } = props;
  const exibirLoaderPlanoAEE = useSelector(
    store => store.planoAEE.exibirLoaderPlanoAEE
  );

  return <Loader loading={exibirLoaderPlanoAEE}>{children}</Loader>;
};

LoaderPlano.propTypes = {
  children: PropTypes.node,
};

LoaderPlano.defaultProps = {
  children: () => {},
};

export default comDefaultProps(LoaderPlano, LoaderPlano.defaultProps);