import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select } from 'antd';
import shortid from 'shortid';
import { Field } from 'formik';
import { Base } from './colors';
import Label from './label';

const Container = styled.div`
  ${({ size }) => size && size === 'small' && 'height: 24px !important;'}

  .ant-select-single .ant-select-selector {
    ${({ color }) => color && `color: ${color} !important;`}
    ${({ border }) => border && `border-color: ${border} !important;`}
  }

  .ant-select-selection-placeholder {
    ${({ color }) => color && `color: ${color};`}
    ${({ border, color }) => border && color && 'font-weight: bold !important;'}
  }

  div[class*='is-invalid'] {
    .ant-select-selector {
      border-color: #dc3545 !important;
    }
  }

  .ant-select-selection-item {
    color: inherit;
  }

  label {
    font-weight: bold;
  }

  .ant-select-multiple .ant-select-selection-overflow {
    white-space: nowrap;
    max-height: 100px;
    overflow: auto;
  }
`;

const Erro = styled.span`
  color: ${Base.Vermelho};
`;

const SelectComponent = React.forwardRef((props, ref) => {
  const {
    name,
    id,
    className,
    classNameContainer,
    onChange,
    label,
    valueText,
    valueOption,
    valueSelect,
    lista,
    placeholder,
    alt,
    multiple,
    containerVinculoId,
    disabled,
    form,
    showSearch,
    size,
    border,
    color,
    allowClear,
    defaultValue,
    style,
    searchValue,
    setValueOnlyOnChange,
    labelRequired,
    labelInValue,
  } = props;

  const { Option } = Select;

  const possuiErro = () => {
    return form && form.errors[name] && form.touched[name];
  };

  const opcoesLista = () => {
    return (
      lista &&
      lista.length > 0 &&
      lista.map(item => {
        return (
          <Option
            key={shortid.generate()}
            value={`${item[valueOption]}`}
            title={`${item[valueText]}`}
            id={`VALOR_${item[valueOption]}`}
            name={`NOME_${item[valueText]?.toUpperCase?.()}`}
          >
            {`${item[valueText]}`}
          </Option>
        );
      })
    );
  };

  const obterErros = () => {
    return form && form.touched[name] && form.errors[name] ? (
      <Erro>{form.errors[name]}</Erro>
    ) : (
      ''
    );
  };

  const filterOption = (input, option) => {
    const value = option?.props?.value?.toLowerCase();
    const drescription = option?.props?.children?.toLowerCase();
    if (searchValue) {
      return (
        value?.indexOf(input?.toLowerCase()) >= 0 ||
        drescription?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
      );
    }
    return drescription?.toLowerCase().indexOf(input?.toLowerCase()) >= 0;
  };

  const campoComValidacoes = () => (
    <Field
      mode={multiple && 'multiple'}
      suffixIcon={<i className="fas fa-angle-down" style={{ fontSize: 18 }} />}
      className={
        form
          ? `overflow-hidden ${possuiErro() ? 'is-invalid' : ''} ${
              className || ''
            }`
          : ''
      }
      name={name}
      id={id || name}
      value={form.values[name] || undefined}
      placeholder={placeholder}
      notFoundContent="Sem dados"
      alt={alt}
      optionFilterProp="children"
      allowClear={allowClear}
      disabled={disabled}
      component={Select}
      type="input"
      onChange={e => {
        if (setValueOnlyOnChange) {
          if (onChange) onChange(e || '');
        } else {
          form.setFieldValue(name, e || '');
          form.setFieldTouched(name, true, true);
          if (onChange) onChange(e || '');
        }
      }}
      innerRef={ref}
      defaultValue={defaultValue}
      filterOption={filterOption}
      showSearch={showSearch}
      labelInValue={labelInValue}
    >
      {opcoesLista()}
    </Field>
  );

  const obtenhaContainerVinculo = () =>
    document.getElementById(containerVinculoId);

  const campoSemValidacoes = () => (
    <Select
      mode={multiple && 'multiple'}
      suffixIcon={<i className="fas fa-angle-down" style={{ fontSize: 18 }} />}
      className={`overflow-hidden ${className}`}
      name={name}
      id={id}
      onChange={onChange}
      value={valueSelect}
      getPopupContainer={containerVinculoId && obtenhaContainerVinculo}
      placeholder={placeholder}
      notFoundContent="Sem dados"
      alt={alt}
      optionFilterProp="children"
      allowClear={allowClear}
      disabled={disabled}
      ref={ref}
      showSearch={showSearch}
      size={size || 'default'}
      defaultValue={defaultValue}
      style={style}
      filterOption={filterOption}
    >
      {opcoesLista()}
    </Select>
  );
  return (
    <Container
      className={classNameContainer || ''}
      size={size}
      border={border}
      color={color}
    >
      {label ? (
        <Label text={label} control={name} isRequired={labelRequired} />
      ) : (
        <></>
      )}
      {form ? campoComValidacoes() : campoSemValidacoes()}
      {form ? obterErros() : ''}
    </Container>
  );
});

SelectComponent.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  classNameContainer: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  valueText: PropTypes.string.isRequired,
  valueOption: PropTypes.string.isRequired,
  valueSelect: PropTypes.oneOfType([PropTypes.any]),
  lista: PropTypes.oneOfType([PropTypes.any]),
  placeholder: PropTypes.string,
  alt: PropTypes.string,
  multiple: PropTypes.bool,
  containerVinculoId: PropTypes.string,
  disabled: PropTypes.bool,
  form: PropTypes.any,
  showSearch: PropTypes.bool,
  size: PropTypes.string,
  border: PropTypes.string,
  color: PropTypes.string,
  allowClear: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object]),
  searchValue: PropTypes.bool,
  setValueOnlyOnChange: PropTypes.bool,
  labelRequired: PropTypes.bool,
  labelInValue: PropTypes.bool,
};

SelectComponent.defaultProps = {
  lista: [],
  allowClear: true,
  style: null,
  searchValue: true,
  setValueOnlyOnChange: false,
  labelRequired: false,
  showSearch: true,
  labelInValue: false,
};

export default SelectComponent;
