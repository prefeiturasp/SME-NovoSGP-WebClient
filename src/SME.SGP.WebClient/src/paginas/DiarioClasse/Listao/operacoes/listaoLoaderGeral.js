import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Loader } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

const ListaoLoaderGeral = ({ children }) => {
  const { exibirLoaderGeral } = useContext(ListaoContext);

  return <Loader loading={exibirLoaderGeral}>{children}</Loader>;
};

ListaoLoaderGeral.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node]),
};

ListaoLoaderGeral.defaultProps = {
  children: <></>,
};

export default ListaoLoaderGeral;
