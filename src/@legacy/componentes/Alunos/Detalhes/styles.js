import styled from 'styled-components';
import { Base } from '~/componentes/colors';

const Container = styled.div`
  .ant-card-head {
    min-height: auto;
    padding: 0 0 0 24px;

    .ant-card-head-title {
      padding: 0;
    }
  }
  .anticon {
    vertical-align: middle;
  }
  .fa {
    margin: 0 !important;
  }

  .display-block {
    display: block !important;
  }
`;

const DadosAluno = styled.div`
  width: 100%;
  height: 100%;
  color: #42474a;
  display: flex;
  align-items: center;

  p {
    margin-bottom: 0;
  }
`;

const FrequenciaGlobal = styled.div`
  font-weight: 700 !important;
  text-align: end;
  font-size: 12px !important;
`;

const ContainerAvatar = styled.div`
  cursor: ${props => props.cursor} !important;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px !important;
    height: 80px !important;
    min-width: 80px !important;
  }

  img {
    width: 90px;
    height: 90px;
  }

  i {
    font-size: 45px !important;
  }

  .desc-alterar-imagem {
    font-size: 10px !important;
    color: ${Base.Roxo} !important;
    text-align: center !important;
  }
`;

const ContainerModalUploadImagem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;

  .ant-upload-list-picture-card .ant-upload-list-item {
    width: 360px !important;
    height: 360px !important;
  }

  .ant-upload-list-picture-card-container {
    width: 360px !important;
    height: 360px !important;
    margin: 8px 0px 0px 0px !important;
  }

  .ant-upload.ant-upload-select-picture-card {
    margin-right: 0px;
    margin-bottom: 0px;
  }
`;

export {
  Container,
  DadosAluno,
  FrequenciaGlobal,
  ContainerAvatar,
  ContainerModalUploadImagem,
};
