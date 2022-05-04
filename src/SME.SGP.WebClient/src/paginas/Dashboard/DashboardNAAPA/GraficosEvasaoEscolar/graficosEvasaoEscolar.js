import React from 'react';
import QuantidadeFrequenciaInferior from './QuantidadeFrequenciaInferior/quantidadeFrequenciaInferior';
import QuantidadeNaoFrequentaramUE from './QuantidadeNaoFrequentaramUE/quantidadeNaoFrequentaramUE';

const GraficosEvasaoEscolar = () => {
  return (
    <>
      <QuantidadeFrequenciaInferior />
      <QuantidadeNaoFrequentaramUE />
    </>
  );
};

export default GraficosEvasaoEscolar;
