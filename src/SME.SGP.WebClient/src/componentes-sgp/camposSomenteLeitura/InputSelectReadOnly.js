import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

const Container = styled.div`
  .ant-select {
    width: 100%;
  }

  .ant-select-arrow {
    color: ${Base.CinzaMako};
  }

  .ant-select-selection--single {
    align-items: center;
    display: flex;
    ${'height: 38px;'}
  }

  .ant-select-selection__rendered {
    width: 98%;
  }

  .ant-select-selection-selected-value {
    width: 98%;
    border: none;
    outline: none;
    font-weight: bold;
  }

  .ant-select-selection__placeholder {
    font-weight: normal !important;
  }

  input::placeholder {
    color: #bfbfbf !important;
  }
`;

const InputSelectReadOnly = props => {
  const { id, value, className, disabled, placeholder } = props;

  return (
    <Container>
      <div
        id={id}
        className={`overflow-hidden ant-select ${
          disabled ? 'ant-select-disabled' : ''
        } ${className}`}
      >
        <div className="ant-select-selection ant-select-selection--single">
          <div className="ant-select-selection__rendered">
            <div>
              <input
                className={`ant-select-selection-selected-value ${
                  placeholder && !String(value)
                    ? 'ant-select-selection__placeholder'
                    : ''
                }
                ${disabled ? 'ant-select-disabled ant-select-selection ' : ''}
                `}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                id={id}
              />
            </div>
          </div>
          <span className="ant-select-arrow" style={{ marginTop: -9 }}>
            <i className="fas fa-angle-down" style={{ fontSize: 18 }} />
          </span>
        </div>
      </div>
    </Container>
  );
};

InputSelectReadOnly.propTypes = {
  id: PropTypes.oneOfType([PropTypes.any]),
  value: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

InputSelectReadOnly.defaultProps = {
  id: 'input-select-readOnly',
  value: '',
  className: '',
  disabled: false,
  placeholder: '',
};

export default InputSelectReadOnly;
