import styled from 'styled-components';
import { Base } from '~/componentes';

const Situacao = styled.div`
  font-size: 12px;
  color: ${Base.VermelhoAlerta};
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
  text-align: center;
  margin-right: 13px;
  height: 23px;
  padding-top: 3px;
  border: 1px solid ${Base.VermelhoAlerta};

  span {
    margin: 11px;
  }
`;
