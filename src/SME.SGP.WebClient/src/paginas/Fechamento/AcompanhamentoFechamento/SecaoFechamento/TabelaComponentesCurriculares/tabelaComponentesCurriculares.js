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

const TabelaComponentesCurriculares = ({
  dadosComponentesCurriculares,
  turmaId,
  bimestre,
}) => {
  const [carregandoComponentes, setCarregandoComponentes] = useState(false);
  const [carregandoDetalhePendencia, setCarregandoDetalhePendencia] = useState(
    false
  );
  const [dadosPendencias, setDadosPendencias] = useState([]);
  const [dadosDetalhePendencias, setDadosDetalhePendencias] = useState([]);
  const [linhasExpandidasPendencia, setLinhasExpandidasPendencia] = useState(
    []
  );
  const [dadosComCores, setDadosComCores] = useState([]);
  const [mostrarDetalhePendencia, setMostrarDetalhePendencia] = useState(false);
  const [detalhePendenciaEscolhido, setDetalhePendenciaEscolhido] = useState();

  const obterCorSituacaoFechamento = situacaoFechamentoCodigo =>
    Object.keys(statusAcompanhamentoFechamento)
      .map(
        item =>
          statusAcompanhamentoFechamento[item].id ===
            situacaoFechamentoCodigo && statusAcompanhamentoFechamento[item].cor
      )
      .filter(item => item)
      .reduce(item => item);

  const montarDadosComCores = useCallback(dados => {
    const novoMap = dados.map(item => {
      const cor = obterCorSituacaoFechamento(item.situacaoFechamentoCodigo);
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
    {
      title: 'Situação do fechamento',
      dataIndex: 'situacaoFechamentoCodigo',
      align: 'center',
      render: (situacaoFechamentoCodigo, componente) => {
        if (
          statusAcompanhamentoFechamento?.NAO_INICIADO?.id !==
          situacaoFechamentoCodigo
        ) {
          const ehLinhaExpandida = temLinhaExpandida(componente.professorRf);
          const corTexto = ehLinhaExpandida.length
            ? Base.Branco
            : componente?.cor;
          return <MarcadorTriangulo cor={corTexto} marginTop="-34.8px" />;
        }
        return null;
      },
    },
  ];

  const obterDetalhePendencia = async dadosLinha => {
    let dados = [];
    let dadosResposta = [];
    let mostrarPendencia = false;
    setCarregandoDetalhePendencia(true);

    const resposta = await ServicoAcompanhamentoFechamento.obterDetalhePendencia(
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
      render: (_, record) => {
        const ehLinhaClicada =
          record.pendenciaId === detalhePendenciaEscolhido?.pendenciaId;
        const corTexto = ehLinhaClicada ? Colors.Branco : Colors.Azul;
        const corTextoHover = ehLinhaClicada ? Colors.Azul : '';
        return (
          <div className="container-botao-detalhar">
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
          </div>
        );
      },
    },
  ];

  const obterDetalhesPendencias = async (expandir, componente) => {
    if (expandir) {
      setCarregandoComponentes(true);
      setLinhasExpandidasPendencia([componente?.professorRf]);
      const resposta = await ServicoAcompanhamentoFechamento.obterDetalhesPendencias(
        turmaId,
        bimestre,
        componente.id
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoComponentes(false));

      if (resposta?.data?.length) {
        setDadosPendencias(resposta.data);
        return;
      }
    }

    setDetalhePendenciaEscolhido('');
    setMostrarDetalhePendencia(false);
    setDadosPendencias([]);
    setLinhasExpandidasPendencia([]);
  };

  const expandIcon = (expanded, onExpand, record) => {
    if (
      record?.situacaoFechamentoCodigo ===
      statusAcompanhamentoFechamento.PROCESSADO_PENDENCIAS.id
    ) {
      const ehLinhaExpandida = temLinhaExpandida(record.professorRf);
      const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
      return (
        <TextoEstilizado cor={corTexto}>
          {record.situacaoFechamento}
          <IconeEstilizado
            icon={expanded ? faAngleUp : faAngleDown}
            onClick={e => onExpand(record, e)}
          />
        </TextoEstilizado>
      );
    }

    return (
      <TextoEstilizado cor={record?.cor}>
        {record?.situacaoFechamento}
      </TextoEstilizado>
    );
  };

  return (
    <LinhaTabela className="col-md-12">
      <DataTable
        id="tabela-componentes-curriculares"
        idLinha="professorRf"
        columns={colunasTabelaComponentesCurriculares}
        dataSource={dadosComCores}
        pagination={false}
        expandIconColumnIndex={3}
        expandedRowKeys={linhasExpandidasPendencia}
        onClickExpandir={obterDetalhesPendencias}
        semHover
        expandIcon={({ expanded, onExpand, record }) =>
          expandIcon(expanded, onExpand, record)
        }
        rowClassName={(record, _) => {
          const ehLinhaExpandida = temLinhaExpandida(record.professorRf);
          const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
          return nomeClasse;
        }}
        expandedRowRender={componentes => {
          if (
            componentes.situacaoFechamentoCodigo ===
            statusAcompanhamentoFechamento.PROCESSADO_PENDENCIAS.id
          ) {
            return (
              <Loader loading={carregandoComponentes}>
                <DataTable
                  id={`tabela-componente-pendencias-${componentes?.professorRf}`}
                  idLinha="pendenciaId"
                  pagination={false}
                  showHeader={false}
                  columns={colunasTabelaComponentes}
                  dataSource={dadosPendencias}
                  semHover
                  rowClassName={(record, _) => {
                    const ehLinhaClicada =
                      record.pendenciaId ===
                      detalhePendenciaEscolhido?.pendenciaId;
                    const nomeClasse = ehLinhaClicada ? 'linha-ativa' : '';
                    return nomeClasse;
                  }}
                />
              </Loader>
            );
          }

          return null;
        }}
      />
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
