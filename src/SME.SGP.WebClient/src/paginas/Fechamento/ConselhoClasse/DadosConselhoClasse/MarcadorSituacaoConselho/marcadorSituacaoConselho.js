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
            <p>
              <span>Situação do conselho:</span> {situacaoConselho}
            </p>
          </Situacao>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default MarcadorSituacaoConselho;
