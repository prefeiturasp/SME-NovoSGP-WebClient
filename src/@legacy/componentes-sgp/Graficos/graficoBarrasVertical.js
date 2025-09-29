import PropTypes from 'prop-types';
import { Column } from '@ant-design/plots';
import { Base, CoresGraficos } from '~/componentes/colors';

const GraficoBarrasVertical = props => {
  const {
    data,
    xField,
    yField,
    xAxisVisible,
    legendVisible,
    labelVisible,
    colors,
    radius,
    showTitle,
    showScrollbar,
    xAxisTitle,
    yAxisTitle,
    ...rest
  } = props;

  const scrollConfig =
    showScrollbar || (window.innerWidth <= 960 && data?.length > 1)
      ? { type: 'horizontal' }
      : null;

  const config = {
    ...rest,
    data,
    xField,
    yField,
    scrollbar: scrollConfig,
    columnStyle: { radius },
    xAxis: {
      visible: xAxisVisible,
      label: {
        style: {
          fontWeight: 'bold',
          fontSize: 12,
          fill: Base.CinzaMako,
        },
      },
      title: xAxisTitle
        ? {
            text: xAxisTitle,
            style: { fontWeight: 'bold', fill: Base.CinzaMako },
          }
        : undefined,
    },
    yAxis: {
      title: yAxisTitle
        ? {
            text: yAxisTitle,
            style: { fontWeight: 'bold', fill: Base.CinzaMako },
          }
        : undefined,
      label: {
        style: {
          fontWeight: 'bold',
          fontSize: 12,
          fill: Base.CinzaMako,
        },
      },
    },
    label: labelVisible
      ? {
          position: 'top',
          offset: 2,
          style: {
            fill: Base.CinzaMako,
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 600,
          },
          formatter: d => (d[yField] !== undefined ? `${d[yField]}` : ''),
        }
      : null,
    legend: legendVisible
      ? {
          position: 'bottom',
          flipPage: false,
          itemWidth: 180,
          itemName: {
            style: {
              fontWeight: 'bold',
              fontSize: 12,
              fill: Base.CinzaMako,
            },
          },
          marker: {
            symbol: 'circle',
            style: { y: 5, r: 6 },
          },
        }
      : false,
    tooltip: {
      showTitle,
      domStyles: {
        'g2-tooltip-list': { textAlign: 'left' },
      },
      formatter: datum => {
        const total = data.reduce((acc, cur) => acc + cur.quantidade, 0);
        const percentual = total ? (datum.quantidade / total) * 100 : 0;

        return {
          name: datum.descricao,
          value: `${
            datum.quantidade?.toLocaleString?.() || 0
          } alunos (${percentual.toFixed(1)}%)`,
        };
      },
    },

    appendPadding: [20, 0, 20, 0],
    color: colors?.length ? colors : CoresGraficos,
  };

  return data?.length ? <Column {...config} /> : null;
};

GraficoBarrasVertical.propTypes = {
  data: PropTypes.array.isRequired,
  xField: PropTypes.string,
  yField: PropTypes.string,
  xAxisVisible: PropTypes.bool,
  legendVisible: PropTypes.bool,
  labelVisible: PropTypes.bool,
  colors: PropTypes.array,
  radius: PropTypes.oneOfType([PropTypes.array]),
  showTitle: PropTypes.bool,
  showScrollbar: PropTypes.bool,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
};

GraficoBarrasVertical.defaultProps = {
  xField: 'descricao',
  yField: 'quantidade',
  xAxisVisible: true,
  legendVisible: true,
  labelVisible: true,
  colors: [],
  radius: [4, 4, 0, 0],
  showTitle: false,
  showScrollbar: false,
  xAxisTitle: '',
  yAxisTitle: '',
};

export default GraficoBarrasVertical;
