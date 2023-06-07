import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  height: 38px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  .ant-input {
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    height: 38px;
    box-sizing: border-box;
    margin: 0;
    padding: 8px 18px 8px 0px;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    line-height: 1.5714285714285714;
    list-style: none;
    font-family: Roboto;
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    background-color: #ffffff;
    background-image: none;
    border-width: 1px;
    border-style: solid;
    border-color: #d9d9d9;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .ant-input::placeholder {
    color: #b3b3b3;
    flex: 1;
    font-weight: 400;
  }

  .ant-input:-ms-input-placeholder {
    color: #b3b3b3;
    font-weight: 400;
  }

  .ant-input::-ms-input-placeholder {
    color: #b3b3b3;
    font-weight: 400;
  }

  input {
    font-weight: bold;
    text-align: center;
  }
`;

const InputSelectReadOnly = props => {
  const { id, value, disabled, placeholder, height } = props;

  return (
    <Container
      disabled={disabled}
      className={`ant-select ${disabled ? 'ant-select-disabled' : ''}`}
      style={{ height }}
    >
      <div className="ant-select-selector">
        <input
          id={id}
          readOnly
          value={value}
          disabled={disabled}
          className="ant-input"
          placeholder={placeholder}
        />
        <span
          className="ant-select-arrow"
          style={{
            position: 'absolute',
            margin: '10px -27px',
            color: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <i className="fas fa-angle-down" style={{ fontSize: 18 }} />
        </span>
      </div>
    </Container>
  );
};

InputSelectReadOnly.propTypes = {
  id: PropTypes.oneOfType([PropTypes.any]),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  height: PropTypes.string,
};

InputSelectReadOnly.defaultProps = {
  id: 'input-select-readOnly',
  value: '',
  disabled: false,
  placeholder: '',
  height: '',
};

export default InputSelectReadOnly;
