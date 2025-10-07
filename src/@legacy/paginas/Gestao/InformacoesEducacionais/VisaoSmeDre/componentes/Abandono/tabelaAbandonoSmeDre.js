import React from 'react';
import { Table, Card } from 'antd';
import './tabelaAbandonoSmeDre.css';

import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { erros } from '~/servicos';
import { Loader } from '~/componentes';
import ServicoAbandono from '~/servicos/InformacoesEducacionais/ServicoAbandono';

const columns = [
  {
    title: 'Ano',
    dataIndex: 'ano',
    key: 'ano',
    render: (text, row) => {
      if (row.colSpanAno === 0)
        return { children: null, props: { colSpan: 0 } };
      return {
        children: text,
        props: {
          colSpan: row.colSpanAno || 1,
          style: row.bold ? { fontWeight: 'bold' } : {},
        },
      };
    },
  },
  {
    title: 'Qtde de desistências',
    dataIndex: 'qtd',
    key: 'qtd',
    align: 'right',
    render: (text, row) => {
      if (row.colSpanQtd === 0)
        return { children: null, props: { colSpan: 0 } };
      return {
        children: text,
        props: {
          colSpan: row.colSpanQtd || 1,
          style: row.bold ? { fontWeight: 'bold' } : {},
        },
      };
    },
  },
];

const data = [
  {
    key: 'header1',
    ano: 'Educação infantil',
    qtd: '',
    colSpanAno: 2,
    colSpanQtd: 0,
    bold: true,
  },
  {
    key: 'creche',
    ano: 'Creche (0 a 3 anos)',
    qtd: '150',
  },
  {
    key: 'preescola',
    ano: 'Pré-escola (4 e 5 anos)',
    qtd: '460',
  },
  {
    key: 'header2',
    ano: 'Ensino fundamental',
    qtd: '',
    colSpanAno: 2,
    colSpanQtd: 0,
    bold: true,
  },
  {
    key: 'fund1',
    ano: '1º',
    qtd: '1.203',
  },
  {
    key: 'fund2',
    ano: '2º',
    qtd: '651',
  },
  {
    key: 'fund3',
    ano: '3º',
    qtd: '810',
  },
  {
    key: 'fund4',
    ano: '4º',
    qtd: '901',
  },
  {
    key: 'fund5',
    ano: '5º',
    qtd: '1.548',
  },
  {
    key: 'fund6',
    ano: '6º',
    qtd: '1.014',
  },
  {
    key: 'fund7',
    ano: '7º',
    qtd: '965',
  },
  {
    key: 'fund8',
    ano: '8º',
    qtd: '715',
  },
  {
    key: 'fund9',
    ano: '9º',
    qtd: '874',
  },
  {
    key: 'header3',
    ano: 'Ensino médio',
    qtd: '',
    colSpanAno: 2,
    colSpanQtd: 0,
    bold: true,
  },
  {
    key: 'medio1',
    ano: '1º',
    qtd: '2.412',
  },
  {
    key: 'medio2',
    ano: '2º',
    qtd: '3.698',
  },
  {
    key: 'medio3',
    ano: '3º',
    qtd: '7.109',
  },
];

function TabelaAbandonoSmeDre({ codigoDre, codigoUe, anoLetivo }) {
  const [dados, setDados] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterDados = useCallback(async () => {
    setExibirLoader(true);
    try {
      const resposta = await ServicoAbandono.ObterDadosAbandano(
        codigoDre,
        codigoUe,
        anoLetivo
      );

      if (resposta.status === 200 && resposta.data) {
        const dadosTabela = (resposta.data || []).map((escola, index) => ({
          key: index,
          posicao: escola.posicao,
          ue: escola.ue || 'UE TESTE',
          dre: escola.dre || 'DRE TESTE',
          totalAlunosNaoAlfabetizados: escola.totalAlunosNaoAlfabetizados || 0,
          percentualTotalAlunos: escola.percentualTotalAlunos || 0,
        }));

        setDados(dadosTabela);
      } else {
        setDados([]);
      }
    } catch (error) {
      if (error.response?.data?.mensagens?.length > 0)
        erros(error.response.data.mensagens.join(', '));
      else erros('Erro ao carregar dados do Abandono');
      setDados([]);
    } finally {
      setExibirLoader(false);
    }
  }, []);

  useEffect(() => {
    obterDados();
  }, [anoLetivo, codigoDre]);
  return (
    <>
      <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
        Abandono
      </h5>
      <p
        style={{
          fontSize: '14px',
          marginBottom: '32px',
          color: '#42474a',
        }}
      >
        É a quantidade de estudantes cadastrados no EOL, do ensino infantil ao
        ensino médio, classificados como desistentes ou abandono.
      </p>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          rowClassName={record => (record.bold ? 'ant-table-row-bold' : '')}
          style={{ marginTop: 16 }}
          className="tabela-abandono-custom"
        />
      </div>
    </>
  );
}

TabelaAbandonoSmeDre.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaAbandonoSmeDre.defaultProps = {
  codigoDre: null,
  codigoUe: null,
};

export default TabelaAbandonoSmeDre;
