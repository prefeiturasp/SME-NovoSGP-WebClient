import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { ROUTES } from '@/core/enum/routes';
import * as moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Button, Colors, DataTable, ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_BUTTON_DOWNLOAD_ARQUIVO } from '~/constantes/ids/button';
import { SGP_TABLE_DOCUMENTOS_PLANOS_TRABALHO } from '~/constantes/ids/table';
import ServicoDocumentosPlanosTrabalho from '~/servicos/Paginas/Gestao/DocumentosPlanosTrabalho/ServicoDocumentosPlanosTrabalho';
import DocPlanosTrabalhoDownloadViewFile from './docPlanosTrabalhoDownloadViewFile';

const DocPlanosTrabalhoListaPaginada = props => {
  const { form } = props;
  const navigate = useNavigate();

  const dreCodigo = form?.values?.dreCodigo;
  const ueCodigo = form?.values?.ueCodigo;
  const listaDres = form?.values?.listaDres;
  const listaUes = form?.values?.listaUes;
  const anoLetivo = form?.values?.anoLetivo;
  const tipoDocumentoId = form?.values?.tipoDocumentoId;
  const classificacaoId = form?.values?.classificacaoId;
  const listaClassificacoes = form?.values?.listaClassificacoes;

  const [filtros, setFiltros] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState();

  const TIPO_DOCUMENTO = {
    DOCUMENTOS: '2',
  };

  const ehClassificacaoDocumentosTurma =
    ServicoDocumentosPlanosTrabalho.verificaSeEhClassificacaoDocumentosTurma(
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
      render: usuario => (
        <div
          style={{ minWidth: '200px', maxWidth: '400px', whiteSpace: 'normal' }}
        >
          {usuario}
        </div>
      ),
    },
    {
      title: 'Data de inclusão',
      dataIndex: 'data',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  if (ueCodigo && ueCodigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'UE',
      dataIndex: 'siglaNomeUe',
      render: siglaNomeUe => (
        <div
          style={{ minWidth: '200px', maxWidth: '400px', whiteSpace: 'normal' }}
        >
          {siglaNomeUe}
        </div>
      ),
    });
  }

  if (dreCodigo && dreCodigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'DRE',
      dataIndex: 'abreviacaoDre',
      render: nomeDre => (
        <div
          style={{ minWidth: '200px', maxWidth: '400px', whiteSpace: 'normal' }}
        >
          {nomeDre}
        </div>
      ),
    });
  }

  if (!ocultarColunaTurmaComponente) {
    colunas.push({
      title: 'Turma/Componente Curricular',
      dataIndex: 'turmaComponenteCurricular',
    });
  }

  const onClickExpandir = (expandir, linha, qtdAquivos) => {
    if (qtdAquivos > 1 && expandir) {
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
      const qtdAquivos = linha?.arquivos?.length;

      if (qtdAquivos > 1) {
        const expandido = expandedRowKeys?.documentoId === linha?.documentoId;

        let icone = `fas fa-arrow-${expandido ? 'up' : 'down'}`;
        if (qtdAquivos && qtdAquivos > 1) {
          icone = `fas fa-chevron-${expandido ? 'up' : 'down'}`;
        }

        return (
          <Button
            id={SGP_BUTTON_DOWNLOAD_ARQUIVO}
            icon={icone}
            label={`Expandir (${qtdAquivos}) arquivos`}
            color={Colors.Azul}
            className="text-center"
            onClick={() => {
              onClickExpandir(!expandido, linha, qtdAquivos);
            }}
          />
        );
      }

      return (
        <DocPlanosTrabalhoDownloadViewFile arquivo={linha?.arquivos?.[0]} />
      );
    },
  });

  const filtrar = useCallback(() => {
    if (ueCodigo && listaUes?.length) {
      const dreSelecionada = listaDres.find(
        item => String(item.codigo) === String(dreCodigo)
      );

      const ueSelecionada = listaUes.find(
        item => String(item.codigo) === String(ueCodigo)
      );

      const params = {
        anoLetivo,
        dreId: dreSelecionada?.id || '',
        ueId: ueSelecionada?.id || '',
        tipoDocumentoId,
        classificacaoId,
      };
      setFiltros({ ...params });
    } else {
      setFiltros({});
    }
  }, [
    ueCodigo,
    dreCodigo,
    tipoDocumentoId,
    classificacaoId,
    listaDres,
    listaUes,
  ]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const onClickEditar = (linha, colunaClicada) => {
    let executarClick = true;

    if (
      colunaClicada?.target?.id === SGP_BUTTON_DOWNLOAD_ARQUIVO ||
      colunaClicada?.target?.parentElement?.id === SGP_BUTTON_DOWNLOAD_ARQUIVO
    ) {
      executarClick = false;
    }

    if (executarClick) {
      navigate(
        `${ROUTES.DOCUMENTOS_PLANOS_TRABALHO}/editar/${linha.documentoId}`
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
        render: (_, arquivo) => (
          <DocPlanosTrabalhoDownloadViewFile arquivo={arquivo} />
        ),
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

  return filtros?.anoLetivo ? (
    <ListaPaginada
      url="v1/armazenamento/documentos"
      id={SGP_TABLE_DOCUMENTOS_PLANOS_TRABALHO}
      colunaChave="documentoId"
      colunas={colunas}
      filtro={filtros}
      onClick={(linha, colunaClicada) => onClickEditar(linha, colunaClicada)}
      filtroEhValido={!!filtros?.anoLetivo}
      expandedRowKeys={
        expandedRowKeys?.documentoId ? [expandedRowKeys.documentoId] : []
      }
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
