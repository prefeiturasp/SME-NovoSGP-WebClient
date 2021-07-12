import PropTypes from 'prop-types';
import React from 'react';

import { ContainerTagGrafico } from './tagGrafico.css';

const TagGrafico = ({ valor, descricao }) => (
  <>
    {valor && (
      <div className="d-flex justify-content-end pb-4">
        <ContainerTagGrafico>
          <div>{valor}</div>
          {descricao && <div>{descricao}</div>}
        </ContainerTagGrafico>
      </div>
    )}
  </>
);

TagGrafico.propTypes = {
  valor: PropTypes.string,
  descricao: PropTypes.string,
};

TagGrafico.defaultProps = {
  valor: '',
  descricao: '',
};

export default TagGrafico;
