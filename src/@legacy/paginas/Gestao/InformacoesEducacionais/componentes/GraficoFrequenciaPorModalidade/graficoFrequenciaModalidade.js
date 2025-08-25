import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';

// Componente de gráfico de frequência por modalidade (mock)
// Regras: 
//  - Periodicidade 'mensal': mostrar 5 barras por mês (Fundamental, Médio, CIEJA, Infantil - Creche, Infantil - Pré-escola)
//  - Considerar meses de Janeiro até o mês corrente do ano atual
//  - Periodicidade 'anual': consolidado (uma barra por modalidade)

const NOMES_MODALIDADES = [
  'Fundamental',
  'Médio',
  'CIEJA',
  'Infantil - Creche',
  'Infantil - Pré-escola',
];

const coresPadrao = ['#1976D2', '#512DA8', '#00897B', '#FB8C00', '#C2185B'];

const gerarMockMensal = () => {
  const agora = moment();
  const ano = agora.year();
  const mesAtual = agora.month(); // 0-11
  const baseValores = {
    'Fundamental': 92,
    'Médio': 89,
    'CIEJA': 85,
    'Infantil - Creche': 90,
    'Infantil - Pré-escola': 88,
  };
  const dadosLongos = [];
  for (let m = 0; m <= mesAtual; m += 1) {
    const nomeMes = moment(`${ano}-${m + 1}-01`).format('MMMM'); // nome do mês capitalizado pela locale
    NOMES_MODALIDADES.forEach(mod => {
      const variacao = (Math.sin((m + 1) * 1.3 + mod.length) * 1.2) + (mod.length % 3) * 0.4;
      const valor = Math.min(100, Math.max(75, baseValores[mod] + variacao));
      dadosLongos.push({
        mes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
        modalidade: mod,
        valor: Number(valor.toFixed(1)),
      });
    });
  }
  return dadosLongos;
};

const gerarMockAnual = (dadosMensais) => {
  const agrupado = {};
  dadosMensais.forEach(r => {
    agrupado[r.modalidade] = agrupado[r.modalidade] || { soma: 0, qtd: 0 };
    agrupado[r.modalidade].soma += r.valor;
    agrupado[r.modalidade].qtd += 1;
  });
  return Object.keys(agrupado).map(mod => ({
    modalidade: mod,
    valor: Number((agrupado[mod].soma / agrupado[mod].qtd).toFixed(1)),
  }));
};

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

  // const titulo = ehMensal
  //   ? 'Frequência por Modalidade (Mensal - Ano Atual)'
  //   : 'Frequência por Modalidade (Consolidado Anual)';

  const titulo = 'Frequência'

  return (
    <Loader loading={exibirLoader} className={exibirLoader ? 'text-center' : ''}>
      <div className="mb-3">
        <h5 className="mb-2" style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          {titulo}
          </h5>
        {/* <TagGrafico valor={`Dados mock até: ${dataAtual}`} /> */}
      </div>
      {dados?.length ? (
        <GraficoBarras
          data={dados}
          isGroup={ehMensal}
          xField={ehMensal ? 'mes' : 'modalidade'}
          yField="valor"
          seriesField={ehMensal ? 'modalidade' : 'modalidade'}
          colors={coresPadrao}
          xAxisVisible
          legendVisible
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
