import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

export const Container = styled.span`
  background-color: ${Base.Azul};
  border-radius: 4px;
  color: ${Base.Branco};
  font-weight: bold;
  padding: 3px 5px 3px 5px;
  font-size: 12px;
`;

const LabelTotalMatriculas = props => {
  const { total } = props;

  return total ? (
    <div className="d-flex justify-content-end pb-4">
      <Container>
        <div>Total de matrículas: {total}</div>
      </Container>
    </div>
  ) : (
    ''
  );
};

LabelTotalMatriculas.propTypes = {
  total: PropTypes.number,
};

LabelTotalMatriculas.defaultProps = {
  total: '',
};

export default LabelTotalMatriculas;
