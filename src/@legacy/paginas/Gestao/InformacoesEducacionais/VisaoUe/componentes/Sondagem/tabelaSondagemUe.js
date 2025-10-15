import CardCollapse from '~/componentes/cardCollapse';
import ServicoSondagem from '~/servicos/InformacoesEducacionais/ServicoSondagem';
import { useState, useEffect } from 'react';
import { Table, Select, Row, Col } from 'antd';
import { Base } from '~/componentes';
import './tabelaSondagem.css';

function TabelaSondagemUe({ dreCodigo, ueCodigo, anoLetivo }) {
  const [exibirSondagemUe, setExibirSondagemUe] = useState(false);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bimestre, setBimestre] = useState(1);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'sondagem-prof-coll';

  useEffect(() => {
    if (exibirSondagemUe && dreCodigo && ueCodigo && anoLetivo && bimestre) {
      setLoading(true);
      ServicoSondagem.obterSondagemEscrita(
        dreCodigo,
        ueCodigo,
        anoLetivo,
        bimestre
      )
        .then(res => {
          if (Array.isArray(res.data)) {
            setDados(res.data);
          } else if (res.data) {
            setDados([res.data]);
          } else {
            setDados([]);
          }
        })
        .catch(() => setDados([]))
        .finally(() => setLoading(false));
    }
  }, [exibirSondagemUe, dreCodigo, ueCodigo, anoLetivo, bimestre]);

  const columns = [
    {
      title: 'Ano',
      dataIndex: 'serieAno',
      key: 'ano',
      align: 'center',
      render: v => `${v}º`,
    },
    {
      title: 'Pré silábico (PS)',
      dataIndex: 'preSilabico',
      key: 'preSilabico',
      align: 'center',
    },
    {
      title: 'Silábico sem valor (SSV)',
      dataIndex: 'silabicoSemValor',
      key: 'silabicoSemValor',
      align: 'center',
    },
    {
      title: 'Silábico com valor (SCV)',
      dataIndex: 'silabicoComValor',
      key: 'silabicoComValor',
      align: 'center',
    },
    {
      title: 'Silábico alfabético (SA)',
      dataIndex: 'silabicoAlfabetico',
      key: 'silabicoAlfabetico',
      align: 'center',
    },
    {
      title: 'Alfabético (A)',
      dataIndex: 'alfabetico',
      key: 'alfabetico',
      align: 'center',
    },
    {
      title: 'Sem preenchimento',
      dataIndex: 'semPreenchimento',
      key: 'semPreenchimento',
      align: 'center',
    },
    {
      title: 'Total de estudantes',
      dataIndex: 'quantidadeAlunos',
      key: 'quantidadeAlunos',
      align: 'center',
    },
  ];

  return (
    <>
      <CardCollapse
        titulo="Sondagem"
        show={exibirSondagemUe}
        onClick={() => setExibirSondagemUe(!exibirSondagemUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirSondagemUe && (
          <>
            <div className="tabela-sondagem-header">
              <p className="tabela-sondagem-desc">
                O Sondagem reúne informações sobre a alfabetização em Língua
                Portuguesa (leitura e escrita) dos alunos da rede municipal. Os
                professores registram os dados dos alunos na plataforma, e o
                sistema gera relatórios e gráficos para acompanhar o
                aprendizado.
              </p>
              <Select
                value={bimestre}
                className="tabela-sondagem-select"
                onChange={setBimestre}
                options={[
                  { label: '1º bimestre', value: 1 },
                  { label: '2º bimestre', value: 2 },
                  { label: '3º bimestre', value: 3 },
                  { label: '4º bimestre', value: 4 },
                ]}
              />
            </div>
            <Table
              columns={columns}
              dataSource={dados}
              bordered
              pagination={false}
              size="small"
              loading={loading}
              rowKey={row => `${row.serieAno}-${row.bimestre}`}
              className="tabela-sondagem-custom"
              locale={{ emptyText: 'Sem dados' }}
            />
          </>
        )}
      </CardCollapse>
    </>
  );
}

export default TabelaSondagemUe;
