import styled from 'styled-components';
import { Tabs } from 'antd';

import { Base } from '../colors';

export const ContainerTabsCard = styled(Tabs)`
  width: 100% !important;

  .ant-tabs-tab-next {
    display: none;
  }

  .ant-tabs-tab-prev {
    display: none;
  }

  .ant-tabs-nav-list {
    width: 100%;
  }

  .ant-tabs-tab {
    width: ${props => (props.width ? props.width : '25%')};
    margin-right: 0px !important;
    border: 1px solid ${Base.CinzaDesabilitado} !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-tabs-nav .ant-tabs-tab:hover {
    color: rgba(0, 0, 0, 0.65);
  }

  .ant-tabs-tab-active:hover {
    color: ${Base.Roxo} !important;
  }
  .ant-tabs-tab-active,
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${Base.Roxo} !important;
    border-bottom: 1px solid #fff !important;
  }

  .ant-tabs-nav-container-scrolling {
    padding-right: 0px;
    padding-left: 0px;
  }

  .ant-tabs-bar {
    margin: ${props => (props.border ? 0 : 'initial')};
  }

  .ant-tabs-tabpane {
    padding-top: ${props => (props.border ? '16px' : 'initial')};
    border: ${props =>
      props.border ? `1px solid ${Base.CinzaDesabilitado}` : 'initial'};
    border-top: ${props => (props.border ? 0 : 'initial')};

    form {
      padding-left: ${props => (props.border ? '25px' : 'initial')};
      padding-right: ${props => (props.border ? '25px' : 'initial')};
    }
  }

  .ant-tabs-nav-operations {
    display: none !important;
  }
`;
