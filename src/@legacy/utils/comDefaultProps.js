import { forwardRef } from 'react';

const comDefaultProps = (Componente, defaultProps = {}) => {
  const ComponenteComDefaultProps = forwardRef((props, ref) => {
    const propsComDefault = { ...props };

    Object.keys(defaultProps).forEach(key => {
      if (propsComDefault[key] === undefined) {
        propsComDefault[key] = defaultProps[key];
      }
    });

    return <Componente {...propsComDefault} ref={ref} />;
  });

  ComponenteComDefaultProps.displayName = `ComDefaultProps(${
    Componente.displayName || Componente.name || 'Componente'
  })`;
  ComponenteComDefaultProps.propTypes = Componente.propTypes;
  ComponenteComDefaultProps.defaultProps = defaultProps;

  return ComponenteComDefaultProps;
};

export default comDefaultProps;
