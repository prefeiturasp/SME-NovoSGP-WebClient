import React from 'react';
import { useSelector } from 'react-redux';

const Versao = () => {
  const { versao } = useSelector(store => store.sistema);

  return (
    <>
      {!versao ? '' : <strong>{versao}&nbsp;</strong>} - Sistema homologado para
      navegadores: Google Chrome e Firefox
    </>
  );
};

export default Versao;
