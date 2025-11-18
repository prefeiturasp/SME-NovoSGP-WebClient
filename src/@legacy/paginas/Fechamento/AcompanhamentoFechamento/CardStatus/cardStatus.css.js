import styled from 'styled-components';
import { Base } from '~/componentes';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  width: 100%;
  height: 56px;

  background: #ffffff;
  border: 1px solid #bfbfbf;
  border-left: ${({ corStatus }) => corStatus && `4px solid ${corStatus}`};
  box-sizing: border-box;
  box-shadow: 0px 1px 4px rgba(8, 35, 48, 0.1);
  border-radius: 4px;

  &:not(:last-child) {
    margin-right: 12px;
  }

  .descricao {
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    color: ${({ corStatus }) => corStatus};
  }

  .quantidade {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: ${Base.CinzaMako};
  }
`;
