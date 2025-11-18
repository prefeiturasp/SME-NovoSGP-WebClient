import { useAppSelector } from '@/core/hooks/use-redux';
import React, { PropsWithChildren } from 'react';
import { Loader } from '~/componentes';

const LoaderBuscaAtivaRegistroAcoesForm: React.FC<PropsWithChildren> = ({ children }) => {
  const exibirLoaderBuscaAtivaRegistroAcoes = useAppSelector(
    (store) => store.buscaAtivaRegistroAcoes.exibirLoaderBuscaAtivaRegistroAcoes,
  );

  return <Loader loading={exibirLoaderBuscaAtivaRegistroAcoes}>{children}</Loader>;
};

export default LoaderBuscaAtivaRegistroAcoesForm;
