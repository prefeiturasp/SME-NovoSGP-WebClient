import React from 'react';
import DashboardNAAPAConteudo from './dashboardNAAPAConteudo';
import NAAPAContextProvider from './naapaContextProvider';

const DashboardNAAPA = () => {
  return (
    <NAAPAContextProvider>
      <DashboardNAAPAConteudo />
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
