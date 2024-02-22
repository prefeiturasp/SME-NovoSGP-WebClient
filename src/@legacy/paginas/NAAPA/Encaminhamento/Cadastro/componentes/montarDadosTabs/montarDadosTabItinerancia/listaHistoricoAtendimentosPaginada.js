/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Button, Colors, DataTable, ListaPaginada } from '~/componentes';
import { SGP_TABLE_HISTORICO_ATENDIMENTO } from '~/constantes/ids/table';
import { Titulo } from './style';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import ItineranciaNAAPADownloadViewFile from '../itineranciaNAAPADownloadViewFile';
import { SGP_BUTTON_DOWNLOAD_ARQUIVO } from '~/constantes/ids/button';

const ListaHistoricoAtendimentosPaginada = ({
  atualizarTabela,
  setAtendimentoId,
}) => {
  const { id } = useParams();

  const [filtros, setFiltros] = useState();

  const [expandedRowKeys, setExpandedRowKeys] = useState();

  const encaminhamentoNAAPAId = id;

  const filtroEhValido = !!encaminhamentoNAAPAId;

  const colunas = [
    {
      title: 'Data',
      dataIndex: 'dataAtendimento',
      render: data => (data ? window.moment(data).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
    },
    {
      title: 'Usuário',
      render: (_, dadosLinha) =>
        `${dadosLinha?.auditoria?.criadoPor} (${dadosLinha?.auditoria?.criadoRF})`,
    },
  ];

  colunas.push({
    title: 'Anexo',
    dataIndex: 'anexo',
    width: '5%',
    render: (_, linha) => {
      const qtdAquivos = linha?.arquivos?.length ?? 0;
      if (qtdAquivos > 1) {
        const expandido = expandedRowKeys?.id === linha?.auditoria.id;
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
      if (qtdAquivos === 0) return <></>;
      return (
        <ItineranciaNAAPADownloadViewFile arquivo={linha?.arquivos?.[0]} />
      );
    },
  });

  const onClickExpandir = (expandir, linha, qtdAquivos) => {
    if (qtdAquivos > 1 && expandir) {
      setExpandedRowKeys({
        id: linha?.auditoria.id,
      });
    } else {
      setExpandedRowKeys();
    }
  };

  const onClickLinha = (linha, colunaClicada) => {
    const executarClick =
      colunaClicada?.target?.id === SGP_BUTTON_DOWNLOAD_ARQUIVO ||
      colunaClicada?.target?.parentElement?.id === SGP_BUTTON_DOWNLOAD_ARQUIVO;
    if (!executarClick) setAtendimentoId(linha?.auditoria?.id);
  };

  const filtrar = useCallback(() => {
    const params = {
      encaminhamentoId: encaminhamentoNAAPAId,
    };

    setFiltros({ ...params });
  }, [atualizarTabela]);

  useEffect(() => {
    if (atualizarTabela) {
      filtrar();
    }
  }, [atualizarTabela, filtrar]);

  const exibirTabela = true;

  const expandedRowRender = linha => {
    const columnsArquivos = [
      { title: 'Nome', dataIndex: 'nome' },
      {
        title: 'Anexo',
        dataIndex: 'codigo',
        width: '5%',
        render: (_, arquivo) => (
          <ItineranciaNAAPADownloadViewFile arquivo={arquivo} />
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
  return exibirTabela ? (
    <>
      <Titulo>Histórico dos atendimentos</Titulo>

      <ListaPaginada
        filtro={filtros}
        colunas={colunas}
        filtroEhValido={filtroEhValido}
        id={SGP_TABLE_HISTORICO_ATENDIMENTO}
        onClick={(linha, colunaClicada) => onClickLinha(linha, colunaClicada)}
        expandedRowKeys={expandedRowKeys?.id ? [expandedRowKeys.id] : []}
        expandedRowRender={expandedRowRender}
        mapearNovoDto={data => {
          return data?.length
            ? data.map(linha => {
                return {
                  ...linha,
                  id: linha?.auditoria.id,
                };
              })
            : [];
        }}
        url={`v1/encaminhamento-naapa/${encaminhamentoNAAPAId}/secoes-itinerancia`}
        setLista={(dadosNovos, dadosAntigos) => {
          const excluidoUltimoRegistro = !dadosNovos?.length;

          const inseridoPrimeiroRegistro =
            !dadosAntigos?.length && dadosNovos?.length === 1;

          const obterNovaSituacao =
            atualizarTabela &&
            (excluidoUltimoRegistro || inseridoPrimeiroRegistro);

          if (obterNovaSituacao) {
            ServicoNAAPA.obterSituacaoEncaminhamento(encaminhamentoNAAPAId);
          }
        }}
      />
    </>
  ) : (
    <></>
  );
};

ListaHistoricoAtendimentosPaginada.propTypes = {
  atualizarTabela: PropTypes.bool,
  setAtendimentoId: PropTypes.func,
};

ListaHistoricoAtendimentosPaginada.defaultProps = {
  setAtendimentoId: () => null,
  atualizarTabela: false,
};

export default ListaHistoricoAtendimentosPaginada;
