import styled from 'styled-components';
import { Upload } from 'antd';
import { Button } from '~/componentes';

export const UploadFullWidth = styled(Upload)`
  width: 100%;

  .ant-upload,
  .ant-upload-select,
  .ant-upload-wrapper {
    display: block !important;
    width: 100% !important;
  }
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
  display: block;
`;

export const FullWidthButton2 = styled(Button)`
  width: 100%;
  display: block;
  justify-content: start !important;
`;

export const StyledModalWrapper = styled.div`
  .ant-modal {
    padding-top: 32px !important;
    z-index: 1050 !important;
  }
  .ant-modal-wrap {
    z-index: 1050 !important;
  }
  .ant-modal-mask {
    z-index: 1050 !important;
  }
  && .ant-modal-header {
    margin-top: 12px;
  }
`;
