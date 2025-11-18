import React from 'react';
import PropTypes from 'prop-types';

// Components
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// Styles
import { DefaultDropDownLink } from '../styles';

function DropDownQuantidade({ onChange, value }) {
  const options = (
    <Menu>
      <Menu.Item onClick={() => onChange(1)} key="0">
        1
      </Menu.Item>
      <Menu.Item onClick={() => onChange(2)} key="1">
        2
      </Menu.Item>
      <Menu.Item onClick={() => onChange(3)} key="3">
        3
      </Menu.Item>
      <Menu.Item onClick={() => onChange(4)} key="4">
        4
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown trigger={['click']} menu={options}>
      <DefaultDropDownLink href="#">
        <span>{value}</span> <DownOutlined />
      </DefaultDropDownLink>
    </Dropdown>
  );
}

DropDownQuantidade.defaultProps = {
  value: 0,
  onChange: () => {},
};

DropDownQuantidade.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default DropDownQuantidade;
