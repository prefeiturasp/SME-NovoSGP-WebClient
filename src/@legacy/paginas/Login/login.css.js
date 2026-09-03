import styled from 'styled-components';
import LinkRouter from '~/componentes/linkRouter';
import Row from '~/componentes/row';
import Card from '~/componentes/cardBootstrap';
import { Base } from '~/componentes/colors';
import CardBody from '~/componentes/cardBody';

export const Fundo = styled(Row)`
  background: url('/imagens/ImagemSondagemLogin.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: -moz-available;
  height: -webkit-fill-available;
  height: fill-available;
  position: relative;
`;

export const Logo = styled.img`
  align-self: center;
  justify-self: center;
`;

export const Formulario = styled.div`
  align-self: center;
  justify-self: center;
  padding: 0px;
`;

export const LogoSGP = styled.div`
  padding: 0px;
`;

export const CampoTexto = styled.input`
  ::-webkit-input-placeholder {
    font-size: 14px !important;
    font-family: Roboto !important;
    font-size: 14px !important;
    font-weight: normal !important;
    font-style: normal !important;
    font-stretch: normal !important;
    line-height: 1.6 !important;
    letter-spacing: normal !important;
    color: ${Base.CinzaBotao} !important;
  }
  ::-moz-placeholder {
    font-size: 14px !important;
  }
  :-ms-input-placeholder {
    font-size: 14px !important;
  }
  :-moz-placeholder {
    font-size: 14px !important;
  }
`;

export const Rotulo = styled.label`
  font-family: Roboto !important;
  font-size: 14px !important;
  font-weight: normal !important;
  font-style: normal !important;
  font-stretch: normal !important;
  line-height: normal !important;
  letter-spacing: normal !important;
  color: ${Base.CinzaMako} !important;
`;

export const LogoSP = styled(LogoSGP)`
  align-self: end;
  justify-self: center;
  justify-content: center;
  justify-items: center;
`;

export const Cartao = styled(Card)`
  height: auto;
  border-radius: 6px;
  -webkit-font-feature-settings: 'tnum';
  font-feature-settings: 'tnum', 'tnum';
  background: #fff;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  z-index: 20;
`;

export const CorpoCartao = styled(CardBody)`
  display: flex;
  height: 100%;
  justify-content: center;
`;

export const Centralizar = styled.div`
  display: flex;
  justify-content: center;
`;

export const Link = styled(LinkRouter)`
  justify-self: center;
  justify-content: center;
  justify-items: center;
`;

export const LabelLink = styled.label`
  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  color: ${Base.Roxo} !important;
  cursor: pointer;
`;

export const ErroTexto = styled.label`
  font-family: Roboto;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  color: ${Base.Vermelho};
  padding-left: 5px;
  margin-top: 5px;
  margin-bottom: 0px;
`;

export const ErroGeral = styled.h2`
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.28px;
  color: ${Base.Vermelho};
  border-radius: 4px;
  border: solid 2px ${Base.Vermelho};
  padding: 1rem;
  text-align: center;
`;

export const MensagemMobile = styled.div`
  font-size: 18px;
  color: ${Base.Vermelho};
  border: 2px solid ${Base.Vermelho};
  border-radius: 4px;
  padding: 10px;
  margin: 50px 0 50px 0;
`;

export const TextoAjuda =
  'Digite seu RF. Para usuários externos, insira seus dados de usuário. Caso não possua, procure a SME.';

export const FundoSondagem = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const PainelImagemSondagem = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

export const BannerSondagem = styled.div`
  position: absolute;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);
  width: calc(50% - 48px);
  max-width: 860px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 20px;
  padding: 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
  z-index: 10;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);

  > img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 1400px) {
    width: calc(50% - 32px);
    padding: 20px 28px;
  }

  @media (max-width: 1200px) {
    width: calc(50% - 24px);
    padding: 18px 20px;
  }

  @media (max-width: 991px) {
    display: none;
  }

  button {
    background: #ffffff;
    border: 1px solid #5170ff;
    color: #5170ff;
    border-radius: 4px;
    padding: 10px 32px;
    font-size: 15px;
    font-family: Roboto;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f0f3ff;
    }
  }
`;
