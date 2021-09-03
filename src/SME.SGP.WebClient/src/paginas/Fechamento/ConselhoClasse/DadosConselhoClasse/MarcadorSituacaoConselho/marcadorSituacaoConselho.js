import { useSelector } from 'react-redux';
import React from 'react';
import { Situacao } from './marcadorSituacaoConselho.css';

const MarcadorSituacaoConselho = () => {
  const situacaoConselho = useSelector(
    store => store.conselhoClasse.situacaoConselho
  );

  return (
    <>
      {situacaoConselho ? (
        <div className="col-m-12 position-absolute mb-2 ml-3">
          <Situacao>
            <span>Situação do conselho: {situacaoConselho}</span>
          </Situacao>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default MarcadorSituacaoConselho;
