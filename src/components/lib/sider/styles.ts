import { Layout, SiderProps } from 'antd';

import styled from 'styled-components';

import SubMenu from 'antd/es/menu/SubMenu';
import { SiderMenuStylePros, SiderSubMenuStylePros } from '.';

type SiderContainerProps = React.ForwardRefExoticComponent<
  SiderProps & React.RefAttributes<HTMLDivElement> & { collapsedSider: boolean }
>;
export const SiderContainer = styled<SiderContainerProps>(Layout.Sider)`
  @media screen and (max-width: 768px) {
    .secound-child-menu-and-sub-menus {
      display: ${(props) => (props.collapsedSider ? 'none' : 'block')};
    }

    &.ant-layout-sider {
      height: ${(props) => (props.collapsedSider ? '0px' : '100%')};
    }
  }

  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 1) !important;
  text-align: center;
  color: #fff;
  background-color: ${(props) => props.theme?.colors?.colorPrimaryDark} !important;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
`;

export const SiderSubMenuContainer = styled(SubMenu)<SiderSubMenuStylePros>`
  &.ant-menu-submenu {
    width: ${(props) => (props.collapsed ? '80px' : '224px')};
    background: white;
    color: ${(props) => props.theme?.token?.colorText};
    font-weight: 700;

    & {
      :not(.ant-menu-submenu-open) {
        color: white !important;
        background: ${(props) => (props?.isSubMenu ? 'white' : props.theme?.token?.colorPrimary)};

        :hover {
          .ant-menu-submenu-title {
            color: inherit;
          }
        }
      }
    }

    .ant-menu-submenu-title {
      padding: 0 !important;
      margin: 0;
      width: 100%;
      line-height: 20px !important;
      height: ${(props) => (props?.collapsed ? '60px' : '40px')} !important;

      ${(props) => props?.isSubMenu && `padding-left: 22px !important;`}
    }

    &.ant-menu-submenu-open {
      > .ant-menu-submenu-title {
        color: ${(props) => props.theme?.token?.colorPrimary} !important;
      }

      ul li {
        background: white !important;
        color: ${(props) => props.theme?.token?.colorText} !important;
      }

      .ant-menu-submenu-open {
        .ant-menu-submenu-title {
          color: ${(props) => props.theme?.token?.colorPrimary} !important;
        }
      }
    }

    ${(props) =>
      props?.isSubMenu &&
      `.ant-menu-item {
          padding-left: 52px !important;
        }
        width: ${props.collapsed ? '80px' : '221px'};
      `}

    ${(props) =>
      !props?.isSubMenu &&
      `
        &.ant-menu-submenu-open,
        &.ant-menu-submenu-selected {
        border-left: 3px ${`${props.theme?.token?.colorPrimary}95`} solid;
    }
      `}

    &.ant-menu-submenu-selected {
      background: white !important;
      color: ${(props) => props.theme?.token?.colorPrimary} !important;

      .ant-menu-item-selected {
        color: ${(props) => props.theme?.token?.colorPrimary} !important;
        text-decoration: underline;
      }
    }
  }
`;

export const SiderMenuContainer = styled.div<SiderMenuStylePros>`
  overflow: auto;
  height: calc(100vh - 70px);

  ::-webkit-scrollbar {
    width: 4px;
    background: ${(props) => props.theme?.token?.colorPrimary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px !important;
  }

  .ant-menu-light.ant-menu-root.ant-menu-inline {
    display: grid;
    gap: ${(props) => (props.collapsed ? '4px' : '20px')};
    justify-content: center;
    ${(props) => props?.collapsed && `padding: 16px 0px 0px;`}
  }

  .ant-menu {
    background: transparent;

    .ant-menu-inline {
      border-radius: 5px;
    }

    .ant-menu-item {
      text-align: left;

      .ant-menu-title-content {
        white-space: normal;
        line-height: 16px;
      }
    }

    ${(props) =>
      props?.collapsed &&
      `.ant-menu-submenu-arrow {
          display: none;
        }
      `}
  }
`;

export const SiderMenuButtonToggleStyle = styled.div<SiderMenuStylePros>`
  background-color: ${(props) => props.theme?.token?.colorPrimary};
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? 'center' : 'space-between')};
  height: 70px !important;

  img {
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    margin-left: 20px;
    color: white;
    height: 24px;
  }

  button {
    color: white;
    :hover {
      color: white !important;
    }
  }

  ${(props) =>
    !props.collapsed &&
    `
  button {
    border-radius: 24px;
    margin-right: 6px;
   }
  `}
`;

export const SiderMenuGroup = styled.div<SiderMenuStylePros>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props?.collapsed ? 'column' : 'row')} !important;
`;

export const SiderIconContainer = styled.div<SiderMenuStylePros>`
  ${(props) =>
    !props.collapsed &&
    `margin-left: 15px;
     margin-right: 10px;
  `}

  svg,
  i {
    height: ${(props) => (props.collapsed ? '18px' : '22px')};
    width: ${(props) => (props.collapsed ? '18px' : '22px')};
    font-size: 18px;
  }
`;

export const SiderMenuTitle = styled.div<SiderMenuStylePros>`
  font-size: ${(props) => (props.collapsed ? '10px' : '14px')};
  font-weight: 700;
  white-space: normal;
  line-height: 12px;
`;
