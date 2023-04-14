import styled from 'styled-components';

export const Container = styled.div`
  height: 38px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};

  .ant-input {
    height: 38px;
    box-sizing: border-box;
    margin: 0;
    padding: 7px 11px;
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
  }

  .ant-input:-ms-input-placeholder {
    color: #b3b3b3;
  }

  .ant-input::-ms-input-placeholder {
    color: #b3b3b3;
  }
`;
