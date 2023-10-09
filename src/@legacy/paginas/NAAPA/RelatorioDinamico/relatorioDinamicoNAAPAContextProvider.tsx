import React, { PropsWithChildren, useState } from 'react';
import RelatorioDinamicoNAAPAContext from './relatorioDinamicoNAAPAContext';

const RelatorioDinamicoNAAPAContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [dataSource, setDataSource] = useState([]);

  return (
    <RelatorioDinamicoNAAPAContext.Provider
      value={{
        dataSource,
        setDataSource,
      }}
    >
      {children}
    </RelatorioDinamicoNAAPAContext.Provider>
  );
};

export default RelatorioDinamicoNAAPAContextProvider;
