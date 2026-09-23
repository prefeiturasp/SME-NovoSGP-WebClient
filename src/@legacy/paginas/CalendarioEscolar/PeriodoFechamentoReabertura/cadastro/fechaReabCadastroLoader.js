import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import FechaReabCadastroContext from './fechaReabCadastroContext';

import comDefaultProps from '~/utils/comDefaultProps';
const FechaReabCadastroLoader = props => {
  const { children } = props;
  const { exibirLoaderReabertura } = useContext(FechaReabCadastroContext);

  return (
    <Loader loading={exibirLoaderReabertura} ignorarTip>
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

export default comDefaultProps(FechaReabCadastroLoader, FechaReabCadastroLoader.defaultProps);