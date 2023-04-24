import PropTypes from 'prop-types';
import React from 'react';
import { DataTable, Label } from '~/componentes';
import SelectComponent from '~/componentes/select';
import { SGP_SELECT_FALTAS_COMPENSACAO } from '~/constantes/ids/select';
import { SGP_TABLE_LISTA_ALUNOS_AUSENCIA_COMPENSADA } from '~/constantes/ids/table';
import _ from 'lodash';

import { CardTabelaAlunos } from '../styles';
import BtnEditarCompensacoes from './btnEditarCompensacoes';
import ServicoCompensacaoAusencia from '~/servicos/Paginas/DiarioClasse/ServicoCompensacaoAusencia';

const ListaAlunosAusenciasCompensadas = props => {
  const {
    listaAusenciaCompensada,
    idsAlunosAusenciaCompensadas,
    onSelectRow,
    atualizarValoresListaCompensacao,
    desabilitarCampos,
    idCompensacaoAusencia,
    turmaCodigo,
    bimestre,
    disciplinaId,
    anoLetivo,
  } = props;

  const exibirColunaAulas = anoLetivo && Number(anoLetivo) >= 2023;

  const atualizarValores = (
    qt,
    indexAluno,
    dadosIniciaisListasAusenciasCompensadas
  ) => {
    if (indexAluno >= 0) {
      const lista = _.cloneDeep(listaAusenciaCompensada);
      lista[indexAluno].quantidadeFaltasCompensadas = qt;
      lista[indexAluno].dadosIniciaisListasAusenciasCompensadas =
        dadosIniciaisListasAusenciasCompensadas;
      atualizarValoresListaCompensacao(_.cloneDeep(lista));
    }
  };

  const montaCompensacao = (qtCompensada, dadosAluno) => {
    const listaMaximoCompensar = [];
    const qtMaxima = dadosAluno.maximoCompensacoesPermitidas;
    for (let index = 0; index < qtMaxima; index++) {
      listaMaximoCompensar.push({
        valor: String(index + 1),
        descricao: String(index + 1),
      });
    }
    return (
      <SelectComponent
        onChange={novaQtCompensada => {
          if (!desabilitarCampos) {
            const aluno = listaAusenciaCompensada.find(
              item => Number(item.id) === Number(dadosAluno.id)
            );
            let indexAluno = null;
            if (aluno) {
              indexAluno = listaAusenciaCompensada.indexOf(aluno);
            }

            if (aluno?.dadosIniciaisListasAusenciasCompensadas) {
              if (!novaQtCompensada) {
                aluno.dadosIniciaisListasAusenciasCompensadas = {
                  esquerda: [
                    ...aluno?.dadosIniciaisListasAusenciasCompensadas?.esquerda,
                    ...aluno?.dadosIniciaisListasAusenciasCompensadas?.direita,
                  ],
                  direita: [],
                };
              } else {
                let qtdAusenciasCompensadas =
                  aluno.dadosIniciaisListasAusenciasCompensadas?.direita
                    ?.length;

                if (qtdAusenciasCompensadas) {
                  while (qtdAusenciasCompensadas < novaQtCompensada) {
                    aluno.dadosIniciaisListasAusenciasCompensadas.direita.push(
                      aluno.dadosIniciaisListasAusenciasCompensadas.esquerda.shift()
                    );
                    qtdAusenciasCompensadas =
                      aluno.dadosIniciaisListasAusenciasCompensadas?.direita
                        ?.length;
                  }

                  while (qtdAusenciasCompensadas > novaQtCompensada) {
                    aluno.dadosIniciaisListasAusenciasCompensadas.esquerda.push(
                      aluno.dadosIniciaisListasAusenciasCompensadas.direita.pop()
                    );
                    qtdAusenciasCompensadas =
                      aluno.dadosIniciaisListasAusenciasCompensadas?.direita
                        ?.length;
                  }

                  if (
                    aluno.dadosIniciaisListasAusenciasCompensadas.esquerda
                      ?.length
                  ) {
                    const listaEsquerdaOrdenada =
                      ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(
                        aluno.dadosIniciaisListasAusenciasCompensadas.esquerda
                      );
                    aluno.dadosIniciaisListasAusenciasCompensadas.esquerda =
                      listaEsquerdaOrdenada;
                  }

                  if (
                    aluno.dadosIniciaisListasAusenciasCompensadas.direita
                      ?.length
                  ) {
                    const listaDireitaOrdenada =
                      ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(
                        aluno.dadosIniciaisListasAusenciasCompensadas.direita
                      );
                    aluno.dadosIniciaisListasAusenciasCompensadas.direita =
                      listaDireitaOrdenada;

                    aluno.compensacoes = listaDireitaOrdenada;
                  } else {
                    aluno.compensacoes = [];
                  }
                }
              }
            }

            atualizarValores(
              novaQtCompensada,
              indexAluno,
              aluno?.dadosIniciaisListasAusenciasCompensadas
            );
          }
        }}
        valueOption="valor"
        valueText="descricao"
        lista={listaMaximoCompensar}
        valueSelect={qtCompensada || undefined}
        placeholder="Faltas"
        id={SGP_SELECT_FALTAS_COMPENSACAO}
      />
    );
  };

  const colunasListaAlunosAusenciaCompensada = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      ellipsis: true,
    },
    {
      title: 'Compensações',
      dataIndex: 'quantidadeFaltasCompensadas',
      render: (qtdFaltas, dadosAluno) => {
        return montaCompensacao(qtdFaltas ? String(qtdFaltas) : '', dadosAluno);
      },
    },
  ];

  if (exibirColunaAulas) {
    colunasListaAlunosAusenciaCompensada.push({
      title: 'Aulas',
      width: '85px',
      align: 'center',
      render: (_, dadosAluno, indexAluno) => (
        <BtnEditarCompensacoes
          listaAusenciaCompensada={listaAusenciaCompensada}
          atualizarValoresListaCompensacao={atualizarValoresListaCompensacao}
          desabilitarCampos={desabilitarCampos}
          dadosAluno={dadosAluno}
          idCompensacaoAusencia={idCompensacaoAusencia}
          turmaCodigo={turmaCodigo}
          bimestre={bimestre}
          disciplinaId={disciplinaId}
          indexAluno={indexAluno}
        />
      ),
    });
  }

  const onSelectRowAlunos = ids => {
    onSelectRow(ids);
  };

  return (
    <>
      <Label text="Estudantes com Ausências Compensadas" />
      <CardTabelaAlunos>
        <DataTable
          scroll={{ y: 420 }}
          id={SGP_TABLE_LISTA_ALUNOS_AUSENCIA_COMPENSADA}
          selectedRowKeys={idsAlunosAusenciaCompensadas}
          onSelectRow={onSelectRowAlunos}
          columns={colunasListaAlunosAusenciaCompensada}
          dataSource={listaAusenciaCompensada}
          selectMultipleRows
          pagination={false}
          pageSize={9999}
        />
      </CardTabelaAlunos>
    </>
  );
};

ListaAlunosAusenciasCompensadas.propTypes = {
  listaAusenciaCompensada: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  idsAlunosAusenciaCompensadas: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),
  onSelectRow: PropTypes.func,
  atualizarValoresListaCompensacao: PropTypes.func,
  desabilitarCampos: PropTypes.bool,
};

ListaAlunosAusenciasCompensadas.defaultProps = {
  listaAusenciaCompensada: [],
  idsAlunosAusenciaCompensadas: [],
  onSelectRow: () => {},
  atualizarValoresListaCompensacao: () => {},
  desabilitarCampos: false,
};

export default ListaAlunosAusenciasCompensadas;
