import { Button, ButtonProps } from 'antd';
import React from 'react';

const ButtonPrimary: React.FC<ButtonProps> = ({ ...rest }) => (
  <Button type="primary" block style={{ fontWeight: 700 }} {...rest} />
);

export default ButtonPrimary;
