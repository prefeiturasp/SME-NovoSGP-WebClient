import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Base } from './colors';

const Container = styled.div`
  label,
  div {
    font-family: Roboto;
    height: ${({ altura }) => `${altura}px`};
    font-size: ${({ tamanhoFonte }) => `${tamanhoFonte}px`};
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 0.14px;
    color: #42474a;
    font-weight: bold;
  }

  span {
    color: ${Base.CinzaBotao};
    font-weight: normal;
  }

  .campoOpcional {
    font-size: 12px !important;
    color: ${Base.CinzaBotao} !important;
    margin-left: 2px;
    font-weight: normal;
  }
`;

const Label = ({
  text,
  control,
  center,
  className,
  campoOpcional,
  observacaoText,
  tamanhoFonte,
  altura,
  isRequired,
  withDiv,
}) => {
  return (
    <Container
      className={center && 'text-center'}
      tamanhoFonte={tamanhoFonte}
      altura={altura}
    >
      {isRequired && (
        <span
          style={{
            marginLeft: '-11px',
            color: Base.Vermelho,
            marginRight: '4px',
          }}
        >
          *
        </span>
      )}
      {withDiv ? (
        <>
          <div htmlFor={control} id={text} className={className}>
            {text}
            {observacaoText ? <span> {` ${observacaoText}`}</span> : ''}
          </div>
          {campoOpcional ? (
            <span htmlFor={control} id={text} className="campoOpcional">
              (opcional)
            </span>
          ) : null}
        </>
      ) : (
        <>
          {/* eslint-disable-next-line jsx-a11y/label-has-for */}
          <label htmlFor={control} id={text} className={className}>
            {text}
            {observacaoText ? <span> {` ${observacaoText}`}</span> : ''}
          </label>
          {campoOpcional ? (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
            <label htmlFor={control} id={text} className="campoOpcional">
              (opcional)
            </label>
          ) : null}
        </>
      )}
    </Container>
  );
};
Label.propTypes = {
  text: PropTypes.string,
  control: PropTypes.string,
  center: PropTypes.bool,
  className: PropTypes.string,
  campoOpcional: PropTypes.string,
  observacaoText: PropTypes.string,
  tamanhoFonte: PropTypes.string,
  altura: PropTypes.string,
  isRequired: PropTypes.bool,
  withDiv: PropTypes.bool,
};

Label.defaultProps = {
  text: '',
  control: null,
  center: false,
  className: '',
  campoOpcional: '',
  observacaoText: '',
  tamanhoFonte: '14',
  altura: '17',
  isRequired: false,
  withDiv: false,
};

export default Label;
