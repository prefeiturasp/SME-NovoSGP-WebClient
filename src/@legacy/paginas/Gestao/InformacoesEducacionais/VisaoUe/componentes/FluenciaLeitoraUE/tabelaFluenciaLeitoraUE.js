import CardCollapse from '~/componentes/cardCollapse';
import ServicoFluenciaLeituraGrafico from '~/servicos/InformacoesEducacionais/ServicoFluenciaLeituraGrafico';
import { useState, useEffect } from 'react';
import { Table, Select, Row, Col } from 'antd';
import { Base } from '~/componentes';
import './tabelaFluenciaLeitoraUE.css';

function TabelaFluenciaLeitoraUE({ dreCodigo, ueCodigo, anoLetivo }) {
  const [exibirSondagemUe, setExibirSondagemUe] = useState(false);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipoAvaliacao, setTipoAvaliacao] = useState(1);

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const key = 'fluencia-leitora-prof-coll';

  useEffect(() => {
    if (exibirSondagemUe && ueCodigo && anoLetivo && tipoAvaliacao) {
      setLoading(true);
      ServicoFluenciaLeituraGrafico.obterFluenciaLeituraUe(
        ueCodigo,
        tipoAvaliacao,
        anoLetivo
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
  }, [exibirSondagemUe, ueCodigo, anoLetivo, tipoAvaliacao]);

  const columns = [
    {
      title: 'Turma',
      dataIndex: 'turma',
      key: 'turma',
      align: 'center',
    },
    {
      title: 'Previstos',
      dataIndex: 'alunosPrevistos',
      key: 'alunosPrevistos',
      align: 'center',
    },
    {
      title: 'Avaliados',
      dataIndex: 'alunosAvaliados',
      key: 'alunosAvaliados',
      align: 'center',
    },
    {
      title: (
        <span>
          Pré-leitor
          <br />
          (total)
        </span>
      ),
      dataIndex: 'totalPreLeitor',
      key: 'totalPreLeitor',
      align: 'center',
    },
    {
      title: (
        <span>
          Pré-leitor
          <br />
          (nível 1)
        </span>
      ),
      dataIndex: 'preLeitor1',
      key: 'preLeitor1',
      align: 'center',
    },
    {
      title: (
        <span>
          Pré-leitor
          <br />
          (nível 2)
        </span>
      ),
      dataIndex: 'preLeitor2',
      key: 'preLeitor2',
      align: 'center',
    },
    {
      title: (
        <span>
          Pré-leitor
          <br />
          (nível 3)
        </span>
      ),
      dataIndex: 'preLeitor3',
      key: 'preLeitor3',
      align: 'center',
    },
    {
      title: (
        <span>
          Pré-leitor
          <br />
          (nível 4)
        </span>
      ),
      dataIndex: 'preLeitor4',
      key: 'preLeitor4',
      align: 'center',
    },
    {
      title: 'Leitor iniciante',
      dataIndex: 'leitorIniciante',
      key: 'leitorIniciante',
      align: 'center',
    },
    {
      title: 'Leitor fluente',
      dataIndex: 'leitorFluente',
      key: 'leitorFluente',
      align: 'center',
    },
  ];

  return (
    <>
      <CardCollapse
        titulo="Fluência Leitora"
        show={exibirSondagemUe}
        onClick={() => setExibirSondagemUe(!exibirSondagemUe)}
        configCabecalho={configCabecalho}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
      >
        {exibirSondagemUe && (
          <>
            <div className="fluencia-leitora-header">
              <p className="fluencia-leitora-desc">
                É uma avaliação aplicada aos alunos do 2º ano do Ensino
                Fundamental, com o objetivo de medir o nível de leitura e
                compreensão de textos escritos por crianças na faixa etária da
                alfabetização. Confira os resultados das avaliações de entrada
                (março) e saída (novembro).
              </p>
              <Select
                value={tipoAvaliacao}
                className="fluencia-leitora-select"
                onChange={setTipoAvaliacao}
                options={[
                  { label: 'Avaliação de entrada', value: 1 },
                  { label: 'Avaliação de saída', value: 2 },
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
              rowKey={row => `${row.turma}-${tipoAvaliacao}`}
              className="fluencia-leitora-tabela"
              locale={{ emptyText: 'Sem dados' }}
            />
          </>
        )}
      </CardCollapse>
    </>
  );
}

export default TabelaFluenciaLeitoraUE;
