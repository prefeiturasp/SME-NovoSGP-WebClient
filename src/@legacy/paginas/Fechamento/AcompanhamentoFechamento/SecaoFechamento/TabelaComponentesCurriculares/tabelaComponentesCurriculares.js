import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  faAngleDown,
  faAngleUp,
  faLevelUpAlt,
} from '@fortawesome/free-solid-svg-icons';

import { Base, Button, Colors, DataTable, Loader } from '~/componentes';

import { statusAcompanhamentoFechamento } from '~/dtos';
import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';

import { RenderizarHtml } from '../RenderizarHtml';
import {
  MarcadorTriangulo,
  TextoEstilizado,
  IconeEstilizado,
} from '../../acompanhamentoFechamento.css';
import { LinhaTabela, IconeSeta } from './tabelaComponentesCurriculares.css';
import { Table } from 'antd';

const TabelaComponentesCurriculares = ({
  dadosComponentesCurriculares,
  turmaId,
  bimestre,
}) => {
  const [carregandoComponentes, setCarregandoComponentes] = useState(false);
  const [carregandoDetalhePendencia, setCarregandoDetalhePendencia] =
    useState(false);
  const [dadosPendencias, setDadosPendencias] = useState([]);
  const [dadosDetalhePendencias, setDadosDetalhePendencias] = useState([]);
  const [linhasExpandidasPendencia, setLinhasExpandidasPendencia] = useState(
    []
  );
  const [dadosComCores, setDadosComCores] = useState([]);
  const [mostrarDetalhePendencia, setMostrarDetalhePendencia] = useState(false);
  const [detalhePendenciaEscolhido, setDetalhePendenciaEscolhido] = useState();

  const STATUS_EM_PROCESSAMENTO = 1;

  const obterCorSituacaoFechamento = situacaoFechamentoCodigo => {
    const colors = Object.keys(statusAcompanhamentoFechamento)
      .map(
        item =>
          statusAcompanhamentoFechamento[item].id ===
            situacaoFechamentoCodigo && statusAcompanhamentoFechamento[item].cor
      )
      .filter(item => item);

    if (colors?.length) {
      return colors.reduce(item => item);
    }

    return '';
  };

  const montarDadosComCores = useCallback(dados => {
    const novoMap = dados.map(item => {
      const cor =
        item.situacaoFechamentoCodigo !== STATUS_EM_PROCESSAMENTO
          ? obterCorSituacaoFechamento(item.situacaoFechamentoCodigo)
          : statusAcompanhamentoFechamento.NAO_INICIADO.cor;
      return { ...item, cor };
    });
    setDadosComCores(novoMap);
  }, []);

  const temLinhaExpandida = dados =>
    linhasExpandidasPendencia.filter(item => String(item) === String(dados));

  useEffect(() => {
    if (dadosComponentesCurriculares?.length) {
      montarDadosComCores(dadosComponentesCurriculares);
    } else {
      setDadosComCores([]);
    }
  }, [dadosComponentesCurriculares, montarDadosComCores]);

  const colunasTabelaComponentesCurriculares = [
    {
      title: 'Componentes curriculares',
      dataIndex: 'descricao',
      align: 'left',
    },
    {
      title: 'Professor',
      dataIndex: 'professor',
      align: 'left',
    },
    Table.EXPAND_COLUMN,
  ];

  const obterDetalhePendencia = async dadosLinha => {
    let dados = [];
    let dadosResposta = [];
    let mostrarPendencia = false;
    setCarregandoDetalhePendencia(true);

    const resposta =
      await ServicoAcompanhamentoFechamento.obterDetalhePendencia(
        dadosLinha?.tipoPendencia,
        dadosLinha?.pendenciaId
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDetalhePendencia(false));

    if (resposta?.data) {
      mostrarPendencia = true;
      dados = dadosLinha;
      dadosResposta = resposta.data;
    }

    setDadosDetalhePendencias(dadosResposta);
    setDetalhePendenciaEscolhido(dados);
    setMostrarDetalhePendencia(mostrarPendencia);
  };

  const onClickExibirDetalhamento = (_, dadosLinha) => {
    obterDetalhePendencia(dadosLinha);
  };

  const colunasTabelaComponentes = [
    {
      dataIndex: 'descricao',
      align: 'left',
      render: (_, pendencias) => {
        const ehLinhaClicada =
          pendencias.pendenciaId === detalhePendenciaEscolhido?.pendenciaId;
        const corTexto = ehLinhaClicada ? Base.Branco : Base.CinzaMako;
        return (
          <div className="d-flex align-items-center">
            <IconeSeta cor={corTexto} icon={faLevelUpAlt} />
            {pendencias.descricao}
          </div>
        );
      },
    },
    {
      dataIndex: '',
      align: 'center',
      width: 328,
      render: (_, record) => {
        const ehLinhaClicada =
          record.pendenciaId === detalhePendenciaEscolhido?.pendenciaId;
        const corTexto = Colors.Azul;
        const corTextoHover = ehLinhaClicada ? Colors.Branco : '';
        return (
          <Button
            id="botao-detalhar"
            className="mx-auto"
            label="Detalhar"
            color={corTexto}
            corTextoHover={corTextoHover}
            onClick={e => onClickExibirDetalhamento(e, record)}
            border
            mudarCorBorda
            height="32px"
          />
        );
      },
    },
  ];

  const obterDetalhesPendencias = async (expandir, componente) => {
    let componenteSelecionado = [];
    let dadosComponentes = [];

    if (expandir) {
      setCarregandoComponentes(true);

      const resposta =
        await ServicoAcompanhamentoFechamento.obterDetalhesPendencias(
          turmaId,
          bimestre,
          componente.id
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoComponentes(false));

      if (resposta?.data?.length) {
        componenteSelecionado = [componente?.id];
        dadosComponentes = resposta.data;
      }
    }

    setDetalhePendenciaEscolhido([]);
    setMostrarDetalhePendencia(false);
    setDadosPendencias(dadosComponentes);
    setLinhasExpandidasPendencia(componenteSelecionado);
  };

  const expandIcon = (expanded, onExpand, record) => {
    let marcador = <></>;

    if (
      statusAcompanhamentoFechamento?.NAO_INICIADO?.id !==
        record?.situacaoFechamentoCodigo &&
      STATUS_EM_PROCESSAMENTO !== record?.situacaoFechamentoCodigo
    ) {
      const ehLinhaExpandida = temLinhaExpandida(record?.id);
      const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
      marcador = <MarcadorTriangulo cor={corTexto} marginTop="-34.8px" />;
    }

    if (
      record?.situacaoFechamentoCodigo ===
      statusAcompanhamentoFechamento.PROCESSADO_PENDENCIAS.id
    ) {
      const ehLinhaExpandida = temLinhaExpandida(record.id);
      const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
      return (
        <>
          <TextoEstilizado cor={corTexto}>
            {record.situacaoFechamentoNome}
            <IconeEstilizado
              icon={expanded ? faAngleUp : faAngleDown}
              onClick={e => onExpand(record, e)}
            />
          </TextoEstilizado>
          {marcador}
        </>
      );
    }

    return (
      <>
        <TextoEstilizado cor={record?.cor}>
          {record?.situacaoFechamentoNome}
        </TextoEstilizado>
        {marcador}
      </>
    );
  };

  return (
    <LinhaTabela className="col-md-12">
      <DataTable
        id="tabela-componentes-curriculares"
        idLinha="id"
        columns={colunasTabelaComponentesCurriculares}
        dataSource={dadosComCores}
        pagination={false}
        expandedRowKeys={linhasExpandidasPendencia}
        onClickExpandir={(expanded, record) =>
          obterDetalhesPendencias(expanded, record)
        }
        semHover
        expandIcon={({ expanded, onExpand, record }) =>
          expandIcon(expanded, onExpand, record)
        }
        rowClassName={record => {
          const ehLinhaExpandida = temLinhaExpandida(record.id);
          const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
          return nomeClasse;
        }}
        expandableColumnWidth="200px"
        expandableColumnTitle="Situação do fechamento"
        expandedRowRender={componentes => {
          if (
            componentes.situacaoFechamentoCodigo ===
            statusAcompanhamentoFechamento.PROCESSADO_PENDENCIAS.id
          ) {
            return (
              <>
                <Loader loading={carregandoComponentes}>
                  <DataTable
                    id={`tabela-componente-pendencias-${componentes?.id}`}
                    idLinha="pendenciaId"
                    pagination={false}
                    showHeader={false}
                    columns={colunasTabelaComponentes}
                    dataSource={dadosPendencias}
                    semHover
                    rowClassName={record => {
                      const ehLinhaClicada =
                        record.pendenciaId ===
                        detalhePendenciaEscolhido?.pendenciaId;
                      const nomeClasse = ehLinhaClicada ? 'linha-ativa' : '';
                      return nomeClasse;
                    }}
                  />
                </Loader>

                {mostrarDetalhePendencia && (
                  <>
                    <Loader loading={carregandoDetalhePendencia}>
                      <RenderizarHtml
                        textoHtml={dadosDetalhePendencias?.descricaoHtml}
                        className="tabela-pendencias-html"
                      />
                    </Loader>
                  </>
                )}
              </>
            );
          }

          return null;
        }}
      />
    </LinhaTabela>
  );
};

TabelaComponentesCurriculares.defaultProps = {
  dadosComponentesCurriculares: [],
  turmaId: 0,
  bimestre: '',
};

TabelaComponentesCurriculares.propTypes = {
  dadosComponentesCurriculares: PropTypes.oneOfType([PropTypes.array]),
  turmaId: PropTypes.number,
  bimestre: PropTypes.string,
};

export default TabelaComponentesCurriculares;
