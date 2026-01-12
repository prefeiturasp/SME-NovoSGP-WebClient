import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

const LoaderEncaminhamentoNAAPA = ({ children }) => {
  const exibirLoaderEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.exibirLoaderEncaminhamentoNAAPA
  );

  return <Loader loading={exibirLoaderEncaminhamentoNAAPA}>{children}</Loader>;
};

LoaderEncaminhamentoNAAPA.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

LoaderEncaminhamentoNAAPA.defaultProps = {
  children: () => {},
};

export default LoaderEncaminhamentoNAAPA;
