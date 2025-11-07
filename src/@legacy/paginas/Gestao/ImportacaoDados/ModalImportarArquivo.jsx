import { useState, useEffect } from 'react';
import { Label, SelectComponent, Colors, Button } from '~/componentes';
import { Col, Modal, Row, Upload } from 'antd';
import api from '~/servicos/api';
import { sucesso } from '~/servicos/alertas';
import styles from './importarDados.module.css';
import { UploadFullWidth, FullWidthButton, FullWidthButton2 } from './importarDados.styled';
import { Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

function ModalImportarArquivo({ setarModal, resetarLista, abrirDrawer }) {
  const [valor, setarValor] = useState(null);
  const [ano, setarAno] = useState('');
  const [periodo, setarPeriodo] = useState(null);
  const [listaAnos, setListaAnos] = useState([]);

  useEffect(() => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    let id = 1;

    for (let a = anoAtual; a >= 2019 && anos.length < 10; a--) {
      anos.push({ id: id++, nome: String(a) });
    }

    setListaAnos(anos);
  }, []);

  const listaTiposImportacao = [
    { id: 'IDEB', nome: 'Índice de Desenvolvimento da Educação Básica [IDEB]' },
    { id: 'IDEP', nome: 'Índice de Desenvolvimento da Educação Paulistana [IDEP]' },
    { id: 'PROFICIENCIA_IDEB', nome: 'Proficiência IDEB' },
    { id: 'PROFICIENCIA_IDEP', nome: 'Proficiência IDEP' },
    { id: 'BOLETIM_IDEB', nome: 'Boletim IDEB' },
    { id: 'BOLETIM_IDEP', nome: 'Boletim IDEP' },
    { id: 'FLUENCIA', nome: 'Fluência Leitora' },
    { id: 'TAXA_ALFABETIZACAO', nome: 'Taxa de alfabetização' },
  ];

  const listaPeriodos = [
    { id: 'ENTRADA', nome: 'Avaliação de entrada' },
    { id: 'SAIDA', nome: 'Avaliação de saída' },
  ];

  const [arquivoSelecionado, setarArquivoSelecionado] = useState(null);
  const [erroArquivo, setarErroArquivo] = useState(null);

  const isBoletim = valor === 'BOLETIM_IDEB' || valor === 'BOLETIM_IDEP';

  const uploadConfig = {
    beforeUpload: (file, fileList) => {
      if (isBoletim) {
        const isPdf = file.type === 'application/pdf';
        if (!isPdf) {
          setarErroArquivo('Formato Inválido: Anexe apenas arquivos .pdf');
          return Upload.LIST_IGNORE;
        }
        if (fileList.length > 100) {
          setarErroArquivo('Você pode selecionar no máximo 100 arquivos.');
          return Upload.LIST_IGNORE;
        }
        setarErroArquivo('');
        setarArquivoSelecionado((prev) => {
          const files = prev ? [...prev] : [];
          if (!files.find((f) => f.name === file.name && f.lastModified === file.lastModified)) {
            files.push(file);
          }
          return files.slice(0, 100);
        });
      } else {
        const isXlsx =
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXlsx) {
          setarErroArquivo('Formato Inválido: Anexe um arquivo .xlsx');
          setarArquivoSelecionado(null);
        } else {
          setarErroArquivo('');
          setarArquivoSelecionado(file);
        }
      }
      return false;
    },
    onRemove: (file) => {
      if (isBoletim) {
        setarArquivoSelecionado((prev) => (prev ? prev.filter((f) => f.uid !== file.uid) : []));
      } else {
        setarArquivoSelecionado(null);
      }
    },
    multiple: isBoletim,
    maxCount: isBoletim ? 100 : 1,
    accept: isBoletim ? '.pdf' : '.xlsx',
    showUploadList: isBoletim
      ? {
          showRemoveIcon: true,
          showPreviewIcon: false,
          showDownloadIcon: false,
          removeIcon: undefined,
        }
      : false,
  };

  const handleSubmit = async () => {
    if (
      !arquivoSelecionado ||
      (isBoletim && (!Array.isArray(arquivoSelecionado) || arquivoSelecionado.length === 0))
    ) {
      alert('Selecione um arquivo antes de enviar.');
      return;
    }

    if (!valor || !ano) {
      alert('Selecione o tipo e o ano antes de enviar.');
      return;
    }

    if (valor === 'FLUENCIA' && !['ENTRADA', 'SAIDA'].includes(periodo)) {
      alert('Selecione um período válido (entrada ou saída).');
      return;
    }

    const anoSelecionado = listaAnos.find((a) => a.id === Number(ano));
    if (!anoSelecionado) {
      alert('Ano inválido.');
      return;
    }
    const anoNum = String(anoSelecionado.nome);

    try {
      const fmData = new FormData();
      let url = '';
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      fmData.append('anoLetivo', encodeURIComponent(anoNum));

      if (isBoletim) {
        arquivoSelecionado.forEach((file) => {
          fmData.append('boletins', file);
        });
        fmData.append('FileName', arquivoSelecionado[0].name);
      } else {
        fmData.append('arquivo', arquivoSelecionado);
        fmData.append('FileName', arquivoSelecionado.name);
      }

      const urlMap = {
        IDEP: 'v1/importar-arquivo/idep',
        IDEB: 'v1/importar-arquivo/ideb',
        BOLETIM_IDEB: 'v1/importar-arquivo/boletim-ideb',
        BOLETIM_IDEP: 'v1/importar-arquivo/boletim-idep',
        PROFICIENCIA_IDEP: 'v1/importar-arquivo/proficiencia-idep',
        PROFICIENCIA_IDEB: 'v1/importar-arquivo/proficiencia-ideb',
        TAXA_ALFABETIZACAO: 'v1/importar-arquivo/alfabetizacao',
      };

      if (valor === 'FLUENCIA') {
        if (!periodo || !['ENTRADA', 'SAIDA'].includes(periodo)) {
          alert('Selecione um período válido (entrada ou saída).');
          return;
        }
        url = 'v1/importar-arquivo/fluencia-leitora';
        const nomePeriodo = periodo === 'ENTRADA' ? 1 : 2;
        fmData.append('periodo', nomePeriodo);
      } else if (urlMap[valor]) {
        url = urlMap[valor];
        if (isBoletim) {
          url += `?ano=${encodeURIComponent(anoNum)}`;
        }
      } else {
        alert('Seleção inválida.');
        return;
      }

      const resposta = await api.post(url, fmData, config);

      setarModal(false);
      resetarLista((prev) => prev + 1);

      Modal.success({
        icon: null,
        width: 420,
        centered: true,
        content: (
          <div className={styles.modalSucessContainer}>
            <CheckCircleOutlined className={styles.modalSucessIcon} />
            <h2 className={styles.modalSucessTitle}>Arquivo importado com sucesso!</h2>
            <p className={styles.modalSucessMessage}>
              Para verificar possíveis inconsistências, clique em Conferir registros ou selecione o
              carregamento na lista de importações.
            </p>
            <div className={styles.modalSucessActions}>
              <Button
                label={'Conferir registros'}
                color={Colors.Roxo}
                onClick={() => {
                  abrirDrawer({
                    id: resposta.data.id,
                    nomeArquivo: isBoletim
                      ? arquivoSelecionado.map((f) => f.name).join(', ')
                      : arquivoSelecionado.name,
                  });
                  Modal.destroyAll();
                }}
              />
              <Button
                label={'Fechar'}
                color={Colors.Roxo}
                border
                bold
                onClick={() => Modal.destroyAll()}
              />
            </div>
          </div>
        ),
        okButtonProps: { style: { display: 'none' } },
      });
    } catch (e) {
      Modal.error({
        icon: null,
        className: styles.modalError,
        width: 420,
        centered: true,
        content: (
          <div className={styles.modalErrorContainer}>
            <CloseCircleOutlined className={styles.modalErrorIcon} />
            <h2 className={styles.modalErrorTitle}>Desculpe!</h2>
            <p className={styles.modalErrorMessage}>
              {
                'Parece que houve um problema ao importar o arquivo. Por favor, tente novamente mais tarde.'
              }
            </p>
            <div className={styles.modalErrorActions}>
              <Button
                border
                bold
                label={'Fechar'}
                color={Colors.Roxo}
                onClick={() => Modal.destroyAll()}
              />
            </div>
          </div>
        ),
        okButtonProps: { style: { display: 'none' } },
      });
    }
  };

  return (
    <>
      <div className={styles.modalTitle}>Importar arquivo</div>

      <Text className={styles.textoSelecione}>
        Selecione um item e o ano para fazer a importação do arquivo.
      </Text>

      <SelectComponent
        className={styles.select}
        id="tipo"
        label="Selecione um item"
        lista={listaTiposImportacao}
        valueOption="id"
        valueText="nome"
        onChange={(e) => {
          setarValor(e),
            setarAno(),
            setarPeriodo(null),
            setarErroArquivo(''),
            setarArquivoSelecionado(null);
        }}
        valueSelect={valor}
        placeholder="Selecione"
      />

      {valor && (
        <SelectComponent
          className={styles.select}
          id="ano"
          label="Selecione ou digite o ano"
          lista={listaAnos}
          valueOption="id"
          valueText="nome"
          onChange={(e) => {
            setarAno(e);
          }}
          valueSelect={ano}
          placeholder="Selecione"
          showSearch
        />
      )}

      {valor === 'FLUENCIA' && ano && (
        <SelectComponent
          className={styles.select}
          id="periodos"
          label="Selecione o período da avaliação"
          lista={listaPeriodos}
          valueOption="id"
          valueText="nome"
          onChange={(e) => {
            setarPeriodo(e);
          }}
          valueSelect={periodo}
          placeholder="Selecione"
          showSearch
        />
      )}

      {valor && ano && (
        <div className={styles.uploadWrapper}>
          {isBoletim ? (
            <UploadFullWidth
              {...uploadConfig}
              multiple
              fileList={
                arquivoSelecionado
                  ? arquivoSelecionado.map((file, idx) => {
                      return {
                        ...file,
                        uid: file.uid || `${file.name || 'arquivo'}-${file.lastModified || idx}`,
                        name:
                          file.name ||
                          (file.originFileObj && file.originFileObj.name) ||
                          `Arquivo ${idx + 1}`,
                        status: 'done',
                      };
                    })
                  : []
              }
              onRemove={(file) => {
                setarArquivoSelecionado((prev) =>
                  prev
                    ? prev.filter((f) => (f.uid || `${f.name}-${f.lastModified}`) !== file.uid)
                    : [],
                );
              }}
              itemRender={(originNode, file) => (
                <div
                  className={styles.selectedFileItem}
                  style={{ display: isBoletim ? 'none' : 'flex' }}
                >
                  <span className={styles.selectedFileName}>{file.name || 'Arquivo sem nome'}</span>
                </div>
              )}
            >
              <Label text="Selecione até 100 arquivos (.pdf)" />
              {arquivoSelecionado &&
                Array.isArray(arquivoSelecionado) &&
                arquivoSelecionado.length > 0 && (
                  <div className={styles.selectedFilesList}>
                    {arquivoSelecionado.map((file, idx) => (
                      <div
                        className={`${styles.selectedFileItem} ${styles.selectedFileItemHover}`}
                        key={file.uid || `${file.name}-${file.lastModified || idx}`}
                        style={{ display: 'flex' }}
                      >
                        <span className={styles.selectedFileName}>
                          {file.name || `Arquivo ${idx + 1}`}
                        </span>
                        <DeleteOutlined
                          className={styles.selectedFileRemoveIcon}
                          title="Remover arquivo"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setarArquivoSelecionado((prev) =>
                              prev
                                ? prev.filter(
                                    (f) =>
                                      (f.uid || `${f.name}-${f.lastModified}`) !==
                                      (file.uid || `${file.name}-${file.lastModified}`),
                                  )
                                : [],
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              <Row gutter={[4, 4]} style={{ width: '100%' }}>
                <Col span={24}>
                  <FullWidthButton
                    label="Escolher Arquivos"
                    icon="upload"
                    color={Colors.Roxo}
                    border
                  />
                </Col>
              </Row>
            </UploadFullWidth>
          ) : (
            <UploadFullWidth {...uploadConfig} multiple={false}>
              <Label text="Selecione um arquivo (.xlsx)" />
              <Row gutter={[4, 4]} style={{ width: '100%' }}>
                <Col span={16}>
                  <FullWidthButton2
                    block
                    label={
                      arquivoSelecionado ? arquivoSelecionado.name : 'Nenhum arquivo selecionado'
                    }
                    color={Colors.CinzaBotao}
                    border
                  />
                </Col>
                <Col span={8}>
                  <FullWidthButton
                    label="Escolher Arquivo"
                    icon="upload"
                    color={Colors.Roxo}
                    border
                  />
                </Col>
              </Row>
            </UploadFullWidth>
          )}
          {erroArquivo && <div className={styles.errorMessage}>{erroArquivo}</div>}
        </div>
      )}
      <Row gutter={[8, 8]} type="flex" className={styles.footerRow}>
        <Col>
          <Button
            label={'Cancelar'}
            color={Colors.Roxo}
            onClick={() => setarModal(false)}
            border
            bold
          />
        </Col>
        <Col>
          <Button
            icon="upload"
            disabled={
              !(
                valor &&
                ano &&
                arquivoSelecionado &&
                (valor !== 'FLUENCIA' || ['ENTRADA', 'SAIDA'].includes(periodo))
              )
            }
            label={'Importar Arquivo'}
            color={Colors.Roxo}
            onClick={handleSubmit}
            bold
          />
        </Col>
      </Row>
    </>
  );
}

export default ModalImportarArquivo;
