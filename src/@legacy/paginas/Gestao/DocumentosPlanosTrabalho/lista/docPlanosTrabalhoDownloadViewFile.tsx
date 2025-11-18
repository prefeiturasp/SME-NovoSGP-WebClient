import ButtonPrimary from '@/components/lib/button/primary';
import Modal from '@/components/lib/modal';

import React, { useState } from 'react';
import { FaFileDownload, FaFilePdf } from 'react-icons/fa';
import { Base } from '~/componentes';
import { SGP_BUTTON_DOWNLOAD_ARQUIVO } from '~/constantes/ids/button';
import { erros } from '~/servicos';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import { downloadBlob, getPDFUrlBlob } from '~/utils';

type DocPlanosTrabalhoDownloadViewFileProps = {
  arquivo: any;
};
const DocPlanosTrabalhoDownloadViewFile: React.FC<DocPlanosTrabalhoDownloadViewFileProps> = ({
  arquivo,
}) => {
  const [src, setSrc] = useState<string>('');

  const onClickDownload = () => {
    ServicoArmazenamento.obterArquivoParaDownload(arquivo?.codigo)
      .then((resposta) => {
        const arquivoEhPDF = resposta?.headers?.['content-type'] === 'application/pdf';

        if (arquivoEhPDF) {
          const url = getPDFUrlBlob(resposta.data);
          setSrc(url);
        } else {
          downloadBlob(resposta.data, arquivo?.nome);
        }
      })
      .catch((e: any) => erros(e));
  };

  const ehPDF = arquivo?.nome?.substr(arquivo?.nome?.length - 4) === '.pdf';

  return (
    <>
      <ButtonPrimary
        id={SGP_BUTTON_DOWNLOAD_ARQUIVO}
        icon={ehPDF ? <FaFilePdf /> : <FaFileDownload />}
        style={{ background: Base.Azul, display: 'flex', alignItems: 'center', gap: 3 }}
        onClick={() => onClickDownload()}
      >
        {`${ehPDF ? 'Visualizar' : 'Download'} arquivo`}
      </ButtonPrimary>

      <Modal
        title="Visualizar PDF"
        centered
        open={!!src}
        onCancel={(e) => {
          e.stopPropagation();
          setSrc('');
        }}
        destroyOnClose
        okButtonProps={{ hidden: true }}
        cancelText="Fechar"
        width="80%"
      >
        <iframe src={src} height="500px" width="100%" />
      </Modal>
    </>
  );
};

export default DocPlanosTrabalhoDownloadViewFile;
