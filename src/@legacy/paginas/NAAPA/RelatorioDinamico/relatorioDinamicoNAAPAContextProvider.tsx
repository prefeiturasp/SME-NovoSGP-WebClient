import React, { PropsWithChildren, useState } from 'react';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';

const RelatorioDinamicoNAAPAContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [dataSource, setDataSource] = useState([]);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(false);
  const [listaSecoesParaDesabilitar, setListaSecoesParaDesabilitar] = useState([]);

  const inicial = {
    modoEdicao: false,
    consideraHistorico: false,
    anoLetivo: undefined,
    dreCodigo: undefined,
    listaDres: [],
    ueCodigo: undefined,
    listaUes: [],
    modalidade: undefined,
    listaModalidades: [],
    semestre: undefined,
    listaSemestres: [],
    anosEscolaresCodigos: undefined,
    listaAnosEscolares: [],
    listaSecoesParaDesabilitar: [],
  };

  const [initialValues] = useState(inicial);

  return (
    <RelatorioDinamicoNAAPAContext.Provider
      value={{
        dataSource,
        setDataSource,
        gerandoRelatorio,
        setGerandoRelatorio,
        desabilitarGerar,
        setDesabilitarGerar,
        initialValues,
        setListaSecoesParaDesabilitar,
        listaSecoesParaDesabilitar,
      }}
    >
      {children}
    </RelatorioDinamicoNAAPAContext.Provider>
  );
};

export default RelatorioDinamicoNAAPAContextProvider;
