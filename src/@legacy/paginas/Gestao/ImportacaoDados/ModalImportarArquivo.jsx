import { useState, useEffect } from 'react';
import { Label, SelectComponent, Colors, Button } from '~/componentes';
import { Col, Row, Upload } from 'antd';
import api from '~/servicos/api';
import { sucesso } from '~/servicos/alertas';
import styles from './importarDados.module.css';
import { UploadFullWidth, FullWidthButton, FullWidthButton2 } from './importarDados.styled';

function ModalImportarArquivo({ setarModal, resetarLista }) {
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
      } else {
        alert('Seleção inválida.');
        return;
      }

      const resposta = await api.post(url, fmData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      sucesso(resposta.data.mensagem || 'Arquivo importado com sucesso');
      setarModal(false);
      resetarLista((prev) => prev + 1);
    } catch (e) {
      alert(e.message || 'Erro ao enviar arquivo');
    }
  };

  return (
    <>
      <div className={styles.modalTitle}>Importar Arquivo</div>
      <p className={styles.modalDescription}>
        Selecione um item e o ano para fazer a importação do arquivo
      </p>

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
          <UploadFullWidth {...uploadConfig} maxCount={1} showUploadList={false}>
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
