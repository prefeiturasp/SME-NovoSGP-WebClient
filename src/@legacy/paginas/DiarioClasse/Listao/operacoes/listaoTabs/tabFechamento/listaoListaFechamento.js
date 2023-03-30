import {
  faChevronDown,
  faChevronUp,
  faMinusCircle,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { DataTable, Label } from '~/componentes';
import Nota from '~/componentes-sgp/inputs/nota';
import { moverFocoCampoNota } from '~/componentes-sgp/inputs/nota/funcoes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import { BIMESTRE_FINAL } from '~/constantes/constantes';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { ContainerAuditoria } from '~/paginas/Fechamento/FechamentoFinal/fechamentoFinal.css';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import {
  formatarFrequencia,
  tratarStringComponenteCurricularNome,
} from '~/utils';
import FiltroComponentesRegencia from '../componentes/filtroComponentesRegencia';
import MarcadorAguardandoAprovacao from '../componentes/marcadorAguardandoAprovacao';
import {
  LinhaTabela,
  MarcadorSituacao,
} from '../tabFrequencia/lista/listaFrequencia.css';
import ListaoCampoConceito from '../tabListaoAvaliacoes/componentes/listaoCampoConceito';
import AnotacoesFechamentoLisao from './componentes/anotacoesFechamentoLisao';
import ColunaNotaConceitoPorBimestre from './componentes/colunaNotaConceitoPorBimestre';
import DadosCabecalhoTabFechamentoListao from './componentes/dadosCabecalhoTabFechamentoListao';
import ModalJustificativaFechamento from './componentes/modalJustificativaFechamento';
import TabelaAvaliacoesFechamento from './componentes/tabelaAvaliacoesFechamento';

export const ContainerTableFechamento = styled.div`
  tr {
    position: relative;
  }

  td {
    padding: 8px 12px !important;
  }

  .ant-table-expanded-row {
    td {
      .table-responsive {
        overflow: auto !important;
      }
    }

    .padding-componentes-regencia {
      td {
        padding: 2px !important;
      }
    }

    .icone-inicial-linha-expandida {
      tbody {
        th {
          background: ${Base.RoxoBorda} !important;
        }

        &::after {
          content: ' ';
          position: absolute;
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
          border: 1px solid ${Base.Roxo};
          height: 27px;
          left: -24px;
          top: -2px;
          white-space: nowrap;
        }

        &::before {
          content: '\f30b';
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
          font-size: 16px;
          color: ${Base.Roxo};
          position: absolute;
          left: -23px;
          top: 12px;
        }
      }
    }
  }
`;

const ListaoListaFechamento = props => {
  const dispatch = useDispatch();

  const {
    componenteCurricular,
    dadosFechamento,
    setDadosFechamento,
    somenteConsultaListao,
    periodoAbertoListao,
    bimestreOperacoes,
    listaoEhInfantil,
  } = useContext(ListaoContext);

  const ehRegencia = componenteCurricular?.regencia;

  const [expandedRowKeys, setExpandedRowKeys] = useState(
    dadosFechamento?.alunos?.map(a => ({
      codigoAluno: a?.codigoAluno,
      ocultarNotaConceito: !ehRegencia,
      expandirAvaliacoes: false,
    }))
  );

  const { ehEJA } = props;

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const ehFinal = bimestreOperacoes === BIMESTRE_FINAL;

  const montarColunaNumeroEstudante = aluno => (
    <span className="d-flex justify-content-center">
      <span>{aluno.numeroChamada}</span>

      {aluno?.marcador && (
        <Tooltip title={aluno?.marcador?.descricao} placement="top">
          <MarcadorSituacao
            className="fas fa-circle"
            style={{
              marginRight: '-10px',
              color: Base.Roxo,
            }}
          />
        </Tooltip>
      )}
    </span>
  );

  const temLinhaAvaliacoesExpandida = codigoAluno =>
    !!expandedRowKeys?.find?.(
      r => r?.codigoAluno === codigoAluno && !!r?.expandirAvaliacoes
    );

  const temLinhaNotaConceitoExpandida = codigoAluno =>
    !!expandedRowKeys?.find?.(
      r => r?.codigoAluno === codigoAluno && !r?.ocultarNotaConceito
    );

  const montarColunaEstudante = aluno => {
    return (
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">{aluno.nome}</div>
        <div className=" d-flex justify-content-end">
          <div className="mr-3">
            <SinalizacaoAEE exibirSinalizacao={aluno.ehAtendidoAEE} />
          </div>
          {!ehFinal && (
            <AnotacoesFechamentoLisao
              desabilitar={desabilitarCampos || !aluno?.podeEditar}
              ehInfantil={listaoEhInfantil}
              aluno={aluno}
              fechamentoId={dadosFechamento.fechamentoId}
              dadosFechamento={dadosFechamento}
              setDadosFechamento={setDadosFechamento}
            />
          )}
        </div>
      </div>
    );
  };

  const onChangeNotaConceito = (
    valorNovo,
    codigoAluno,
    podeEditar,
    indexNotaFechamento,
    refNomeParamOrigemDados
  ) => {
    if (!desabilitarCampos && podeEditar && dadosFechamento?.alunos?.length) {
      const alunos = dadosFechamento?.alunos;

      const aluno = alunos.find?.(item => item?.codigoAluno === codigoAluno);
      if (aluno) {
        const indexEstudante = alunos?.indexOf?.(aluno);
        const novosDados = dadosFechamento;
        const dadosItemAtual =
          novosDados.alunos[indexEstudante][refNomeParamOrigemDados];

        if (dadosItemAtual[indexNotaFechamento]) {
          dadosItemAtual[indexNotaFechamento].notaConceito = valorNovo;
          dadosItemAtual[indexNotaFechamento].modoEdicao = true;
        } else {
          novosDados.alunos[indexEstudante][refNomeParamOrigemDados] = [
            {
              notaConceito: valorNovo,
              modoEdicao: true,
            },
          ];
        }

        setDadosFechamento(dadosFechamento);
        dispatch(setTelaEmEdicao(true));
      }
    }
  };

  const onClickExpandirAvaliacoes = (expandirAvaliacoes, codigoAluno) => {
    let index = 0;
    let alunoExpandido = null;

    if (expandedRowKeys?.length) {
      alunoExpandido = expandedRowKeys?.find(
        r => r.codigoAluno?.toString() === codigoAluno?.toString()
      );
      index = expandedRowKeys.indexOf(alunoExpandido);

      if (index > -1) {
        const rowKeys = [...expandedRowKeys];
        rowKeys[index].expandirAvaliacoes = expandirAvaliacoes;
        setExpandedRowKeys(rowKeys);
      }
    } else {
      setExpandedRowKeys([
        {
          codigoAluno,
          expandirAvaliacoes,
        },
      ]);
    }
  };

  const onClickExpandirNotaConceitoRegencia = (
    ocultarNotaConceito,
    codigoAluno
  ) => {
    let index = 0;
    let alunoExpandido = null;

    if (expandedRowKeys?.length) {
      alunoExpandido = expandedRowKeys?.find(
        r => r.codigoAluno?.toString() === codigoAluno?.toString()
      );
      index = expandedRowKeys.indexOf(alunoExpandido);

      if (index > -1) {
        const rowKeys = [...expandedRowKeys];
        rowKeys[index].ocultarNotaConceito = ocultarNotaConceito;
        setExpandedRowKeys(rowKeys);
      }
    } else {
      setExpandedRowKeys([
        {
          codigoAluno,
          ocultarNotaConceito,
        },
      ]);
    }
  };

  const onKeyDownAcaoExpandirLinhaRegencia = (
    incrementoIndexLinha,
    indexLinhaOrigem
  ) => {
    const indexLinhaDestino = incrementoIndexLinha + indexLinhaOrigem;
    const aluno = dadosFechamento?.alunos[indexLinhaDestino];
    if (aluno?.codigoAluno) {
      onClickExpandirNotaConceitoRegencia(false, aluno?.codigoAluno);
    }
  };

  const onKeyDown = (
    e,
    dadosEstudante,
    indexLinha,
    componenteCurricularNome
  ) => {
    const params = {
      e,
      aluno: dadosEstudante,
      alunos: dadosFechamento?.alunos,
      regencia: ehRegencia,
      componenteCurricularNome,
      chaveAluno: 'codigoAluno',
      acaoExpandirLinha: direcao =>
        onKeyDownAcaoExpandirLinhaRegencia(direcao, indexLinha),
    };

    if (ehFinal) {
      params.qtdColunasSemCampoNota = 6;
    }

    moverFocoCampoNota(params);
  };

  const montarCampoNotaConceito = (
    dadosEstudante,
    notaFechamento,
    indexNotaFechamento,
    refNomeParamOrigemDados,
    indexLinha = 0
  ) => {
    const desabilitar = desabilitarCampos || !dadosEstudante?.podeEditar;

    const dadosArredondamentoFechamento = dadosFechamento?.dadosArredondamento;

    let idDisciplina = '';

    if (ehRegencia) {
      const nomeComponenteCurricular = tratarStringComponenteCurricularNome(
        notaFechamento?.disciplina
      );
      idDisciplina = `${nomeComponenteCurricular}${dadosEstudante?.codigoAluno}`;
    }
    switch (Number(dadosFechamento?.notaTipo)) {
      case notasConceitos.Notas:
        return (
          <div name={idDisciplina} id={idDisciplina}>
            {ehRegencia && (
              <Label
                text={notaFechamento?.disciplina}
                tamanhoFonte="11"
                altura="0"
              />
            )}
            <Nota
              styleContainer={{ padding: '3px 20px 11px' }}
              ehFechamento
              onKeyDown={e =>
                onKeyDown(
                  e,
                  dadosEstudante,
                  indexLinha,
                  notaFechamento?.disciplina
                )
              }
              dadosNota={notaFechamento}
              desabilitar={desabilitar}
              id={`aluno${dadosEstudante?.codigoAluno}`}
              name={`aluno${dadosEstudante?.codigoAluno}`}
              dadosArredondamento={dadosArredondamentoFechamento}
              mediaAprovacaoBimestre={dadosFechamento?.mediaAprovacaoBimestre}
              onChangeNotaConceito={valorNovo =>
                onChangeNotaConceito(
                  valorNovo,
                  dadosEstudante?.codigoAluno,
                  dadosEstudante?.podeEditar,
                  indexNotaFechamento,
                  refNomeParamOrigemDados
                )
              }
            />
            {notaFechamento?.emAprovacao && <MarcadorAguardandoAprovacao />}
          </div>
        );
      case notasConceitos.Conceitos:
        return (
          <>
            {ehRegencia && (
              <Label
                text={notaFechamento?.disciplina}
                tamanhoFonte="11"
                altura="0"
              />
            )}
            <ListaoCampoConceito
              styleContainer={{ padding: '3px 20px 11px' }}
              dadosConceito={notaFechamento}
              idCampo={shortid.generate()}
              desabilitar={desabilitar}
              listaTiposConceitos={dadosFechamento?.listaTiposConceitos}
              ehFechamento
              onChangeNotaConceito={valorNovo =>
                onChangeNotaConceito(
                  valorNovo,
                  dadosEstudante?.codigoAluno,
                  dadosEstudante?.podeEditar,
                  indexNotaFechamento,
                  refNomeParamOrigemDados
                )
              }
            />
            {notaFechamento?.emAprovacao && <MarcadorAguardandoAprovacao />}
          </>
        );
      default:
        return '';
    }
  };

  const montarColunaNotaConceitoPorBimestre = () => {
    const bimestres = [1, 2];
    if (!ehEJA) {
      bimestres.push(3);
      bimestres.push(4);
    }

    const mapColunas = bimestres.map(bimestre => {
      return {
        title: `${bimestre}º`,
        align: 'center',
        width: '70px',
        key: `${bimestre}º`,
        render: dadosEstudante => {
          const { notasConceitoBimestre } = dadosEstudante;
          return (
            <ColunaNotaConceitoPorBimestre
              ehRegencia={ehRegencia}
              notaTipo={Number(dadosFechamento?.notaTipo)}
              bimestre={bimestre}
              notasConceitoBimestre={notasConceitoBimestre}
              listaTiposConceitos={dadosFechamento?.listaTiposConceitos || []}
            />
          );
        },
      };
    });

    return mapColunas;
  };

  const iconeExpandirLinhaRegencia = (alunoExpandido, dadosEstudante) => (
    <FontAwesomeIcon
      style={{
        fontSize: 18,
        cursor: 'pointer',
        color: Base.Roxo,
      }}
      icon={alunoExpandido ? faMinusCircle : faPlusCircle}
      onClick={() =>
        onClickExpandirNotaConceitoRegencia(
          alunoExpandido,
          dadosEstudante?.codigoAluno
        )
      }
    />
  );

  const colunasEstudantes = [
    {
      title: 'Nº',
      align: 'center',
      width: '60px',
      render: montarColunaNumeroEstudante,
    },
    {
      title: 'Nome do estudante',
      render: montarColunaEstudante,
    },
  ];

  if (ehFinal) {
    colunasEstudantes.push({
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota bimestre'
          : 'Conceito bimestre',
      align: 'center',
      width: '115px',
      children: montarColunaNotaConceitoPorBimestre(),
    });

    const paramsColFinal = {
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota final'
          : 'Conceito final',
      align: 'center',
      width: '115px',
      className: 'position-relative',
    };

    if (ehRegencia) {
      paramsColFinal.render = dadosEstudante => {
        const temNotaConceitoEmAprovacao =
          dadosEstudante?.notasConceitoFinal?.find?.(item => item?.emAprovacao);

        const alunoExpandido = temLinhaNotaConceitoExpandida(
          dadosEstudante?.codigoAluno
        );
        const iconeExpandir = iconeExpandirLinhaRegencia(
          alunoExpandido,
          dadosEstudante
        );

        if (temNotaConceitoEmAprovacao)
          return (
            <>
              {iconeExpandir}
              <MarcadorAguardandoAprovacao />
            </>
          );

        return iconeExpandir;
      };
    } else {
      paramsColFinal.render = (dadosEstudante, _, indexLinha) => {
        // Quando não for regência vai ter somente um(a) nota/conceito!
        const indexNotaFechamento = 0;
        const notaFechamento =
          dadosEstudante.notasConceitoFinal[indexNotaFechamento];

        return montarCampoNotaConceito(
          dadosEstudante,
          notaFechamento,
          indexNotaFechamento,
          'notasConceitoFinal',
          indexLinha
        );
      };
    }
    colunasEstudantes.push(paramsColFinal);
  } else {
    const paramsCol = {
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota'
          : 'Conceito',
      align: 'center',
      width: '115px',
      className: 'position-relative',
    };

    if (ehRegencia) {
      paramsCol.render = dadosEstudante => {
        const temNotaConceitoEmAprovacao =
          dadosEstudante?.notasConceitoBimestre?.find?.(
            item => item?.emAprovacao
          );

        const alunoExpandido = temLinhaNotaConceitoExpandida(
          dadosEstudante?.codigoAluno
        );
        const iconeExpandir = iconeExpandirLinhaRegencia(
          alunoExpandido,
          dadosEstudante
        );

        if (temNotaConceitoEmAprovacao)
          return (
            <>
              {iconeExpandir}
              <MarcadorAguardandoAprovacao />
            </>
          );

        return iconeExpandir;
      };
    } else {
      paramsCol.render = (dadosEstudante, _, indexLinha) => {
        // Quando não for regência vai ter somente um(a) nota/conceito!
        const indexNotaFechamento = 0;
        const notaFechamento =
          dadosEstudante.notasConceitoBimestre?.[indexNotaFechamento];

        return montarCampoNotaConceito(
          dadosEstudante,
          notaFechamento,
          indexNotaFechamento,
          'notasConceitoBimestre',
          indexLinha
        );
      };
    }
    colunasEstudantes.push(paramsCol);
  }

  if (componenteCurricular?.registraFrequencia) {
    colunasEstudantes.push({
      title: 'Frequência',
      align: 'center',
      dataIndex: 'frequencia',
      width: '115px',
      render: percentualFrequencia => formatarFrequencia(percentualFrequencia),
    });
  }

  if (dadosFechamento?.possuiAvaliacao) {
    colunasEstudantes.push({
      title: 'Avaliações',
      align: 'center',
      width: '115px',
      render: dadosEstudante => {
        const alunoExpandido = temLinhaAvaliacoesExpandida(
          dadosEstudante?.codigoAluno
        );
        return (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              onClickExpandirAvaliacoes(
                !alunoExpandido,
                dadosEstudante?.codigoAluno
              )
            }
          >
            <div style={{ marginRight: '4px' }}>Detalhar</div>
            <FontAwesomeIcon
              style={{
                fontSize: 16,
                cursor: 'pointer',
                color: Base.CinzaMako,
              }}
              icon={alunoExpandido ? faChevronUp : faChevronDown}
            />
          </div>
        );
      },
    });
  }

  const montarColunasNotasConceitosRegencia = (estudante, indexAluno) => {
    const colunasRegencia = [
      {
        align: 'left',
        render: () => 'Componentes regência de classe',
      },
    ];

    const nomeRef = ehFinal ? 'notasConceitoFinal' : 'notasConceitoBimestre';

    if (estudante?.[nomeRef]?.length) {
      estudante[nomeRef].forEach((item, index) => {
        colunasRegencia.push({
          title: item?.disciplina,
          align: 'center',
          dataIndex: [`${nomeRef}`, `${index}`],
          key: `${nomeRef}[${index}]`,
          width: '115px',
          className: 'position-relative',
          render: dados =>
            montarCampoNotaConceito(
              estudante,
              dados,
              index,
              nomeRef,
              indexAluno
            ),
        });
      });
    }

    return colunasRegencia;
  };

  const getExpandIconColumnIndex = () => {
    let expandIconColumnIndex = 2;
    if (ehFinal) {
      expandIconColumnIndex = ehEJA ? 4 : 6;
    }
    return expandIconColumnIndex;
  };

  const getAuditoria = () => (
    <div className="row mt-2 mb-2 mt-2">
      <div className="col-md-12">
        <ContainerAuditoria style={{ float: 'left' }}>
          <span>
            <p>{dadosFechamento?.auditoriaInclusao || ''}</p>
            <p>{dadosFechamento?.auditoriaAlteracao || ''}</p>
          </span>
        </ContainerAuditoria>
      </div>
    </div>
  );

  const getExpandedRowKeys = () => {
    if (expandedRowKeys?.length) {
      const alunosExpandidos = expandedRowKeys.filter(
        r => !r?.ocultarNotaConceito || !!r.expandirAvaliacoes
      );
      return alunosExpandidos.map(a => a.codigoAluno);
    }
    return [];
  };

  const montarTabelaRegencia = () => (
    <>
      {!ehFinal && (
        <DadosCabecalhoTabFechamentoListao
          desabilitarCampos={desabilitarCampos}
        />
      )}
      <LinhaTabela className="col-md-12 p-0">
        {ehFinal && (
          <FiltroComponentesRegencia
            ehRegencia={ehRegencia}
            ehSintese={!!dadosFechamento?.ehSintese}
          />
        )}
        <DataTable
          fixExpandedRowResetColSpan
          scroll={{ x: '100%', y: 500 }}
          columns={colunasEstudantes}
          dataSource={dadosFechamento?.alunos}
          pagination={false}
          semHover
          tableResponsive={false}
          idLinha="codigoAluno"
          expandIconColumnIndex={getExpandIconColumnIndex()}
          expandedRowKeys={getExpandedRowKeys()}
          expandedRowRender={(record, indexAluno) => {
            const colunasDetalhe = montarColunasNotasConceitosRegencia(
              record,
              indexAluno
            );
            const linhaAvaliacaoExpandida = temLinhaAvaliacoesExpandida(
              record?.codigoAluno
            );
            const linhaNotaConceitoExpandida = temLinhaNotaConceitoExpandida(
              record?.codigoAluno
            );

            return (
              <>
                {linhaNotaConceitoExpandida && (
                  <div className="icone-inicial-linha-expandida padding-componentes-regencia">
                    <DataTable
                      showHeader={false}
                      id={`tabela-aluno-${record?.codigoAluno}`}
                      idLinha="codigoAluno"
                      pagination={false}
                      columns={colunasDetalhe}
                      dataSource={[record]}
                      semHover
                      rowClassName="linha-expandida-regencia-listao-fechamento"
                    />
                  </div>
                )}
                {linhaAvaliacaoExpandida && (
                  <TabelaAvaliacoesFechamento
                    codigoAluno={record?.codigoAluno}
                    periodoEscolarId={dadosFechamento?.periodoEscolarId}
                    ehNota={
                      Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
                    }
                    listaTiposConceitos={dadosFechamento?.listaTiposConceitos}
                    componenteCurricular={componenteCurricular}
                  />
                )}
              </>
            );
          }}
          expandIcon={() => ''}
        />
        {getAuditoria()}
      </LinhaTabela>
    </>
  );

  const montarDados = () => (
    <>
      {!ehFinal && (
        <DadosCabecalhoTabFechamentoListao
          desabilitarCampos={desabilitarCampos}
        />
      )}
      <LinhaTabela className="col-md-12 p-0">
        <DataTable
          scroll={{ x: '100%', y: 500 }}
          fixExpandedRowResetColSpan
          columns={colunasEstudantes}
          dataSource={dadosFechamento?.alunos}
          pagination={false}
          semHover
          idLinha="codigoAluno"
          expandIconColumnIndex={getExpandIconColumnIndex()}
          expandedRowKeys={getExpandedRowKeys()}
          expandedRowRender={record => {
            return (
              <TabelaAvaliacoesFechamento
                codigoAluno={record?.codigoAluno}
                periodoEscolarId={dadosFechamento?.periodoEscolarId}
                ehNota={
                  Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
                }
                listaTiposConceitos={dadosFechamento?.listaTiposConceitos}
                componenteCurricular={componenteCurricular}
              />
            );
          }}
          expandIcon={() => ''}
        />
      </LinhaTabela>
      {getAuditoria()}
    </>
  );

  return (
    <>
      <ContainerTableFechamento>
        {ehRegencia ? montarTabelaRegencia() : montarDados()}
      </ContainerTableFechamento>
      <ModalJustificativaFechamento />
    </>
  );
};

ListaoListaFechamento.propTypes = {
  ehEJA: PropTypes.bool,
};

ListaoListaFechamento.defaultProps = {
  ehEJA: false,
};

export default ListaoListaFechamento;
