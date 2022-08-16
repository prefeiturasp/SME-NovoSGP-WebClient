import PropTypes from 'prop-types';
import React from 'react';

const InputNumberReadOnly = props => {
  const { id, value, style, disabled, placeholder } = props;

  const styleInput = {
    ...style,
    cursor: disabled ? 'default' : 'pointer',
    height: '38px',
  };

  return (
    <div
      className={`ant-input-number ${
        disabled ? 'ant-input-number-disabled' : ''
      }`}
      style={styleInput}
    >
      <div className="ant-input-number-input-wrap">
        <input
          placeholder={placeholder}
          className="ant-input-number-input"
          id={id}
          value={value}
          disabled={disabled}
          readOnly
        />
      </div>
    </div>
  );
};

InputNumberReadOnly.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

InputNumberReadOnly.defaultProps = {
  id: 'input-number-read-only',
  value: '',
  style: {},
  disabled: false,
  isDecimal: true,
  placeholder: '',
};

export default InputNumberReadOnly;
