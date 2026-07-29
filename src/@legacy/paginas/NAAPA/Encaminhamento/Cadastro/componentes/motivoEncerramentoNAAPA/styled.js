import styled from 'styled-components';
import { Base } from '~/componentes';

export const JustificativaEncerramentoNAAPA = styled.div`
  font-size: 14px;
  color: ${Base.CinzaMako};
  border: 1px ${Base.CinzaDesabilitado} solid;
  margin-top: 24px;
  margin-bottom: 8px;
`;

export const HeaderJustificativaEncerramentoNAAPA = styled.div`
  background-color: ${Base.CinzaFundo};
  font-weight: 700;
  height: 39px;
  border-bottom: 1px ${Base.CinzaDesabilitado} solid;
  display: flex;
  align-items: center;
  padding-left: 14px;
`;

export const BodyJustificativaEncerramentoNAAPA = styled.div`
  background-color: ${Base.Branco};
  font-weight: 400;
  min-height: 56px;
  display: flex;
  align-items: center;
  padding: 15px 11px;
`;
