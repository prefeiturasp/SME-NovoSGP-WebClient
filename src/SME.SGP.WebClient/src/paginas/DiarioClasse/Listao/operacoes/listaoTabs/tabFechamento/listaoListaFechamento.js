import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import { BIMESTRE_FINAL } from '~/constantes/constantes';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import {
  LinhaTabela,
  MarcadorSituacao,
} from '../tabFrequencia/lista/listaFrequencia.css';
import ListaoCampoConceito from '../tabListaoAvaliacoes/componentes/listaoCampoConceito';
import ListaoCampoNota from '../tabListaoAvaliacoes/componentes/listaoCampoNota';

// TODO - ADD EM OUTRO ARQUIVO!
export const ContainerTableFechamento = styled.div`
  tr {
    position: relative;
  }
`;

// TODO - ADD EM OUTRO ARQUIVO!
export const ContainerDescConceito = styled.div`
  padding: 7px 7px 7px 7px;
  border-radius: 3px;
  border: solid 1px #ced4da;
  background-color: #f5f6f8;
  argin-left: 5px;
  color: #a4a4a4;
  width: 53px;
  height: 37px;
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
  } = useContext(ListaoContext);

  const { ehEJA } = props;

  const ehRegencia = componenteCurricular?.regencia;

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const montarColunaNumeroEstudante = aluno => {
    return (
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
  };

  const montarColunaEstudante = aluno => {
    return (
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">{aluno.nome}</div>
        <div className=" d-flex justify-content-end">
          <SinalizacaoAEE exibirSinalizacao={aluno.ehAtendidoAEE} />
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
        novosDados.alunos[indexEstudante][refNomeParamOrigemDados][
          indexNotaFechamento
        ].notaConceito = valorNovo;
        novosDados.alunos[indexEstudante][refNomeParamOrigemDados][
          indexNotaFechamento
        ].modoEdicao = true;

        setDadosFechamento(dadosFechamento);
        dispatch(setTelaEmEdicao(true));
      }
    }
  };

  const montarCampoNotaConceito = (
    dadosEstudante,
    notaFechamento,
    indexNotaFechamento,
    refNomeParamOrigemDados
  ) => {
    const desabilitar = desabilitarCampos || !dadosEstudante?.podeEditar;

    switch (Number(dadosFechamento?.notaTipo)) {
      case notasConceitos.Notas:
        return (
          <ListaoCampoNota
            dadosNota={notaFechamento}
            idCampo={shortid.generate()}
            desabilitar={desabilitar}
            podeEditar={dadosEstudante?.podeEditar}
            ehFechamento
            periodoFim={dadosFechamento?.periodoFim}
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
        );
      case notasConceitos.Conceitos:
        return (
          <ListaoCampoConceito
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
        );
      default:
        return '';
    }
  };

  const obterDescricaoConceito = valor => {
    if (dadosFechamento?.listaTiposConceitos?.length) {
      const conceito = dadosFechamento.listaTiposConceitos.find(
        item => item.id === String(valor)
      );
      return conceito?.valor || '';
    }
    return '';
  };

  const montarColunaNotaConceitoPorBimestre = () => {
    // TODO - disciplinaId Quando for FINAL e for regente selecionar uma disciplina para filtrar as notas/conceitos do bimestre
    const disciplinaId = 138;

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
          const { notasConceitosBimestre } = dadosEstudante;

          let notaBimestre = {};
          if (ehRegencia) {
            notaBimestre = notasConceitosBimestre.find(
              item =>
                item?.bimestre === bimestre &&
                item?.disciplinaId === disciplinaId
            );
          } else {
            notaBimestre = notasConceitosBimestre.find(
              item => item?.bimestre === bimestre
            );
          }

          let valorExibir = '';

          if (Number(dadosFechamento?.notaTipo) === notasConceitos.Conceitos) {
            valorExibir = obterDescricaoConceito(notaBimestre?.notaConceito);
          } else {
            valorExibir = notaBimestre?.notaConceito;
          }
          return <ContainerDescConceito>{valorExibir}</ContainerDescConceito>;
        },
      };
    });

    return mapColunas;
  };

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

  if (bimestreOperacoes === BIMESTRE_FINAL) {
    colunasEstudantes.push({
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota bimestre'
          : 'Conceito bimestre',
      align: 'center',
      width: '110px',
      children: montarColunaNotaConceitoPorBimestre(),
    });

    const paramsColFinal = {
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota final'
          : 'Conceito final',
      align: 'center',
      width: '110px',
    };

    if (!ehRegencia) {
      paramsColFinal.render = dadosEstudante => {
        // Quando não for regência vai ter somente um(a) nota/conceito!
        const indexNotaFechamento = 0;
        const notaFechamento =
          dadosEstudante.notasConceitosFinal[indexNotaFechamento];

        return montarCampoNotaConceito(
          dadosEstudante,
          notaFechamento,
          indexNotaFechamento,
          'notasConceitosFinal'
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
      width: '110px',
    };
    if (!ehRegencia) {
      paramsCol.render = dadosEstudante => {
        // Quando não for regência vai ter somente um(a) nota/conceito!
        const indexNotaFechamento = 0;
        const notaFechamento =
          dadosEstudante.notasConceitosBimestre?.[indexNotaFechamento];

        return montarCampoNotaConceito(
          dadosEstudante,
          notaFechamento,
          indexNotaFechamento,
          'notasConceitosBimestre'
        );
      };
    }
    colunasEstudantes.push(paramsCol);
  }

  if (componenteCurricular?.registraFrequencia) {
    colunasEstudantes.push({
      title: 'Frequência',
      align: 'center',
      dataIndex: 'percentualFrequencia',
      width: '110px',
      render: percentualFrequencia =>
        percentualFrequencia ? `${percentualFrequencia}%` : '',
    });
  }

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const temLinhaExpandida = dados =>
    expandedRowKeys.filter(item => String(item) === String(dados));

  const expandIcon = (expanded, onExpand, record) => (
    <FontAwesomeIcon
      style={{
        fontSize: 18,
        cursor: 'pointer',
        color: expanded ? Base.Branco : Base.Roxo,
      }}
      icon={expanded ? faMinusCircle : faPlusCircle}
      onClick={e => onExpand(record, e)}
    />
  );

  const onClickExpandir = (expandir, dadosEstudante) => {
    if (expandir) {
      setExpandedRowKeys([dadosEstudante?.codigoAluno]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const montarColunasNotasConceitosRegencia = estudante => {
    const colunasRegencia = [
      {
        align: 'left',
        render: () => 'Componentes regência de classe',
      },
    ];
    const ehFinal = bimestreOperacoes === BIMESTRE_FINAL;

    const nomeRef = ehFinal ? 'notasConceitosFinal' : 'notasConceitosBimestre';

    if (estudante?.[nomeRef]?.length) {
      estudante[nomeRef].forEach((item, index) => {
        colunasRegencia.push({
          title: item?.disciplina,
          align: 'center',
          dataIndex: `${nomeRef}[${index}]`,
          key: `${nomeRef}[${index}]`,
          width: '122px',
          render: dados =>
            montarCampoNotaConceito(estudante, dados, index, nomeRef),
        });
      });
    }

    return colunasRegencia;
  };

  const getExpandIconColumnIndex = () => {
    const ehFinal = bimestreOperacoes === BIMESTRE_FINAL;
    let expandIconColumnIndex = 3;
    if (ehFinal) {
      expandIconColumnIndex = 7;
    }
    return expandIconColumnIndex;
  };

  const montarTabelaRegencia = () => (
    <LinhaTabela className="col-md-12 p-0">
      <DataTable
        columns={colunasEstudantes}
        dataSource={dadosFechamento?.alunos}
        pagination={false}
        semHover
        tableResponsive={false}
        idLinha="codigoAluno"
        expandIconColumnIndex={getExpandIconColumnIndex()}
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={onClickExpandir}
        rowClassName={record => {
          const ehLinhaExpandida = temLinhaExpandida(record?.codigoAluno);
          const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
          // TODO - TESTAR PERFORMANCE QUANDO TIVER A LISTA DE ESTUDANTES COMPLETA!
          // fecharLoaderMontouAlunos(i);
          return nomeClasse;
        }}
        expandedRowRender={(record, indexAluno) => {
          const colunasDetalhe = montarColunasNotasConceitosRegencia(
            record,
            indexAluno
          );
          return (
            <DataTable
              id={`tabela-aluno-${record?.codigoAluno}`}
              idLinha="codigoAluno"
              pagination={false}
              columns={colunasDetalhe}
              dataSource={[record]}
              semHover
              tableLayout="fixed"
            />
          );
        }}
        expandIcon={({ expanded, onExpand, record }) =>
          expandIcon(expanded, onExpand, record)
        }
      />
    </LinhaTabela>
  );

  return ehRegencia ? (
    montarTabelaRegencia()
  ) : (
    <ContainerTableFechamento className="col-md-12 p-0">
      <DataTable
        scroll={{ y: 500 }}
        columns={colunasEstudantes}
        dataSource={dadosFechamento?.alunos}
        pagination={false}
        semHover
        tableResponsive={false}
        idLinha="codigoAluno"
      />
    </ContainerTableFechamento>
  );
};

ListaoListaFechamento.propTypes = {
  ehEJA: PropTypes.bool,
};

ListaoListaFechamento.defaultProps = {
  ehEJA: false,
};

export default ListaoListaFechamento;
