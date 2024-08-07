/* eslint-disable react/prop-types */
import { InputNumber } from 'antd';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { Base } from './colors';
import Label from './label';

const Campo = styled.div`
  span {
    color: ${Base.Vermelho};
  }
  .campo {
    margin-bottom: 5px;
  }
  .ant-input-number {
    height: 38px;
    &-handler-wrap {
      ${({ esconderSetas }) =>
        esconderSetas &&
        css`
          display: none;
        `}
    }
  }

  height: 45px;
`;

const CampoNumero = React.forwardRef((props, ref) => {
  const {
    name,
    id,
    form,
    className,
    classNameCampo,
    type,
    placeholder,
    onChange,
    onKeyDown,
    value,
    desabilitado,
    maxlength,
    label,
    semMensagem,
    max,
    min,
    step,
    disabled,
    onBlur,
    ehDecimal,
    decimalSeparator,
    esconderSetas,
    onKeyUp,
    styleContainer,
    styleCampo,
    autoFocus,
    validateOnBlurInOnChange,
  } = props;

  const possuiErro = () => {
    return form && form.errors[name] && form.touched[name];
  };

  const executaOnBlur = event => {
    const { relatedTarget } = event;
    if (relatedTarget && relatedTarget.getAttribute('type') === 'button') {
      event.preventDefault();
    }
  };

  const validaFormatter = valor => {
    if (!ehDecimal) {
      valor = valor.toString().replace('.', '');
      valor = valor.toString().replace(',', '');
    }
    return valor;
  };

  const validaParser = valor => {
    if (!ehDecimal) {
      valor = valor.replace(/[^0-9.]/g, '');
    }
    return valor;
  };

  const refInterno = useRef();
  const refState = refInterno?.current?.inputNumberRef?.state;

  return (
    <>
      <Campo
        esconderSetas={esconderSetas}
        className={classNameCampo}
        style={styleContainer}
      >
        {label ? <Label text={label} control={name || ''} /> : ''}
        {form ? (
          <>
            {' '}
            <Field
              name={name}
              id={id || name}
              className={`form-control campo ${
                possuiErro() ? 'is-invalid' : ''
              } ${className || ''} ${desabilitado ? 'desabilitado' : ''}`}
              component={InputNumber}
              type={type || ''}
              readOnly={desabilitado}
              onBlur={executaOnBlur}
              maxLength={maxlength || ''}
              innerRef={ref}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              value={form.values[name]}
              onChange={v => {
                form.setFieldValue(name, v);
                form.setFieldTouched(name, true);
                onChange(v);
              }}
              disabled={disabled}
              placeholder={placeholder}
            />
            {!semMensagem && possuiErro() ? (
              <span>{form.errors[name]}</span>
            ) : (
              ''
            )}
          </>
        ) : (
          <InputNumber
            id={id}
            name={name}
            ref={validateOnBlurInOnChange ? refInterno : ref}
            placeholder={placeholder}
            onChange={newValue => {
              if (validateOnBlurInOnChange) {
                const valueHasChanged =
                  refState?.value !== newValue &&
                  refState?.inputValue !== newValue?.toString();
                if (valueHasChanged) {
                  onChange(newValue);
                }
              } else {
                onChange(newValue);
              }
            }}
            readOnly={desabilitado}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            value={value}
            max={max}
            min={min}
            step={step}
            className={className}
            disabled={disabled}
            onBlur={onBlur}
            formatter={v => validaFormatter(v)}
            parser={v => validaParser(v)}
            decimalSeparator={decimalSeparator}
            style={styleCampo}
            maxLength={maxlength}
            autoFocus={autoFocus}
          />
        )}
      </Campo>
    </>
  );
});

CampoNumero.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  semMensagem: PropTypes.bool,
  ehDecimal: PropTypes.bool,
  decimalSeparator: PropTypes.string,
  esconderSetas: PropTypes.bool,
  onKeyUp: PropTypes.func,
  autoFocus: PropTypes.bool,
  label: PropTypes.string,
  validateOnBlurInOnChange: PropTypes.bool,
  placeholder: PropTypes.string,
};

CampoNumero.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  semMensagem: false,
  ehDecimal: true,
  decimalSeparator: ',',
  esconderSetas: false,
  onKeyUp: () => {},
  autoFocus: false,
  label: '',
  validateOnBlurInOnChange: false,
  placeholder: '',
};

export default CampoNumero;
