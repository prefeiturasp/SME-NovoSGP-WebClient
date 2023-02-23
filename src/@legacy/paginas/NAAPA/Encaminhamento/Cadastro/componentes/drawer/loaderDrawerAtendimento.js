import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

const LoaderDrawerAtendimento = ({ children }) => {
  const exibirLoaderDrawerAtendimento = useSelector(
    store => store.encaminhamentoNAAPA.exibirLoaderDrawerAtendimento
  );

  return <Loader loading={exibirLoaderDrawerAtendimento}>{children}</Loader>;
};

LoaderDrawerAtendimento.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

LoaderDrawerAtendimento.defaultProps = {
  children: () => {},
};

export default LoaderDrawerAtendimento;
