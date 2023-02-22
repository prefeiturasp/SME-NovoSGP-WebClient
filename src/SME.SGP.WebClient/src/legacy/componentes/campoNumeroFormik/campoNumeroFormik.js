/* eslint-disable react/prop-types */
import { InputNumber } from 'antd';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import Label from '../label';
import { Campo } from './campoNumeroFormik.css';

const CampoNumeroFormik = React.forwardRef((props, ref) => {
  const {
    name,
    id,
    form,
    className,
    placeholder,
    onChange,
    onKeyDown,
    label,
    semMensagem,
    max,
    min,
    step,
    disabled,
    onBlur,
    labelRequired,
    height,
  } = props;

  const possuiErro = () => {
    return form && form.errors[name] && form.touched[name];
  };

  return (
    <Campo height={height}>
      {label ? (
        <Label text={label} control={name || ''} isRequired={labelRequired} />
      ) : (
        ''
      )}
      <Field name={name} id={name}>
        {({ field: { value } }) => (
          <div>
            <div>
              <InputNumber
                ref={ref}
                placeholder={placeholder}
                onChange={valor => {
                  form.setFieldValue(name, valor);
                  form.setFieldTouched(name, true);
                  onChange(valor);
                }}
                className={`form-control campo ${
                  possuiErro() ? 'is-invalid' : ''
                } ${className || ''} ${disabled ? 'desabilitado' : ''}`}
                readOnly={disabled}
                onKeyDown={onKeyDown}
                value={value}
                max={max}
                min={min}
                step={step}
                disabled={disabled}
                onBlur={onBlur}
                id={id}
                name={id}
              />
            </div>
          </div>
        )}
      </Field>
      {!semMensagem ? <span>{form.errors[name]}</span> : ''}
    </Campo>
  );
});

CampoNumeroFormik.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  semMensagem: PropTypes.bool,
  labelRequired: PropTypes.bool,
  height: PropTypes.string,
};

CampoNumeroFormik.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  semMensagem: false,
  labelRequired: '',
  height: null,
};

export default CampoNumeroFormik;
