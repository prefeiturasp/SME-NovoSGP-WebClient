import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Base, Button, Colors, DataTable, Loader } from '~/componentes';

import { statusAcompanhamentoFechamento } from '~/dtos';
import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';

import {
  MarcadorTriangulo,
  TextoEstilizado,
  IconeEstilizado,
} from '../../acompanhamentoFechamento.css';
import { LinhaTabela } from './tabelaComponentesCurriculares.css';

const TabelaComponentesCurriculares = ({ dadosComponentesCurriculares }) => {
  const [carregandoComponentes, setCarregandoComponentes] = useState(false);

  const [dadosPendencias, setDadosPendencias] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [dadosComCores, setDadosComCores] = useState([]);

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
    expandedRowKeys.filter(item => String(item) === String(dados));

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
          return <MarcadorTriangulo cor={corTexto} marginTop="-33.8px" />;
        }
        return null;
      },
    },
  ];

  const colunasTabelaComponentes = [
    {
      dataIndex: 'descricao',
      align: 'left',
      render: (_, pendencias) => {
        return <div style={{ paddingLeft: 15 }}>{pendencias.descricao}</div>;
      },
    },
    {
      dataIndex: '',
      align: 'center',
      render: () => {
        return (
          <Button
            id="botao-detalhar"
            className="mx-auto"
            label="Detalhar"
            color={Colors.Azul}
            // onClick={onClickExibirDetalhamento}
            border
          />
        );
      },
    },
  ];

  const obterDetalhamentoPendencias = async (expandir, componente) => {
    if (expandir) {
      setCarregandoComponentes(true);
      setExpandedRowKeys([componente?.professorRf]);
      const resposta = await ServicoAcompanhamentoFechamento.obterDetalhamentoPendencias()
        .catch(e => erros(e))
        .finally(() => setCarregandoComponentes(false));

      if (resposta?.data?.length) {
        setDadosPendencias(resposta.data);
        return;
      }
    }
    setDadosPendencias([]);
    setExpandedRowKeys([]);
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
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={obterDetalhamentoPendencias}
        semHover
        expandIcon={({ expanded, onExpand, record }) =>
          expandIcon(expanded, onExpand, record)
        }
        rowClassName={(record, _) => {
          let nomeClasse = record.professorRf;
          const ehLinhaExpandida = temLinhaExpandida(record.professorRf);
          if (ehLinhaExpandida.length) {
            nomeClasse += ' linha-ativa';
          }
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
                  pagination={false}
                  showHeader={false}
                  columns={colunasTabelaComponentes}
                  dataSource={dadosPendencias}
                  semHover
                />
              </Loader>
            );
          }

          return null;
        }}
      />
    </LinhaTabela>
  );
};

TabelaComponentesCurriculares.propTypes = {
  dadosComponentesCurriculares: PropTypes.oneOfType([PropTypes.array]),
};

TabelaComponentesCurriculares.defaultProps = {
  dadosComponentesCurriculares: [],
};

export default TabelaComponentesCurriculares;
