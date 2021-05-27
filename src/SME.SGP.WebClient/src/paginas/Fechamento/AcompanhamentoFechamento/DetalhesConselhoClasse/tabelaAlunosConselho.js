import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
  const [dadosComCores, setDadosComCores] = useState([]);

  const obterCorSituacaoFechamento = dados => {
    switch (dados?.situacaoFechamentoCodigo) {
      case statusAcompanhamentoFechamento?.EM_ANDAMENTO?.id:
        return statusAcompanhamentoFechamento?.EM_ANDAMENTO?.cor;
      case statusAcompanhamentoFechamento?.CONCLUIDO?.id:
        return statusAcompanhamentoFechamento?.CONCLUIDO?.cor;
      default:
        return statusAcompanhamentoFechamento?.EM_ANDAMENTO?.cor;
    }
  };

  const montarDadosComCores = dados => {
    const novoMap = dados.map(item => {
      const cor = obterCorSituacaoFechamento(item);
      return { ...item, cor };
    });
    setDadosComCores(novoMap);
  };

  useEffect(() => {
    if (dadosAlunos?.length) {
      montarDadosComCores(dadosAlunos);
    } else {
      setDadosComCores([]);
    }
  }, [dadosAlunos]);

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
      dataIndex: 'situacaoFechamentoCodigo',
      align: 'center',
      render: (situacaoFechamentoCodigo, aluno) => {
        if (
          statusAcompanhamentoFechamento?.NAO_INICIADO?.id !==
          situacaoFechamentoCodigo
        ) {
          return <MarcadorTriangulo cor={aluno?.cor} marginTop="-34.8px" />;
        }
        return null;
      },
    }
  );

  const montarValorNota = componenteCurricular => {
    return (
      <>
        {componenteCurricular?.nota || '-'}
        {!componenteCurricular?.nota && componenteCurricular?.lancaNota ? (
          <Tooltip title="Sem nota atribuída">
            <MarcadorTriangulo cor={Base.LaranjaStatus} />
          </Tooltip>
        ) : (
          ''
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
      render: (_, componenteCurricular) =>
        montarValorNota(componenteCurricular),
    },
    {
      title: 'Nota pós conselho',
      dataIndex: 'notaPosConselho',
      align: 'center',
      render: (_, componenteCurricular) =>
        montarValorNota(componenteCurricular),
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
      render: percentualFrequencia => `${percentualFrequencia}%`,
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
        dataSource={dadosComCores}
        pagination={false}
        expandIconColumnIndex={bimestre === BIMESTRE_FINAL ? 4 : 3}
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={obterDetalhamentoComponentesCurricularesAluno}
        nomeColunaExpandir="situacaoFechamento"
        semHover
        expandedRowRender={aluno => {
          if (aluno.podeExpandir) {
            return (
              <Loader loading={carregandoComponentes}>
                <DataTable
                  id={`tabela-componente-aluno-${aluno?.alunoCodigo}`}
                  pagination={false}
                  columns={colunasTabelaComponentes}
                  dataSource={dadosComponentes}
                  semHover
                />
              </Loader>
            );
          }

          return null;
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
