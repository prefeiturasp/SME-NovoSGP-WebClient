import PropTypes from 'prop-types';
import React from 'react';
import { Container } from './style';

const InputNumberReadOnly = props => {
  const { id, value, name, style, disabled, placeholder } = props;

  return (
    <Container
      className={`ant-input-number ${
        disabled ? 'ant-input-number-disabled' : ''
      }`}
    >
      <div className="ant-input-number-input-wrap">
        <input
          name={name}
          id={id}
          readOnly
          value={value}
          disabled={disabled}
          className="ant-input"
          placeholder={placeholder}
          style={style}
        />
      </div>
    </Container>
  );
};

InputNumberReadOnly.propTypes = {
  id: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.any]),
  value: PropTypes.oneOfType([PropTypes.any]),
  style: PropTypes.oneOfType([PropTypes.object]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

InputNumberReadOnly.defaultProps = {
  id: 'input-number-read-only',
  value: '',
  style: {},
  disabled: false,
  placeholder: '',
  name: '',
};

export default InputNumberReadOnly;
