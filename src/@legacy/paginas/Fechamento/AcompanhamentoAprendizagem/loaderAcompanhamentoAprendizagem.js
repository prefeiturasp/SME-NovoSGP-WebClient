import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

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
  const exibirLoaderAtualizandoUrlImagensRAA = useSelector(
    store =>
      store.acompanhamentoAprendizagem?.exibirLoaderAtualizandoUrlImagensRAA
  );

  let tip = 'Carregando...';

  if (exibirLoaderAtualizandoUrlImagensRAA) {
    tip =
      'Estamos realizando alguns ajustes nas imagens, aguarde um momento e não feche ou atualize a página!';
  }

  return (
    <Loader
      tip={tip}
      loading={
        exibirLoaderGeralAcompanhamentoAprendizagem ||
        exibirLoaderAlunosAcompanhamentoAprendizagem ||
        exibirLoaderAtualizandoUrlImagensRAA
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

export default LoaderAcompanhamentoAprendizagem;
