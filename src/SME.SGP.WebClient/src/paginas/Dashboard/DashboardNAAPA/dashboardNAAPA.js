import React from 'react';
import DashboardNAAPAFiltros from './dashboardNAAPAFiltros';
import NAAPAContextProvider from './naapaContextProvider';

const DashboardNAAPA = () => {
  return (
    <NAAPAContextProvider>
      <DashboardNAAPAFiltros />
    </NAAPAContextProvider>
  );
};

export default DashboardNAAPA;
