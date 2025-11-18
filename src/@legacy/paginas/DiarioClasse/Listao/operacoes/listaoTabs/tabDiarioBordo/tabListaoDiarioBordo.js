import React from 'react';

import TabListaoDiarioBordoFiltros from './tabListaoDiarioBordoFiltros';
import TabListaoDiarioBordoCollapses from './tabListaoDiarioBordoCollapses';
import ModalErrosDiarioBordoListao from './modalErrosDiarioBordoListao';

const TabListaoDiarioBordo = () => {
  return (
    <>
      <TabListaoDiarioBordoFiltros />
      <TabListaoDiarioBordoCollapses />
      <ModalErrosDiarioBordoListao />
    </>
  );
};

export default TabListaoDiarioBordo;
