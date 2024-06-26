import { ocultarColunaAvaliacaoComponenteRegencia } from '@/@legacy/utils';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable, Loader } from '~/componentes';
import LabelAusenteCellTable from '~/componentes-sgp/inputs/nota/labelAusenteCellTable';
import LabelInterdisciplinar from '~/componentes-sgp/interdisciplinar';
import { obterDescricaoConceito } from '~/paginas/DiarioClasse/Listao/listaoFuncoes';
import { erros } from '~/servicos';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';
import shortid from 'shortid';
import ListaoContext from '../../../../listaoContext';

const TabelaAvaliacoesFechamento = props => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const { componenteCurricular, componentesRegenciaListao } =
    useContext(ListaoContext);

  const { codigoAluno, periodoEscolarId, ehNota, listaTiposConceitos } = props;

  const [dadosAlunoSelecionado, setDadosAlunoSelecionado] = useState();
  const [colunas, setColunas] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(false);

  const ocultarTabelaAvaliacoes =
    componenteCurricular?.regencia &&
    componentesRegenciaListao?.filter(c => !c?.ativo)?.length ===
      componentesRegenciaListao?.length;

  const montarNotaConceito = (valorNotaConceito, ausente) => {
    return (
      <>
        {valorNotaConceito}
        {ausente && <LabelAusenteCellTable />}
      </>
    );
  };

  const montarColunas = useCallback(() => {
    const cols = [];
    if (dadosAlunoSelecionado?.avaliacoes?.length) {
      dadosAlunoSelecionado.avaliacoes.forEach((avaliacao, index) => {
        const ocultar = ocultarColunaAvaliacaoComponenteRegencia(
          avaliacao?.disciplinas,
          componentesRegenciaListao,
          componenteCurricular?.regencia
        );

        if (ocultar) return;

        cols.push({
          ellipsis: true,
          title: () => (
            <div>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Tooltip title={avaliacao.nome}>{avaliacao?.nome}</Tooltip>
              </div>
              <div>{window.moment(avaliacao.data).format('DD/MM/YYYY')}</div>
              {avaliacao?.disciplinas?.length && (
                <div style={{ display: 'grid' }}>
                  {avaliacao.disciplinas.map(disciplina => (
                    <div
                      key={shortid.generate()}
                      alt={disciplina}
                      className="badge badge-pill border text-dark bg-white font-weight-light "
                    >
                      <Tooltip title={disciplina}>{disciplina}</Tooltip>
                    </div>
                  ))}
                </div>
              )}
              {avaliacao?.ehInterdisciplinar && (
                <div style={{ marginTop: '8px' }}>
                  <LabelInterdisciplinar disciplinas={avaliacao.disciplinas} />
                </div>
              )}
            </div>
          ),
          align: 'center',
          width: '200px',
          dataIndex: ['avaliacoes', `${index}`],
          key: `avaliacoes[${index}]`,
          className: 'position-relative',
          render: dadosAvaliacao => {
            let notaConceito = dadosAvaliacao?.notaConceito;
            const ausente = dadosAvaliacao?.ausente;

            if (ehNota) {
              notaConceito =
                notaConceito === 0 || notaConceito > 0
                  ? notaConceito?.toString?.()?.replace?.('.', ',')
                  : '-';
              return montarNotaConceito(notaConceito, ausente);
            }

            return notaConceito
              ? montarNotaConceito(
                  obterDescricaoConceito(listaTiposConceitos, notaConceito),
                  ausente
                )
              : '-';
          },
        });
      });
    }
    setColunas(cols);
  }, [
    dadosAlunoSelecionado,
    ehNota,
    listaTiposConceitos,
    componentesRegenciaListao,
    componenteCurricular,
  ]);

  const obterAvaliacoesTabelaFechamento = useCallback(async () => {
    setCarregandoDados(true);
    const resposta =
      await ServicoNotaConceito.obterNotasAvaliacoesPorTurmaBimestreAluno(
        turmaSelecionada.id,
        periodoEscolarId,
        codigoAluno,
        componenteCurricular?.codigoComponenteCurricular
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDados(false));

    if (resposta?.data?.length) {
      const avaliacoes = { codigoAluno, avaliacoes: resposta.data };
      setDadosAlunoSelecionado(avaliacoes);
    } else {
      setDadosAlunoSelecionado();
    }
  }, [turmaSelecionada, periodoEscolarId, codigoAluno, componenteCurricular]);

  useEffect(() => {
    montarColunas();
  }, [dadosAlunoSelecionado, componentesRegenciaListao, montarColunas]);

  useEffect(() => {
    if (codigoAluno) {
      obterAvaliacoesTabelaFechamento();
    } else {
      setDadosAlunoSelecionado();
    }
  }, [codigoAluno, obterAvaliacoesTabelaFechamento]);

  return (
    <Loader loading={carregandoDados}>
      {dadosAlunoSelecionado && !ocultarTabelaAvaliacoes ? (
        <DataTable
          scroll={{ x: '100%', y: 500 }}
          id={`tabela-aluno-${codigoAluno}`}
          idLinha="codigoAluno"
          pagination={false}
          columns={colunas}
          dataSource={dadosAlunoSelecionado ? [dadosAlunoSelecionado] : []}
          semHover
        />
      ) : !carregandoDados ? (
        <div className="text-center">Sem dados</div>
      ) : (
        <></>
      )}
    </Loader>
  );
};

TabelaAvaliacoesFechamento.propTypes = {
  codigoAluno: PropTypes.string,
  periodoEscolarId: PropTypes.number,
  ehNota: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOfType([PropTypes.array]),
};

TabelaAvaliacoesFechamento.defaultProps = {
  codigoAluno: '',
  periodoEscolarId: null,
  ehNota: true,
  listaTiposConceitos: [],
};

export default TabelaAvaliacoesFechamento;
