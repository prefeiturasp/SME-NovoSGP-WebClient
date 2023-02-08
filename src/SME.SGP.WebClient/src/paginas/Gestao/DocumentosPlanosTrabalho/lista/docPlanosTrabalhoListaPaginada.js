import PropTypes from 'prop-types';
import React, { useEffect, useCallback, useState } from 'react';

import * as moment from 'moment';
import { Button, Colors, DataTable, ListaPaginada } from '~/componentes';
import { RotasDto } from '~/dtos';
import { erros, history } from '~/servicos';
import { SGP_BUTTON_DOWNLOAD_ARQUIVO } from '~/constantes/ids/button';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import { downloadBlob } from '~/utils';
import { SGP_TABLE_DOCUMENTOS_PLANOS_TRABALHO } from '~/constantes/ids/table';
import ServicoDocumentosPlanosTrabalho from '~/servicos/Paginas/Gestao/DocumentosPlanosTrabalho/ServicoDocumentosPlanosTrabalho';

const DocPlanosTrabalhoListaPaginada = props => {
  const { form } = props;

  const ueCodigo = form?.values?.ueCodigo;
  const listaUes = form?.values?.listaUes;
  const consideraHistorico = form?.values?.consideraHistorico;
  const anoLetivo = form?.values?.anoLetivo;
  const tipoDocumentoId = form?.values?.tipoDocumentoId;
  const classificacaoId = form?.values?.classificacaoId;
  const listaClassificacoes = form?.values?.listaClassificacoes;

  const [filtros, setFiltros] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState();

  const TIPO_DOCUMENTO = {
    DOCUMENTOS: '2',
  };

  const ehClassificacaoDocumentosTurma = ServicoDocumentosPlanosTrabalho.verificaSeEhClassificacaoDocumentosTurma(
    classificacaoId,
    listaClassificacoes
  );

  const ocultarColunaTurmaComponente =
    (tipoDocumentoId &&
      tipoDocumentoId?.toString() !== TIPO_DOCUMENTO.DOCUMENTOS) ||
    (classificacaoId && !ehClassificacaoDocumentosTurma);

  const formatarCampoDataGrid = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return <span> {dataFormatada}</span>;
  };

  const onClickDownload = arquivo => {
    ServicoArmazenamento.obterArquivoParaDownload(arquivo?.codigo)
      .then(resposta => {
        downloadBlob(resposta.data, arquivo?.nome);
      })
      .catch(e => erros(e));
  };

  const colunas = [
    {
      title: 'Tipo',
      dataIndex: 'tipoDocumento',
    },
    {
      title: 'Cassificação',
      dataIndex: 'classificacao',
    },
    {
      title: 'Usuário',
      dataIndex: 'usuario',
    },
    {
      title: 'Data de inclusão',
      dataIndex: 'data',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  if (!ocultarColunaTurmaComponente) {
    colunas.push({
      title: 'Turma/Componente Curricular',
      dataIndex: 'turmaComponenteCurricular',
    });
  }

  const onClickExpandir = (expandir, linha, qtdAquivos) => {
    if (qtdAquivos === 1) {
      onClickDownload(linha?.arquivos?.[0]);
    } else if (expandir) {
      setExpandedRowKeys({
        documentoId: linha?.documentoId,
      });
    } else {
      setExpandedRowKeys();
    }
  };

  colunas.push({
    title: 'Anexo',
    dataIndex: 'anexo',
    width: '5%',
    render: (_, linha) => {
      const expandido = expandedRowKeys?.documentoId === linha?.documentoId;
      const qtdAquivos = linha?.arquivos?.length;

      let icone = `fas fa-arrow-${expandido ? 'up' : 'down'}`;
      if (qtdAquivos && qtdAquivos > 1) {
        icone = `fas fa-chevron-${expandido ? 'up' : 'down'}`;
      }

      return (
        <Button
          icon={`${icone} ${SGP_BUTTON_DOWNLOAD_ARQUIVO}`}
          label={
            qtdAquivos > 1 ? `Exibir (${qtdAquivos}) anexos` : 'Download anexo'
          }
          color={Colors.Azul}
          className={`text-center ${SGP_BUTTON_DOWNLOAD_ARQUIVO}`}
          onClick={() => onClickExpandir(!expandido, linha, qtdAquivos)}
        />
      );
    },
  });

  const filtrar = useCallback(() => {
    if (ueCodigo && listaUes?.length) {
      const ueSelecionada = listaUes.find(
        item => String(item.codigo) === String(ueCodigo)
      );
      const params = {
        ueId: ueSelecionada?.id || '',
        tipoDocumentoId,
        classificacaoId,
        anoLetivo:anoLetivo
      };
      setFiltros({ ...params });
    } else {
      setFiltros({});
    }
  }, [ueCodigo, tipoDocumentoId, classificacaoId, listaUes]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const onClickEditar = (linha, colunaClicada) => {
    let executarClick = true;
    if (colunaClicada?.target?.className) {
      const clicouNoBotao = colunaClicada.target.className.includes(
        SGP_BUTTON_DOWNLOAD_ARQUIVO
      );
      executarClick = !clicouNoBotao;
    }

    if (executarClick) {
      history.push(
        `${RotasDto.DOCUMENTOS_PLANOS_TRABALHO}/editar/${linha.documentoId}`
      );
    }
  };

  const expandedRowRender = linha => {
    const columnsArquivos = [
      { title: 'Nome', dataIndex: 'nome' },
      {
        title: 'Anexo',
        dataIndex: 'codigo',
        width: '5%',
        render: (_, arquivo) => {
          return (
            <Button
              icon="fas fa-arrow-down"
              label="Download anexo"
              color={Colors.Azul}
              className="text-center"
              onClick={() => onClickDownload(arquivo)}
            />
          );
        },
      },
    ];
    const arquivos = linha?.arquivos;
    return (
      <DataTable
        idLinha="codigo"
        columns={columnsArquivos}
        dataSource={arquivos}
        pagination={false}
        semHover
      />
    );
  };

  return filtros?.ueId ? (
    <ListaPaginada
      url="v1/armazenamento/documentos"
      id={SGP_TABLE_DOCUMENTOS_PLANOS_TRABALHO}
      colunaChave="documentoId"
      colunas={colunas}
      filtro={filtros}
      onClick={(linha, colunaClicada) => onClickEditar(linha, colunaClicada)}
      filtroEhValido={!!filtros?.ueId}
      expandedRowKeys={
        expandedRowKeys?.documentoId ? [expandedRowKeys.documentoId] : []
      }
      expandIcon={() => ''}
      expandedRowRender={expandedRowRender}
    />
  ) : (
    <></>
  );
};

DocPlanosTrabalhoListaPaginada.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
};

DocPlanosTrabalhoListaPaginada.defaultProps = {
  form: null,
};

export default DocPlanosTrabalhoListaPaginada;
