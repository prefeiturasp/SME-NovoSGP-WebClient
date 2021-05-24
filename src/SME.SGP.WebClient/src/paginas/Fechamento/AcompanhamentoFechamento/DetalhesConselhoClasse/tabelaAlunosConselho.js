import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base, DataTable, Loader } from '~/componentes';
import { BIMESTRE_FINAL } from '~/constantes/constantes';
import { statusAcompanhamentoFechamento } from '~/dtos';
import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';
import { MarcadorTriangulo } from '../CardStatus/cardStatus.css';

const TabelaAlunosConselho = props => {
  const { dadosAlunos, bimestre, turmaId } = props;

  const [carregandoComponentes, setCarregandoComponentes] = useState(false);

  const [dadosComponentes, setDadosComponentes] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const colunasTabelaAlunos = [
    {
      title: 'Estudantes',
      dataIndex: 'numeroChamada',
      align: 'left',
      render: (valor, aluno) =>
        `${aluno.numeroChamada} - ${aluno.nomeAluno} (${aluno.alunoCodigo})`,
    },
  ];

  if (bimestre === BIMESTRE_FINAL) {
    colunasTabelaAlunos.push({
      title: 'Parecer conclusivo',
      dataIndex: 'parecerConclusivo',
      align: 'center',
    });
  }

  colunasTabelaAlunos.push(
    {
      title: 'Frequência global',
      dataIndex: 'frequenciaGlobal',
      align: 'center',
      render: frequenciaGlobal => `${frequenciaGlobal}%`,
    },
    {
      title: 'Situação do conselho de classe',
      dataIndex: 'situacaoFechamento',
      align: 'center',
      render: (situacaoFechamento, dados) => {
        const status = Object.keys(statusAcompanhamentoFechamento)?.find(
          item =>
            statusAcompanhamentoFechamento?.[item]?.id === situacaoFechamento
        );

        return (
          <>
            <div className="text-center">
              {dados.descricaoSituacaoFechamento}
            </div>
            <MarcadorTriangulo
              cor={statusAcompanhamentoFechamento?.[status]?.cor}
            />
          </>
        );
      },
    }
  );

  const montarValorNota = valor => {
    return (
      <>
        <div className="text-center">{valor || '-'}</div>
        {valor !== 0 && !valor && (
          <Tooltip title="Sem nota atribuída">
            <MarcadorTriangulo cor={Base.LaranjaStatus} />
          </Tooltip>
        )}
      </>
    );
  };

  const colunasTabelaComponentes = [
    {
      title: 'Componentes curriculares',
      dataIndex: 'nomeComponenteCurricular',
      align: 'left',
    },
    {
      title: 'Nota do fechamento',
      dataIndex: 'notaFechamento',
      align: 'center',
      render: valor => montarValorNota(valor),
    },
    {
      title: 'Nota pós conselho',
      dataIndex: 'notaPosConselho',
      align: 'center',
      render: valor => montarValorNota(valor),
    },
    {
      title: 'Qtd. de ausências',
      dataIndex: 'quantidadeAusencia',
      align: 'center',
    },
    {
      title: 'Qtd. de compensações',
      dataIndex: 'quantidadeCompensacoes',
      align: 'center',
    },
    {
      title: 'Percentual de frequência',
      dataIndex: 'percentualFrequencia',
      align: 'center',
    },
  ];

  const obterDetalhamentoComponentesCurricularesAluno = async (
    expandir,
    aluno
  ) => {
    if (expandir) {
      setCarregandoComponentes(true);
      setExpandedRowKeys([aluno?.alunoCodigo]);
      const resposta = await ServicoAcompanhamentoFechamento.obterDetalhamentoComponentesCurricularesAluno(
        turmaId,
        bimestre,
        aluno.alunoCodigo
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoComponentes(false));

      if (resposta?.data?.length) {
        setDadosComponentes(resposta.data);
      } else {
        setDadosComponentes([]);
      }
    } else {
      setDadosComponentes([]);
      setExpandedRowKeys([]);
    }
  };

  return (
    <div className="col-md-12 pt-2">
      <DataTable
        id="tabela-alunos"
        idLinha="alunoCodigo"
        columns={colunasTabelaAlunos}
        dataSource={dadosAlunos}
        pagination={false}
        expandIconColumnIndex={3}
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={obterDetalhamentoComponentesCurricularesAluno}
        expandedRowRender={aluno => {
          return (
            <Loader loading={carregandoComponentes}>
              <DataTable
                id={`tabela-componente-aluno-${aluno?.alunoCodigo}`}
                pagination={false}
                columns={colunasTabelaComponentes}
                dataSource={dadosComponentes}
              />
            </Loader>
          );
        }}
      />
    </div>
  );
};

TabelaAlunosConselho.propTypes = {
  dadosAlunos: PropTypes.oneOfType(PropTypes.array),
  turmaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bimestre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TabelaAlunosConselho.defaultProps = {
  dadosAlunos: [],
  turmaId: null,
  bimestre: null,
};

export default TabelaAlunosConselho;
