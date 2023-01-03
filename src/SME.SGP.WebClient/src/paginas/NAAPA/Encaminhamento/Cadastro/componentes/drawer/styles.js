import { Drawer } from 'antd';
import styled from 'styled-components';
import { Base } from '~/componentes';

export const DrawerContainer = styled(Drawer)`
  .ant-drawer-header {
    position: absolute;
    padding: 16px 24px;
    z-index: 99999;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 4px 4px 0 0;

    .ant-drawer-title {
      font-size: 18px;
      font-weight: bold;
      line-height: 24px;
      color: ${Base.CinzaMako};
    }

    .ant-drawer-close {
      color: ${Base.CinzaMako};
    }
  }
  .ant-drawer-body {
    padding: 30px 24px;
    margin-top: 3rem;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .ant-drawer-footer {
    right: 0;
    bottom: 0;
    width: 100%;
    text-align: right;
    background: #fff;
    padding: 10px 16px;
    position: absolute;
    border-top: 1px solid #e8e8e8;
  }
`;
