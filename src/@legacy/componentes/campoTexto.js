import { Input } from 'antd';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { maskSomenteTexto, maskTelefone, maskNota } from '~/utils';
import { Base } from './colors';
import Label from './label';

const Campo = styled.div`
  span {
    color: ${Base.Vermelho};
  }
  .campo {
    margin-bottom: 5px;
  }
  .ant-input {
    height: ${({ height }) => height}px;
  }
  label {
    font-weight: bold;
  }

  .ant-input-affix-wrapper {
    padding: 0 6px;

    .ant-input-prefix {
      left: 12px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 0;
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      z-index: 2;
    }
  }

  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 40px;
  }

  .form-control.is-invalid,
  .was-validated .form-control:invalid {
    background-repeat: no-repeat !important;
    background-position: right calc(0.375em + 0.1875rem) center !important;
    border-color: #dc3545 !important;
  }

  .desabilitado {
    cursor: not-allowed !important;
    color: rgba(0, 0, 0, 0.25) !important;
    background: rgba(0, 0, 0, 0.04) !important;
  }
`;

const CampoTexto = React.forwardRef((props, ref) => {
  const {
    name,
    id,
    form,
    className,
    classNameCampo,
    type,
    maskType,
    placeholder,
    onChange,
    onKeyDown,
    onKeyUp,
    value,
    desabilitado,
    maxLength,
    label,
    semMensagem,
    style,
    iconeBusca,
    allowClear,
    minRowsTextArea,
    height,
    onBlur,
    labelRequired,
    addMaskTelefone,
    somenteTexto,
    somenteNumero,
    addMaskNota,
    autoFocus,
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

  const onChangeCampoComForm = e => {
    let valorParaAtualizar = e.target.value;

    if (valorParaAtualizar && addMaskTelefone) {
      valorParaAtualizar = maskTelefone(e.target.value);
    } else if (valorParaAtualizar && somenteTexto) {
      valorParaAtualizar = maskSomenteTexto(e.target.value);
    } else if (valorParaAtualizar && somenteNumero) {
      valorParaAtualizar = String(e.target.value)?.replace?.(/\D/g, '');
    }

    const valorDiferente = form.values[name] !== valorParaAtualizar;
    if (valorDiferente) {
      form.setFieldValue(name, valorParaAtualizar);
      form.setFieldTouched(name, true, true);
      onChange(e, valorParaAtualizar);
    }
  };

  const onChangeCampoSemForm = e => {
    let valorParaAtualizar = e.target.value;

    if (valorParaAtualizar && addMaskNota) {
      valorParaAtualizar = maskNota(valorParaAtualizar);
    }

    const valorDiferente = value !== valorParaAtualizar;
    if (valorDiferente) {
      onChange(e, valorParaAtualizar);
    }
  };

  return (
    <Campo className={classNameCampo} height={height}>
      {label ? (
        <Label text={label} control={name || ''} isRequired={labelRequired} />
      ) : (
        <></>
      )}
      {form ? (
        <>
          {' '}
          <Field
            name={name}
            id={id || name}
            className={`form-control campo ${
              possuiErro() ? 'is-invalid' : ''
            } ${className || ''} ${desabilitado ? 'desabilitado' : ''}`}
            component={type || Input}
            type={maskType}
            readOnly={desabilitado}
            disabled={desabilitado}
            onBlur={executaOnBlur}
            maxLength={maxLength || ''}
            innerRef={ref}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            placeholder={placeholder}
            onChange={onChangeCampoComForm}
            style={style}
            prefix={iconeBusca ? <i className="fa fa-search fa-lg" /> : ''}
            value={value || form.values[name]}
            rows={minRowsTextArea}
          />
          {!semMensagem && possuiErro() ? <span>{form.errors[name]}</span> : ''}
        </>
      ) : (
        <Input
          style={style}
          name={name}
          id={id}
          ref={ref}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChange={onChangeCampoSemForm}
          onBlur={onBlur}
          disabled={desabilitado}
          readOnly={desabilitado}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          value={value}
          prefix={iconeBusca ? <i className="fa fa-search fa-lg" /> : ''}
          allowClear={allowClear}
          maxLength={maxLength || ''}
          autoComplete="off"
        />
      )}
    </Campo>
  );
});

CampoTexto.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  className: PropTypes.string,
  classNameCampo: PropTypes.string,
  type: PropTypes.string,
  maskType: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.oneOfType([PropTypes.func]),
  onKeyUp: PropTypes.oneOfType([PropTypes.func]),
  onKeyDown: PropTypes.oneOfType([PropTypes.func]),
  value: PropTypes.oneOfType([PropTypes.any]),
  desabilitado: PropTypes.bool,
  maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  semMensagem: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.any]),
  iconeBusca: PropTypes.bool,
  allowClear: PropTypes.bool,
  minRowsTextArea: PropTypes.string,
  height: PropTypes.string,
  onBlur: PropTypes.oneOfType([PropTypes.func]),
  labelRequired: PropTypes.bool,
  addMaskTelefone: PropTypes.bool,
  addMaskNota: PropTypes.bool,
  somenteTexto: PropTypes.bool,
  somenteNumero: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

CampoTexto.defaultProps = {
  name: '',
  id: '',
  form: null,
  className: '',
  classNameCampo: '',
  type: '',
  maskType: '',
  placeholder: '',
  onChange: () => {},
  onKeyUp: () => {},
  onKeyDown: () => {},
  value: '',
  desabilitado: false,
  maxLength: 100,
  label: '',
  semMensagem: false,
  style: {},
  iconeBusca: false,
  allowClear: true,
  minRowsTextArea: '2',
  height: '38',
  onBlur: () => {},
  labelRequired: false,
  addMaskTelefone: false,
  addMaskNota: false,
  somenteTexto: false,
  somenteNumero: false,
  autoFocus: false,
};

export default CampoTexto;
