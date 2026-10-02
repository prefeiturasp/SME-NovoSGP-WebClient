import React from 'react';
import t from 'prop-types';

import { ResponsivePie } from '@nivo/pie';
import comDefaultProps from '~/utils/comDefaultProps';

const Pie = ({ data, enableRadialLabels }) => (
  <div style={{ height: 400 }}>
    <ResponsivePie
      style={{ height: 400 }}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLinkLabel={item => item.radialLabel || item.value}
      arcLinkLabelsDiagonalLength={30}
      arcLinkLabelsThickness={1}
      enableArcLabels={false}
      data={data}
      margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
      colors={d => d.color}
      theme={{
        labels: {
          text: {
            fontSize: '14px',
            fontFamily: 'Roboto',
            fontWeight: 700,
            fill: '#42474a',
          },
        },
      }}
      isInteractive={false}
      enableArcLinkLabels={enableRadialLabels}
    />
  </div>
);

Pie.propTypes = {
  enableRadialLabels: t.bool,
};

export default comDefaultProps(Pie, {
  enableRadialLabels: true,
});
