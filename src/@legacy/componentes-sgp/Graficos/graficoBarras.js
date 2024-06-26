import PropTypes from 'prop-types';
import { Column } from '@ant-design/plots';
import React from 'react';
import { Base, CoresGraficos } from '~/componentes/colors';

const GraficoBarras = props => {
  const {
    data,
    xAxisVisible,
    legendVisible,
    isGroup,
    xField,
    yField,
    seriesField,
    colors,
    labelVisible,
    radius,
    showTitle,
    showScrollbar,
    ...rest
  } = props;

  const scrollConfig =
    showScrollbar || (window.innerWidth <= 960 && data?.length > 1)
      ? {
          type: 'horizontal',
        }
      : null;

  const config = {
    ...rest,
    data,
    isGroup,
    xField,
    yField,
    seriesField,
    scrollbar: scrollConfig,
    columnStyle: {
      radius,
    },
    xAxis: {
      visible: xAxisVisible,
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
          offset: 0,
          style: {
            fill: Base.CinzaMako,
            textAlign: 'center',
            fontSize: 8.5,
            fontWeight: 600,
          },
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
            style: {
              y: 5,
              r: 6,
            },
          },
        }
      : false,
    tooltip: {
      showTitle,
      domStyles: {
        'g2-tooltip-list': {
          textAlign: 'left',
        },
      },
    },
    appendPadding: [20, 0, 20, 0],
    color: colors?.length ? colors : CoresGraficos,
  };

  return data?.length ? <Column {...config} /> : '';
};

GraficoBarras.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]),
  xAxisVisible: PropTypes.bool,
  legendVisible: PropTypes.bool,
  isGroup: PropTypes.bool,
  xField: PropTypes.string,
  yField: PropTypes.string,
  seriesField: PropTypes.string,
  colors: PropTypes.oneOfType([PropTypes.array]),
  labelVisible: PropTypes.bool,
  radius: PropTypes.oneOfType([PropTypes.array]),
  showTitle: PropTypes.bool,
  showScrollbar: PropTypes.bool,
};

GraficoBarras.defaultProps = {
  data: [],
  xAxisVisible: false,
  legendVisible: true,
  isGroup: false,
  xField: 'descricao',
  yField: 'quantidade',
  seriesField: 'descricao',
  colors: [],
  labelVisible: true,
  radius: [4, 4, 0, 0],
  showTitle: false,
  showScrollbar: false,
};

export default GraficoBarras;
