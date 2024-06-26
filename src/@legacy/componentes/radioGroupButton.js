import { Radio } from 'antd';
import { Field } from 'formik';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Base } from '~/componentes/colors';

import Label from './label';

const Campo = styled.div`
  .ant-radio-inner::after {
    background-color: ${Base.Roxo} !important;
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: ${Base.Roxo} !important;
    background-color: initial !important;
  }
  .ant-radio-wrapper:hover .ant-radio,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: ${Base.Roxo} !important;
  }
  .ant-radio-group {
    white-space: nowrap;
    margin-bottom: 5px;
    border-radius: 0.15rem;
    width: ${props => (props.invalido ? 'fit-content' : 'auto')};
    padding-left: ${props => (props.invalido ? '2px' : '0px')};
    border: ${props =>
      props.invalido ? `1px solid  ${Base.Vermelho}` : 'none'};
  }

  label {
    font-weight: bold;
  }
`;

const Error = styled.span`
  color: ${Base.Vermelho};
`;

const RadioGroupButton = ({
  name,
  id,
  form,
  className,
  valorInicial,
  onChange,
  desabilitado,
  label,
  opcoes,
  value,
  labelRequired,
  setValueOnlyOnChange,
}) => {
  const obterErros = () => {
    return form && form.touched[name] && form.errors[name] ? (
      <Error>
        <span>{form.errors[name]}</span>
      </Error>
    ) : (
      ''
    );
  };

  const possuiErro = () => {
    return form && form.errors[name] && form.touched[name];
  };

  const campoComValidacoes = () => {
    return (
      <Field
        name={name}
        component={() => (
          <Radio.Group
            name={id}
            id={id || name}
            options={opcoes}
            onChange={e => {
              const newValue = e?.target?.value;
              if (setValueOnlyOnChange) {
                if (onChange) onChange(newValue);
              } else {
                form.setFieldValue(name, newValue);
                onChange(newValue);
                form.setFieldTouched(name, true, true);
              }
            }}
            defaultValue={valorInicial}
            disabled={desabilitado}
            value={form.values[name]}
          />
        )}
      />
    );
  };

  const campoSemValidacoes = () => {
    return (
      <Radio.Group
        name={id}
        id={id}
        options={opcoes}
        onChange={onChange}
        disabled={desabilitado}
        value={value || false}
      />
    );
  };

  return (
    <>
      <Campo className={className} invalido={possuiErro()}>
        {label ? (
          <Label text={label} control={name || ''} isRequired={labelRequired} />
        ) : (
          <></>
        )}

        {
          <>
            {form ? campoComValidacoes() : campoSemValidacoes()}
            {obterErros()}
          </>
        }
      </Campo>
    </>
  );
};

RadioGroupButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.func,
  labelRequired: PropTypes.bool,
  setValueOnlyOnChange: PropTypes.bool,
};

RadioGroupButton.defaultProps = {
  className: '',
  label: '',
  desabilitado: false,
  onChange: () => {},
  labelRequired: false,
  setValueOnlyOnChange: false,
};

export default RadioGroupButton;
