import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import {gerarMockAnual, gerarMockMensal} from './graficoFrequenciaModalidadeMock';

const coresPadrao = ['#1976D2', '#512DA8', '#00897B', '#FB8C00', '#C2185B'];

const GraficoFrequenciaModalidade = ({ dreId, periodicidade }) => {
  const [dados, setDados] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dataAtual] = useState(moment().format('DD/MM/YYYY'));

  const carregar = useCallback(async () => {
    if (!dreId) {
      setDados([]);
      return;
    }
    setExibirLoader(true);
    try {
      // Simula atraso
      await new Promise(r => setTimeout(r, 300));
      const mensalLongo = gerarMockMensal();
      if (periodicidade === 'mensal') {
        setDados(mensalLongo);
      } else {
        setDados(gerarMockAnual(mensalLongo));
      }
    } finally {
      setExibirLoader(false);
    }
  }, [dreId, periodicidade]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const ehMensal = periodicidade === 'mensal';
  const titulo = 'Frequência';

  return (
    <Loader loading={exibirLoader} className={exibirLoader ? 'text-center' : ''}>
      <div className="mb-3">
        <h5 className="mb-2" style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          {titulo}
          </h5>
      </div>
      {dados?.length ? (
        <GraficoBarras
          data={dados}
          isGroup={ehMensal ? true : false} //false para continuar mostrando apenas uma barra por categoria.
          xField={ehMensal ? 'mes' : 'modalidade'}
          yField="valor"
          seriesField="modalidade" /* força coloração por modalidade também no anual */
          colors={coresPadrao}
          xAxisVisible
          legendVisible={ehMensal} /* ocultamos legenda no anual para não duplicar labels */
          labelVisible
          tooltip={{
            formatter: (datum) => ({
              name: datum.modalidade,
              value: `${datum.valor}%`,
            }),
          }}
        />
      ) : !exibirLoader ? (
        <div className="text-center">Sem dados</div>
      ) : null}
    </Loader>
  );
};

GraficoFrequenciaModalidade.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  periodicidade: PropTypes.string,
};

GraficoFrequenciaModalidade.defaultProps = {
  dreId: null,
  periodicidade: 'mensal',
};

export default GraficoFrequenciaModalidade;
