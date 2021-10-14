import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import FechaReabCadastroContext from './fechaReabCadastroContext';

const FechaReabCadastroLoader = props => {
  const { children } = props;
  const { exibirLoaderSalvar } = useContext(FechaReabCadastroContext);

  return (
    <Loader loading={exibirLoaderSalvar} ignorarTip>
      {children}
    </Loader>
  );
};

FechaReabCadastroLoader.propTypes = {
  children: PropTypes.node,
};

FechaReabCadastroLoader.defaultProps = {
  children: () => {},
};

export default FechaReabCadastroLoader;
