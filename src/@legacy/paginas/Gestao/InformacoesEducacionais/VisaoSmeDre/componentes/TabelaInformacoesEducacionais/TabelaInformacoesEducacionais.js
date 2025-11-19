import React, { useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import './TabelaInformacoesEducacionais.css';
import PropTypes from 'prop-types';
import ServicoTabelaEducacional from '~/servicos/InformacoesEducacionais/ServicoTabelaEducacional';

function TabelaInformacoesEducacionais({ codigoDre, codigoUe, anoLetivo }) {
  const [dadosTabela, setDadosTabela] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const obterDados = useCallback(async () => {
    setLoading(true);

    try {
      const resposta =
        await ServicoTabelaEducacional.ObterDadosTabelaInformacoesEducacionaisDRE(
          codigoDre,
          anoLetivo,
          pagina,
          10
        );

      const dados = resposta.data;

      setDadosTabela(
        dados.ues.map((item, i) => ({
          key: `${pagina}-${i}`,
          ...item,
        }))
      );
      setTotalRegistros(dados.totalRegistros);
    } catch (e) {
      setDadosTabela([]);
      setTotalRegistros(0);
    }
    setLoading(false);
  }, [pagina, codigoDre, codigoUe, anoLetivo]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  const columns = [
    {
      title: 'Unidade educacional',
      dataIndex: 'ue',
      key: 'ue',
      align: 'left',
      width: 250,
      fixed: 'left',
    },
    {
      title: 'IDEP',
      children: [
        {
          title: 'Anos iniciais',
          dataIndex: 'idepAnosIniciais',
          key: 'idepIniciais',
          align: 'center',
          width: 120,
        },
        {
          title: 'Anos finais',
          dataIndex: 'idepAnosFinais',
          key: 'idepFinais',
          align: 'center',
          width: 120,
        },
      ],
    },
    {
      title: 'IDEB',
      children: [
        {
          title: 'Anos iniciais',
          dataIndex: 'idebAnosIniciais',
          key: 'idebIniciais',
          align: 'center',
          width: 120,
        },
        {
          title: 'Anos finais',
          dataIndex: 'idebAnosFinais',
          key: 'idebFinais',
          align: 'center',
          width: 120,
        },
        {
          title: 'Ensino médio',
          dataIndex: 'idebEnsinoMedio',
          key: 'idebMedio',
          align: 'center',
          width: 120,
        },
      ],
    },
    {
      title: 'Frequência',
      dataIndex: 'percentualFrequenciaGlobal',
      key: 'frequencia',
      align: 'center',
      width: 110,
      render: value => `${value}%`,
    },
    {
      title: 'Qtde. Turmas PAP',
      dataIndex: 'quantidadeTurmasPap',
      key: 'turmasPap',
      align: 'center',
      width: 120,
    },
    {
      title: 'Freq. Alunos PAP',
      dataIndex: 'percentualFrequenciaAlunosPap',
      key: 'frequenciaAlunosPap',
      align: 'center',
      width: 120,
      render: value => `${value}%`,
    },
    {
      title: 'Alunos desistentes/abandono',
      dataIndex: 'quantidadeAlunosDesistentesAbandono',
      key: 'desistentesAbandono',
      align: 'center',
      width: 110,
    },
    {
      title: 'Promoções',
      dataIndex: 'quantidadePromocoes',
      key: 'promocoes',
      align: 'center',
      width: 120,
    },
    {
      title: 'Retenções (frequência)',
      dataIndex: 'quantidadeRetencoesFrequencia',
      key: 'retencoesFrequencia',
      align: 'center',
      width: 120,
    },
    {
      title: 'Retenções (nota)',
      dataIndex: 'quantidadeRetencoesNota',
      key: 'retencoesNota',
      align: 'center',
      width: 120,
    },
    {
      title: 'Notas abaixo da média',
      dataIndex: 'quantidadeNotasAbaixoMedia',
      key: 'abaixoMedia',
      align: 'center',
      width: 120,
    },
    {
      title: 'Notas acima da média',
      dataIndex: 'quantidadeNotasAcimaMedia',
      key: 'acimaMedia',
      align: 'center',
      width: 120,
    },
  ];

  return (
    <>
      <h5 className="tabela-infos-educacionais-title">
        Tabela de informações educacionais
      </h5>
      <p className="tabela-infos-educacionais-desc">
        Aqui, você encontra informações das Unidades Educacionais (UEs) de São
        Paulo em {anoLetivo}. Busque uma DRE ou UE específica na barra de
        pesquisa ou consulte os dados na tabela abaixo.
      </p>
      <div className="tabela-infos-educacionais-tabela">
        <Table
          columns={columns}
          dataSource={dadosTabela}
          pagination={{
            current: pagina,
            pageSize: 10,
            total: totalRegistros,
            showSizeChanger: false,
            onChange: p => setPagina(p),
            position: ['bottomCenter'],
          }}
          scroll={{ x: 1700 }}
          bordered
          loading={loading}
          rowKey="key"
          locale={{ emptyText: 'Sem dados' }}
          className="tabela-infos-educacionais"
        />
      </div>
    </>
  );
}

TabelaInformacoesEducacionais.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaInformacoesEducacionais.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: null,
};

export default TabelaInformacoesEducacionais;
