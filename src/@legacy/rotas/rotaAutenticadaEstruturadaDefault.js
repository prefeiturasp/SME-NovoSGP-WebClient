import React, { memo } from 'react';
import t from 'prop-types';
import { Route } from 'react-router-dom';

const RotaAutenticadaEstruturadaDefault = memo(
  ({ Component, ...propriedades }) => {
    return (
      <Route
        {...propriedades}
        render={propriedade => <Component {...propriedade} />}
      />
    );
  }
);

RotaAutenticadaEstruturadaDefault.propTypes = {
  Component: t.oneOfType([t.any]),
};

RotaAutenticadaEstruturadaDefault.defaultProps = {
  Component: null,
};

export default RotaAutenticadaEstruturadaDefault;
