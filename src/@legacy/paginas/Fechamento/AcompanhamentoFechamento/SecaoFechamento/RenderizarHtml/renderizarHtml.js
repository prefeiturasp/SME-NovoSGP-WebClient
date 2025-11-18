import { createElement } from 'react';
import PropTypes from 'prop-types';

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

export default RenderizarHtml;
