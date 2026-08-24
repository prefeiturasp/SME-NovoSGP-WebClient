import React from 'react';
import PropTypes from 'prop-types';

import comDefaultProps from '~/utils/comDefaultProps';
function LinhaBootstrap({ children, paddingBottom }) {
  const className = `row ${paddingBottom ? `pb-${paddingBottom}` : ''}`;
  return <div className={className}>{children}</div>;
}

LinhaBootstrap.defaultProps = {
  paddingBottom: 0,
  children: () => {},
};

LinhaBootstrap.propTypes = {
  paddingBottom: PropTypes.number,
  children: PropTypes.node,
};

export default comDefaultProps(LinhaBootstrap, LinhaBootstrap.defaultProps);