import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Table, Row, Col } from 'antd';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { Base, DataTable, Loader } from '~/componentes';

import { BIMESTRE_FINAL } from '~/constantes/constantes';
import { statusAcompanhamentoConselhoClasse } from '~/dtos';
import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';
import { formatarFrequencia, valorNuloOuVazio } from '~/utils/funcoes/gerais';

import {
  MarcadorTriangulo,
  TextoEstilizado,
  IconeEstilizado,
} from '../../acompanhamentoFechamento.css';
import { LinhaTabela } from './tabelaAlunosConselho.css';
import EstudanteMatriculadoPAP from '@/components/sgp/estudante-matriculado-pap';

const TabelaAlunosConselho = props => {
  const { dadosAlunos, bimestre, turmaId } = props;

  const [carregandoComponentes, setCarregandoComponentes] = useState(false);

  const [dadosComponentes, setDadosComponentes] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [dadosComCores, setDadosComCores] = useState([]);

  const obterCorSituacaoFechamento = situacaoFechamentoCodigo => {
    const colors = Object.keys(statusAcompanhamentoConselhoClasse)
      .map(
        item =>
          statusAcompanhamentoConselhoClasse[item].id ===
            situacaoFechamentoCodigo &&
          statusAcompanhamentoConselhoClasse[item].cor
      )
      .filter(item => item);

    if (colors?.length) {
      return colors.reduce(item => item);
    }
    return '';
  };

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
    if (dadosAlunos?.length) {
      montarDadosComCores(dadosAlunos);
    } else {
      setDadosComCores([]);
    }
  }, [dadosAlunos, montarDadosComCores]);

  const colunasTabelaAlunos = [
    {
      title: 'Estudantes',
      dataIndex: 'numeroChamada',
      align: 'left',
      render: (valor, aluno) => {
        return (
          <Col span={24}>
            <Row justify="space-between">
              {`${aluno.numeroChamada} - ${aluno.nomeAluno} (${aluno.alunoCodigo})`}
              <EstudanteMatriculadoPAP show={aluno?.ehMatriculadoTurmaPAP} />
            </Row>
          </Col>
        );
      },
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
      render: frequenciaGlobal => formatarFrequencia(frequenciaGlobal),
    },
    Table.EXPAND_COLUMN
  );

  const montarValorNota = componenteCurricular => {
    const nota = componenteCurricular?.notaFechamento;
    const lancaNota = componenteCurricular?.lancaNota;
    return (
      <>
        {valorNuloOuVazio(nota) ? <span className="sem-nota">-</span> : nota}
        {lancaNota && valorNuloOuVazio(nota) && (
          <Tooltip title="Sem nota atribuída">
            <MarcadorTriangulo
              cor={Base.LaranjaStatus}
              marginTop="-34.8px"
              marginRight="-11.8px"
            />
          </Tooltip>
        )}
      </>
    );
  };

  const montarNotaPosConselho = componenteCurricular => {
    return (
      <>
        {valorNuloOuVazio(componenteCurricular?.notaPosConselho) ? (
          <span className="sem-nota">-</span>
        ) : (
          componenteCurricular?.notaPosConselho
        )}
        {valorNuloOuVazio(componenteCurricular?.notaPosConselho) &&
        componenteCurricular?.lancaNota ? (
          <Tooltip title="Sem nota atribuída">
            <MarcadorTriangulo cor={Base.LaranjaStatus} marginTop="-34.8px" />
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
      ellipsis: true,
      width: 330,
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
        montarNotaPosConselho(componenteCurricular),
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
      dataIndex: 'percentualFrequenciaFormatado',
      align: 'center',
      render: percentualFrequencia => formatarFrequencia(percentualFrequencia),
    },
  ];

  const obterDetalhamentoComponentesCurricularesAluno = async (
    expandir,
    aluno
  ) => {
    if (expandir) {
      setCarregandoComponentes(true);
      setExpandedRowKeys([aluno?.alunoCodigo]);
      const resposta =
        await ServicoAcompanhamentoFechamento.obterDetalhamentoComponentesCurricularesAluno(
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

  const expandIcon = (expanded, onExpand, record) => {
    if (record?.podeExpandir) {
      const ehLinhaExpandida = temLinhaExpandida(record.alunoCodigo);
      const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;

      const iconeExpandirLinha = (
        <TextoEstilizado cor={corTexto}>
          {record.situacaoFechamento}
          <IconeEstilizado
            icon={expanded ? faAngleUp : faAngleDown}
            onClick={e => onExpand(record, e)}
          />
        </TextoEstilizado>
      );

      if (
        statusAcompanhamentoConselhoClasse?.NAO_INICIADO?.id !==
        record?.situacaoFechamentoCodigo
      ) {
        const ehLinhaExpandida = temLinhaExpandida(record.alunoCodigo);
        const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
        const marginRight = ehLinhaExpandida.length && '-11.3px';
        const marginTop = ehLinhaExpandida.length ? '-33.8px' : '-34.8px';

        return (
          <>
            {iconeExpandirLinha}
            <MarcadorTriangulo
              cor={corTexto}
              marginTop={marginTop}
              marginRight={marginRight}
            />
          </>
        );
      }

      return iconeExpandirLinha;
    }
    if (!record?.podeExpandir) {
      return record?.situacaoFechamento;
    }
    return null;
  };

  return (
    <LinhaTabela className="col-md-12">
      <DataTable
        id="tabela-alunos"
        idLinha="alunoCodigo"
        columns={colunasTabelaAlunos}
        dataSource={dadosComCores}
        pagination={false}
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={obterDetalhamentoComponentesCurricularesAluno}
        semHover
        expandIcon={({ expanded, onExpand, record }) =>
          expandIcon(expanded, onExpand, record)
        }
        rowClassName={record => {
          const ehLinhaExpandida = temLinhaExpandida(record.alunoCodigo);
          const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
          return nomeClasse;
        }}
        expandableColumnWidth="225px"
        expandableColumnTitle="Situação do conselho de classe"
        expandedRowRender={aluno => {
          if (aluno.podeExpandir) {
            return (
              <Loader loading={carregandoComponentes}>
                <DataTable
                  id={`tabela-componente-aluno-${aluno?.alunoCodigo}`}
                  idLinha="nomeComponenteCurricular"
                  pagination={false}
                  columns={colunasTabelaComponentes}
                  dataSource={dadosComponentes}
                  semHover
                  tableLayout="fixed"
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

TabelaAlunosConselho.propTypes = {
  dadosAlunos: PropTypes.oneOfType([PropTypes.array]),
  turmaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bimestre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TabelaAlunosConselho.defaultProps = {
  dadosAlunos: [],
  turmaId: null,
  bimestre: null,
};

export default TabelaAlunosConselho;
