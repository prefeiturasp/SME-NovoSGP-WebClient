import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

import comDefaultProps from '~/utils/comDefaultProps';
const LoaderAcompanhamentoAprendizagem = ({ children }) => {
  const exibirLoaderGeralAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .exibirLoaderGeralAcompanhamentoAprendizagem
  );
  const exibirLoaderAlunosAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .exibirLoaderAlunosAcompanhamentoAprendizagem
  );

  return (
    <Loader
      loading={
        exibirLoaderGeralAcompanhamentoAprendizagem ||
        exibirLoaderAlunosAcompanhamentoAprendizagem
      }
    >
      {children}
    </Loader>
  );
};

LoaderAcompanhamentoAprendizagem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
};

LoaderAcompanhamentoAprendizagem.defaultProps = {
  children: () => {},
};

export default comDefaultProps(LoaderAcompanhamentoAprendizagem, LoaderAcompanhamentoAprendizagem.defaultProps);