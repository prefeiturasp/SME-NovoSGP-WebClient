import PropTypes from 'prop-types';
import { Bar } from '@ant-design/plots';
import { Base, CoresGraficos } from '~/componentes/colors';

const GraficoBarrasHorizontal = ({
  data = [],
  xAxisVisible = false,
  legendVisible = true,
  isGroup = false,
  xField = 'quantidade',
  yField = 'descricao',
  seriesField = 'descricao',
  colors = [],
  labelVisible = true,
  radius = [4, 4, 0, 0],
  showTitle = false,
  showScrollbar = false,
  tooltip,
  ...rest
}) => {
  const scrollConfig =
    showScrollbar || (window.innerWidth <= 960 && data?.length > 1)
      ? { type: 'horizontal' }
      : null;

  const defaultTooltip = {
    showTitle,
    domStyles: {
      'g2-tooltip-list': {
        textAlign: 'left',
      },
    },
  };

  const config = {
    ...rest,
    data,
    isGroup,
    xField,
    yField,
    seriesField,
    scrollbar: scrollConfig,
    barStyle: { radius },
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
          position: 'right',
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
    tooltip: tooltip ? { ...defaultTooltip, ...tooltip } : defaultTooltip,
    appendPadding: [20, 0, 20, 0],
    color: colors?.length ? colors : CoresGraficos,
  };

  return data?.length ? <Bar {...config} /> : null;
};

GraficoBarrasHorizontal.propTypes = {
  data: PropTypes.array,
  xAxisVisible: PropTypes.bool,
  legendVisible: PropTypes.bool,
  isGroup: PropTypes.bool,
  xField: PropTypes.string,
  yField: PropTypes.string,
  seriesField: PropTypes.string,
  colors: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  labelVisible: PropTypes.bool,
  radius: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  showTitle: PropTypes.bool,
  showScrollbar: PropTypes.bool,
  tooltip: PropTypes.object,
};

GraficoBarrasHorizontal.defaultProps = {
  data: [],
  xAxisVisible: false,
  legendVisible: true,
  isGroup: false,
  xField: 'quantidade',
  yField: 'descricao',
  seriesField: 'descricao',
  colors: [],
  labelVisible: true,
  radius: [4, 4, 0, 0],
  showTitle: false,
  showScrollbar: false,
  tooltip: null,
};

export default GraficoBarrasHorizontal;
