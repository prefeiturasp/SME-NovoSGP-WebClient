import { createElement } from 'react';
import PropTypes from 'prop-types';

import comDefaultProps from '~/utils/comDefaultProps';
const RenderizarHtml = ({ textoHtml, tag, ...rest }) =>
  createElement(tag, {
    dangerouslySetInnerHTML: {
      __html: textoHtml,
    },
    ...rest,
  });

RenderizarHtml.defaultProps = {
  textoHtml: '',
  tag: 'div',
};

RenderizarHtml.propTypes = {
  textoHtml: PropTypes.string,
  tag: PropTypes.string,
};

export default comDefaultProps(RenderizarHtml, RenderizarHtml.defaultProps);