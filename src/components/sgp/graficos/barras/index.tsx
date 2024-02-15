import { Column, ColumnConfig } from '@ant-design/plots';
import React from 'react';
import { Base, CoresGraficos } from '~/componentes/colors';

import { Types } from '@antv/g2';

interface GraficoBarrasProps extends Omit<ColumnConfig, 'xField' | 'yField'> {
  showScrollbar?: boolean;
  legendVisible?: boolean;
  xAxisVisible?: boolean;
  colors?: string[];
  labelVisible?: boolean;
  radius?: [];
  showTitle?: boolean;
  xField?: string;
  yField?: string;
}

export const GraficoBarras: React.FC<GraficoBarrasProps> = (props) => {
  const {
    legendVisible = true,
    labelVisible = true,
    xAxisVisible = true,
    radius = [4, 4, 0, 0],
    showTitle = true,
    colors = CoresGraficos,
    showScrollbar,
    data,
    isGroup = false,
    xField = 'descricao',
    yField = 'quantidade',
    seriesField = 'descricao',
    ...rest
  } = props;

  const scrollConfig: Types.ScrollbarOption =
    showScrollbar || (window.innerWidth <= 960 && data?.length > 1)
      ? {
          type: 'horizontal',
        }
      : false;

  const config: ColumnConfig = {
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
    xAxis: xAxisVisible
      ? {
          label: {
            style: {
              fontWeight: 'bold',
              fontSize: 12,
              fill: Base.CinzaMako,
            },
          },
        }
      : false,
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
      : false,
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

  return data?.length ? <Column {...config} /> : <></>;
};
