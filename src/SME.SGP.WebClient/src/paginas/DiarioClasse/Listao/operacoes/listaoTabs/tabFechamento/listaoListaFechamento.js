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
import { ContainerAuditoria } from '~/paginas/Fechamento/FechamentoFinal/fechamentoFinal.css';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import FiltroComponentesRegencia from '../componentes/filtroComponentesRegencia';
import MarcadorAguardandoAprovacao from '../componentes/marcadorAguardandoAprovacao';
import {
  LinhaTabela,
  MarcadorSituacao,
} from '../tabFrequencia/lista/listaFrequencia.css';
import ListaoCampoConceito from '../tabListaoAvaliacoes/componentes/listaoCampoConceito';
import ListaoCampoNota from '../tabListaoAvaliacoes/componentes/listaoCampoNota';
import ColunaNotaConceitoPorBimestre from './componentes/colunaNotaConceitoPorBimestre';
import ModalJustificativaFechamento from './componentes/modalJustificativaFechamento';
import SituacaoFechamentoListao from './componentes/situacaoFechamentoListao';

export const ContainerTableFechamento = styled.div`
  tr {
    position: relative;
  }

  td {
    padding: 8px 12px !important;
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
  } = useContext(ListaoContext);

  const { ehEJA } = props;

  const ehRegencia = componenteCurricular?.regencia;

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const ehFinal = bimestreOperacoes === BIMESTRE_FINAL;

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
        // novosDados.alunos[indexEstudante][refNomeParamOrigemDados][
        //   indexNotaFechamento
        // ].notaConceito = valorNovo;
        // novosDados.alunos[indexEstudante][refNomeParamOrigemDados][
        //   indexNotaFechamento
        // ].modoEdicao = true;

        // TODO - Validar nos bimestre de 1 a 4 trazer o objeto montado mesmo quando não tiver valor!
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
          <>
            <ListaoCampoNota
              dadosNota={notaFechamento}
              idCampo={shortid.generate()}
              desabilitar={desabilitar}
              podeEditar={dadosEstudante?.podeEditar}
              ehFechamento
              periodoFim={dadosFechamento?.dataFechamento}
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
          </>
        );
      case notasConceitos.Conceitos:
        return (
          <>
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
          dadosEstudante.notasConceitoFinal[indexNotaFechamento];

        return montarCampoNotaConceito(
          dadosEstudante,
          notaFechamento,
          indexNotaFechamento,
          'notasConceitoFinal'
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

    if (ehRegencia) {
      paramsCol.render = dadosEstudante => {
        const temNotaConceitoEmAprovacao = dadosEstudante?.notasConceitoBimestre?.find?.(
          item => item?.emAprovacao
        );
        if (temNotaConceitoEmAprovacao) return <MarcadorAguardandoAprovacao />;

        return <></>;
      };
    } else {
      paramsCol.render = dadosEstudante => {
        // Quando não for regência vai ter somente um(a) nota/conceito!
        const indexNotaFechamento = 0;
        const notaFechamento =
          dadosEstudante.notasConceitoBimestre?.[indexNotaFechamento];

        return montarCampoNotaConceito(
          dadosEstudante,
          notaFechamento,
          indexNotaFechamento,
          'notasConceitoBimestre'
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

    const nomeRef = ehFinal ? 'notasConceitoFinal' : 'notasConceitoBimestre';

    if (estudante?.[nomeRef]?.length) {
      estudante[nomeRef].forEach((item, index) => {
        colunasRegencia.push({
          title: item?.disciplina,
          align: 'center',
          dataIndex: `${nomeRef}[${index}]`,
          key: `${nomeRef}[${index}]`,
          width: '110px',
          render: dados =>
            montarCampoNotaConceito(estudante, dados, index, nomeRef),
        });
      });
    }

    return colunasRegencia;
  };

  const getExpandIconColumnIndex = () => {
    let expandIconColumnIndex = 2;
    if (ehFinal) {
      expandIconColumnIndex = 6;
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

  const montarTabelaRegencia = () => (
    <>
      {!ehFinal && <SituacaoFechamentoListao />}
      <LinhaTabela className="col-md-12 p-0">
        {ehFinal && (
          <FiltroComponentesRegencia
            ehRegencia={ehRegencia}
            ehSintese={!!dadosFechamento?.ehSintese}
          />
        )}
        <DataTable
          fixExpandedRowResetColSpan
          scroll={{ x: 1000, y: 500 }}
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
              />
            );
          }}
          expandIcon={({ expanded, onExpand, record }) =>
            expandIcon(expanded, onExpand, record)
          }
        />
        {getAuditoria()}
      </LinhaTabela>
    </>
  );

  return ehRegencia ? (
    montarTabelaRegencia()
  ) : (
    <>
      {!ehFinal && <SituacaoFechamentoListao />}
      <ContainerTableFechamento className="col-md-12 p-0">
        <DataTable
          scroll={{ x: 1000, y: 500 }}
          columns={colunasEstudantes}
          dataSource={dadosFechamento?.alunos}
          pagination={false}
          semHover
          tableResponsive={false}
          idLinha="codigoAluno"
        />
      </ContainerTableFechamento>
      {getAuditoria()}
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
