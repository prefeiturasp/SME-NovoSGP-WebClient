/* eslint-disable */
import React, { useState } from 'react';
import { MaisMenos } from './fechamento-bimestre-lista.css';

const BotaoExpandir = props => {
  const { refElement } = props;
  const [expandido, setExpandido] = useState(false);

  const clickExpandirRetrair = () => {
    setExpandido(!expandido);
    if (refElement) {
      refElement.current.style.display =
        refElement.current.style.display === 'none' ? 'contents' : 'none';
    }
  };

  return (
    <a onClick={() => clickExpandirRetrair()}>
      {expandido ? (
        <MaisMenos className="fas fa-minus-circle" />
      ) : (
        <MaisMenos className="fas fa-plus-circle" />
      )}
    </a>
  );
};

export default BotaoExpandir;
