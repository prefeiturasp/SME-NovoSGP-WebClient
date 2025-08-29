import { useAppSelector } from '@/core/hooks/use-redux';
import React, { PropsWithChildren } from 'react';
import { Loader } from '~/componentes';

export const LoaderMapeamentoEstudantes: React.FC<PropsWithChildren> = ({ children }) => {
  const exibirLoaderMapeamentoEstudantes = useAppSelector(
    (store) => store.mapeamentoEstudantes?.exibirLoaderMapeamentoEstudantes,
  );

  return <Loader loading={exibirLoaderMapeamentoEstudantes}>{children}</Loader>;
};
