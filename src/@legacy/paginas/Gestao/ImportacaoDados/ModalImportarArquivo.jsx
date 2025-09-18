import { useState, useEffect } from 'react';
import { Label, SelectComponent, Colors, Button } from '~/componentes';
import { Col, Modal, Row, Upload } from 'antd';
import api from '~/servicos/api';
import { sucesso } from '~/servicos/alertas';
import styles from './importarDados.module.css';
import { UploadFullWidth, FullWidthButton, FullWidthButton2 } from './importarDados.styled';
import { Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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

  const listaOpcoes = [
    { id: 'IDEP', nome: 'Índice de Desenvolvimento da Educação Paulistana [IDEP]' },
    { id: 'IDEB', nome: 'Índice de Desenvolvimento da Educação Básica [IDEB]' },
    { id: 'FLUENCIA', nome: 'Fluência Leitora' },
    { id: 'TAXA_ALFABETIZACAO', nome: 'Taxa de alfabetização' },
  ];

  const listaPeriodos = [
    { id: 'ENTRADA', nome: 'Avaliação de entrada' },
    { id: 'SAIDA', nome: 'Avaliação de saída' },
  ];

  const [arquivoSelecionado, setarArquivoSelecionado] = useState(null);
  const [erroArquivo, setarErroArquivo] = useState(null);

  const uploadConfig = {
    beforeUpload: (file) => {
      const isXlsx =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (!isXlsx) {
        setarErroArquivo(`Formato Inválido: Anexe um arquivo .xlsx`);
        setarArquivoSelecionado(null);
      } else {
        setarErroArquivo('');
        setarArquivoSelecionado(file);
      }

      return false;
    },
    onChange: () => {},
  };

  const handleSubmit = async () => {
    if (!arquivoSelecionado) {
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
    const anoNum = Number(anoSelecionado.nome);

    try {
      const fmData = new FormData();
      fmData.append('arquivo', arquivoSelecionado);
      fmData.append('FileName', arquivoSelecionado.name);
      fmData.append('anoLetivo', anoNum);

      let url = '';
      if (valor === 'IDEP') {
        url = 'v1/importar-arquivo/idep';
      } else if (valor === 'IDEB') {
        url = 'v1/importar-arquivo/ideb';
      } else if (valor === 'FLUENCIA') {
        if (!periodo || !['ENTRADA', 'SAIDA'].includes(periodo)) {
          alert('Selecione um período válido (entrada ou saída).');
          return;
        }
        url = 'v1/importar-arquivo/fluencia-leitora';
        const nomePeriodo = periodo === 'ENTRADA' ? 'avaliacao de entrada' : 'avaliacao de saida';
        fmData.append('periodo', nomePeriodo);
      } else if (valor === 'TAXA_ALFABETIZACAO') {
        url = 'v1/importar-arquivo/taxa-alfabetizacao';
      } else {
        alert('Seleção inválida.');
        return;
      }

      const resposta = await api.post(url, fmData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
                  abrirDrawer({ id: resposta.data.id, nomeArquivo: arquivoSelecionado.name });
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
        lista={listaOpcoes}
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
          <UploadFullWidth {...uploadConfig} maxCount={1} accept=".xlsx" showUploadList={false}>
            <Label text="Selecione um arquivo (.xlsx)" />
            <Row gutter={[4, 4]} style={{ width: '100%' }}>
              <Col span={16}>
                <FullWidthButton2
                  block
                  label={
                    arquivoSelecionado ? `${arquivoSelecionado.name}` : 'Nenhum arquivo selecionado'
                  }
                  color={Colors.CinzaBotao}
                  border
                />
              </Col>
              <Col span={8}>
                <FullWidthButton
                  label={'Escolher Arquivo'}
                  icon="upload"
                  color={Colors.Roxo}
                  border
                />
              </Col>
            </Row>
          </UploadFullWidth>

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
