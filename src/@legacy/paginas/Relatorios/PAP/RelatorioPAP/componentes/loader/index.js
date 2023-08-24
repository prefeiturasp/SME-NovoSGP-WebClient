import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';

const LoaderRelatorioPAP = ({ children }) => {
  const exibirLoaderRelatorioPAP = useSelector(
    store => store.relatorioPAP.exibirLoaderRelatorioPAP
  );

  return <Loader loading={exibirLoaderRelatorioPAP}>{children}</Loader>;
};

export default LoaderRelatorioPAP;
