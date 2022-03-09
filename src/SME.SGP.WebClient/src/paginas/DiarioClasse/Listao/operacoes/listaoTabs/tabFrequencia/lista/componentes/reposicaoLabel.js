import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

const Container = styled.div`
  width: 30px !important;
  position: absolute;
  border-bottom: ${props => (props.linhaDetalhe ? '35px' : '40px')} solid
    transparent;
  border-left: ${props => (props.linhaDetalhe ? '35px' : '40px')} solid
    ${Base.RoxoClaro};
  top: 0;
  left: 0;
  div {
    position: absolute;
    right: ${props => (props.linhaDetalhe ? '32px' : '23px')};
    color: ${Base.Branco};
  }
`;

const ReposicaoLabel = ({ linhaDetalhe }) => (
  <Tooltip title="Reposição">
    <Container linhaDetalhe={linhaDetalhe}>
      <div>R</div>
    </Container>
  </Tooltip>
);

ReposicaoLabel.propTypes = {
  linhaDetalhe: PropTypes.bool,
};

ReposicaoLabel.defaultProps = {
  linhaDetalhe: false,
};
export default ReposicaoLabel;
