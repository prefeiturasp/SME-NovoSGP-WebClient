import styled, { css } from 'styled-components';

// Ant
import { Collapse } from 'antd';

// Componentes
import { Base } from '~/componentes';

export const IconeEstilizado = styled.i`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 18px !important;
  color: ${({ color }) => color} !important;
`;

export const CollapseEstilizado = styled(Collapse)`
  ${({ accordion }) =>
    accordion
      ? css`
          background: transparent;
          border: 0;
        `
      : css`
          box-shadow: 0px 0px 4px -2px grey;
          background: ${Base.Branco};
        `}
`;

export const PainelEstilizado = styled(Collapse.Panel)`
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  letter-spacing: 0.15px;

  color: ${Base.CinzaMako};

  .ant-collapse-header {
    ${({ espacoPadrao }) =>
      !espacoPadrao && `padding: 18px 40px 18px 18px !important;`}

    ${props => props.temBorda && `border-radius: 4px !important`};
    ${props =>
      props.temBorda &&
      `border-left: 8px solid ${
        props.corBorda ? props.corBorda : Base.AzulBreadcrumb
      }`};

    ${({ accordion }) =>
      accordion &&
      css`
        height: 100% !important;
      `}
  }

  .ant-collapse-content {
    height: 100% !important;
    background-color: transparent !important;
  }

  &.ant-collapse-item-active {
    .ant-collapse-header {
      box-shadow: 0px 3px 4px -3px #42474a94;
      ${({ espacoPadrao }) => !espacoPadrao && ` padding: 18px 16px;`}
      padding-right: 40px;
    }
  }

  &.ant-collapse-item {
    ${({ accordion }) =>
      accordion &&
      css`
        border: 1px solid #bfbfbf;
        box-sizing: border-box;
        box-shadow: 0px 1px 4px rgba(8, 35, 48, 0.1);
        min-height: 48px;
        margin-bottom: 16px;
        border-radius: 4px !important;
      `}
  }
`;

export const LabelPendente = styled.div`
  padding: 4px 8px;
  background: ${Base.LaranjaStatus};
  border-radius: 4px;

  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: ${Base.Branco};

  margin-right: 24px;
`;
