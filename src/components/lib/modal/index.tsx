import React from 'react';

import { Modal as ModalAntd, ModalProps } from 'antd';
import styled from 'styled-components';
import { Colors } from '@/core/styles/colors';

const ModalAntdContainer = styled(ModalAntd)`
  .ant-modal-title {
    border-bottom: 1px solid #bfbfbf;
  }

  .ant-modal-footer {
    border-top: 1px solid #bfbfbf;
    padding-top: 16px;
  }
`;

const Modal: React.FC<ModalProps> = ({ ...rest }) => (
  <ModalAntdContainer
    {...rest}
    okButtonProps={{ ...rest?.okButtonProps, type: 'default' }}
    cancelButtonProps={{
      ...rest?.cancelButtonProps,
      type: 'text',
      style: { color: Colors.TEXT },
    }}
  />
);

export default Modal;
