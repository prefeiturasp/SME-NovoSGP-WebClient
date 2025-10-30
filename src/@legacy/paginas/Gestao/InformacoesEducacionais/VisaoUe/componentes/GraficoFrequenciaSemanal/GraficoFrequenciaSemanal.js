import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from '@ant-design/plots';
import ServicoFrequenciaGrafico from '~/servicos/InformacoesEducacionais/ServicoFrequenciaGrafico';

const GraficoFrequenciaSemanal = ({
  ueCodigo,
  anoLetivo,
  xField = 'dataAula',
  yField = 'percentualFrequencia',
  color = '#2E58D9',
  legendVisible = true,
  tooltip,
  xAxisTitle = '',
  xAxisTitleColor = '',
  xAxisLabelColor = '',
  ...rest
}) => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = {
    data: dados,
    xField,
    yField,
    color,
    point: {
      size: 10.34,
      shape: 'circle',
      style: {
        fill: color,
        stroke: color,
        lineWidth: 0,
        radius: 50,
      },
    },
    lineStyle: {
      stroke: '#42474A',
      lineWidth: 1,
      lineDash: [13, 13],
    },
    legend: legendVisible ? { position: 'bottom' } : false,
    tooltip: false,
    xAxis: {
      title: xAxisTitle
        ? { text: xAxisTitle, style: { fill: xAxisTitleColor } }
        : undefined,
      label: {
        formatter: value => {
          const [dia, mes] = value.split('/');
          return `${dia}/${mes}`;
        },
        style: {
          fill: '#42474A',
          fontSize: 14,
          fontWeight: 'bold',
          lineHeight: 1.2,
        },
        offset: 20,
      },
    },
    yAxis: {
      label: {
        formatter: value => `${value}%`,
        style: {
          fill: '#42474A',
          fontFamily: 'Roboto',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.2,
        },
      },
      min: 0,
      max: 100,
      tickInterval: 10,
    },
    appendPadding: [20, 0, 20, 0],
    ...rest,
  };

  const buscarDados = useCallback(async () => {
    if (!ueCodigo || !anoLetivo) {
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoFrequenciaGrafico.obterFrequenciaGrafico(
        ueCodigo,
        anoLetivo
      );

      if (resposta.status === 200 && Array.isArray(resposta.data)) {
        const dadosFormatados = resposta.data.map(item => ({
          dataAula: item.dataAula,
          percentualFrequencia: Math.min(item.percentualFrequencia, 100),
        }));
        setDados(dadosFormatados);
      } else {
        setDados([]);
      }
    } catch (error) {
      const msg =
        error.response?.data?.mensagens?.join(', ') ||
        'Erro ao carregar dados de frequência';
      console.error(msg);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [ueCodigo, anoLetivo]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  return dados.length ? <Line {...config} /> : <p>Sem dados disponíveis</p>;
};

GraficoFrequenciaSemanal.propTypes = {
  ueCodigo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  xField: PropTypes.string,
  yField: PropTypes.string,
  color: PropTypes.string,
  legendVisible: PropTypes.bool,
  tooltip: PropTypes.object,
  xAxisTitle: PropTypes.string,
  xAxisTitleColor: PropTypes.string,
  xAxisLabelColor: PropTypes.string,
};

GraficoFrequenciaSemanal.defaultProps = {
  ueCodigo: null,
  anoLetivo: null,
  xField: 'dataAula',
  yField: 'percentualFrequencia',
  color: '#2E58D9',
  legendVisible: true,
  tooltip: null,
  xAxisTitle: '',
  xAxisTitleColor: '#42474a',
  xAxisLabelColor: '#42474a',
};

export default GraficoFrequenciaSemanal;
