import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable } from '~/componentes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import tipoIndicativoFrequencia from '~/dtos/tipoIndicativoFrequencia';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import CampoTiposFrequencia from './componentes/campoTiposFrequencia';
import ListaoBotaoAnotacao from './componentes/listaoBotaoAnotacao';
import ListaoModalAnotacoesFrequencia from './componentes/listaoModalAnotacaoFrequencia';
import ReposicaoLabel from './componentes/reposicaoLabel';
import {
  IndicativoAlerta,
  IndicativoCritico,
  LinhaTabela,
  MarcadorSituacao,
  TextoEstilizado,
} from './listaFrequencia.css';

const ListaoListaFrequencia = () => {
  const {
    dadosFrequencia,
    setDadosFrequencia,
    listaoEhInfantil,
    listaTiposFrequencia,
    componenteCurricular,
    somenteConsultaListao,
    periodoAbertoListao,
  } = useContext(ListaoContext);

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const dispatch = useDispatch();

  const montarTituloEstudante = () => {
    return (
      <span className="fonte-16">
        Nome {listaoEhInfantil ? 'da criança' : 'do estudante'}
      </span>
    );
  };

  const atualizarDados = () => {
    // TODO - Mover tabela para outro arquivo e renderizar ele para recarrecar somente a linha do aluno e não a tabela toda novamente!
    setDadosFrequencia({ ...dadosFrequencia });
  };

  const montarColunaFrequenciaMarcarTodasAulas = aulaHeader => {
    let tisposInseridos = [];

    dadosFrequencia.alunos.forEach(a => {
      const aulasPorAulaId = a.aulas.filter(
        item => item.aulaId === aulaHeader.aulaId
      );
      if (aulasPorAulaId?.length) {
        tisposInseridos = tisposInseridos.concat(
          aulasPorAulaId.map(b => b.tipoFrequencia)
        );
      }
    });

    const tipoFreqTodos = listaTiposFrequencia.find(tipo => {
      const somenteEsteTipo = tisposInseridos.every(c => c === tipo.valor);
      return somenteEsteTipo;
    });

    return (
      <CampoTiposFrequencia
        tipoFrequencia={tipoFreqTodos?.valor || ''}
        listaTiposFrequencia={listaTiposFrequencia}
        onChange={valorNovo => {
          if (!desabilitarCampos) {
            let alterouFreq = false;
            dadosFrequencia.alunos.forEach(aluno => {
              aluno.aulas.forEach(diaAula => {
                if (
                  !diaAula.desabilitado &&
                  aulaHeader.aulaId === diaAula.aulaId
                ) {
                  aulaHeader.tipoFrequencia = valorNovo;
                  diaAula.tipoFrequencia = valorNovo;
                  diaAula.alterado = true;
                  alterouFreq = true;
                  diaAula.detalheFrequencia.forEach(aula => {
                    aula.tipoFrequencia = valorNovo;
                  });
                }
              });
            });
            if (alterouFreq) {
              dispatch(setTelaEmEdicao(true));
              atualizarDados();
            }
          }
        }}
        desabilitar={desabilitarCampos}
      />
    );
  };

  const montarColunaFrequenciaDiaria = dadosDiaAula => {
    return (
      <CampoTiposFrequencia
        tipoFrequencia={dadosDiaAula?.tipoFrequencia}
        listaTiposFrequencia={listaTiposFrequencia}
        onChange={valorNovo => {
          dadosDiaAula.alterado = true;
          dadosDiaAula.tipoFrequencia = valorNovo;
          dadosDiaAula.detalheFrequencia.forEach(item => {
            item.tipoFrequencia = valorNovo;
          });
          dispatch(setTelaEmEdicao(true));
          atualizarDados();
        }}
        desabilitar={desabilitarCampos || dadosDiaAula?.desabilitado}
      />
    );
  };

  const montarColunaFrequenciaAula = (detalheFreq, dadosAula) => {
    return (
      <CampoTiposFrequencia
        tipoFrequencia={detalheFreq.tipoFrequencia}
        listaTiposFrequencia={listaTiposFrequencia}
        onChange={valorNovo => {
          dadosAula.alterado = true;
          detalheFreq.tipoFrequencia = valorNovo;

          const aulasDetalhe = dadosAula.detalheFrequencia.map(
            item => item.tipoFrequencia
          );

          const tipoFreqAluno = listaTiposFrequencia.find(tipo => {
            const somenteEsteTipo = aulasDetalhe.every(c => c === tipo.valor);
            return somenteEsteTipo;
          });

          dadosAula.tipoFrequencia = tipoFreqAluno?.valor || '';

          dispatch(setTelaEmEdicao(true));
          atualizarDados();
        }}
        desabilitar={desabilitarCampos || dadosAula?.desabilitado}
      />
    );
  };
  const montarColunaNumeroAula = aluno => {
    return (
      <span className="d-flex justify-content-center">
        <span className={desabilitarCampos ? 'desabilitar' : ''}>
          {aluno.numeroAlunoChamada}
        </span>

        {aluno?.marcador ? (
          <Tooltip title={aluno?.marcador?.descricao} placement="top">
            <MarcadorSituacao
              className="fas fa-circle"
              style={{ marginRight: '-10px' }}
            />
          </Tooltip>
        ) : (
          <></>
        )}
      </span>
    );
  };

  const montarColunasEstudante = aluno => {
    return (
      <div className="d-flex justify-content-between" style={{ width: 350 }}>
        <div
          className={`d-flex justify-content-start ${
            desabilitarCampos ? 'desabilitar' : ''
          }`}
        >
          {aluno.nomeAluno}
        </div>
        <div className=" d-flex justify-content-end">
          <SinalizacaoAEE exibirSinalizacao={aluno.ehAtendidoAEE} />
        </div>
      </div>
    );
  };

  const colunasEstudantes = [
    {
      title: 'Nº',
      align: 'center',
      width: '60px',
      render: montarColunaNumeroAula,
    },

    {
      title: montarTituloEstudante,
      render: montarColunasEstudante,
    },
  ];

  // TODO - Verificar a regra - componenteCurricular.registraFrequencia
  if (dadosFrequencia?.aulas?.length) {
    dadosFrequencia.aulas.forEach(aula => {
      colunasEstudantes.push({
        title: () => (
          <div>
            <div style={{ fontSize: 16, marginRight: 3 }}>
              {window.moment(aula?.dataAula).format('DD/MM/YYYY')}
            </div>
            {aula?.ehReposicao ? <ReposicaoLabel /> : <></>}
          </div>
        ),
        align: 'center',
        width: '150px',
        children: [
          {
            align: 'center',
            width: '150px',
            className: 'posicao-marcar-todos-header',
            title: montarColunaFrequenciaMarcarTodasAulas(aula),
            render: dadosAulas => {
              const dadosDiaAula = dadosAulas.aulas.find(
                item => item.aulaId === aula.aulaId
              );
              if (dadosDiaAula) {
                return montarColunaFrequenciaDiaria(dadosDiaAula);
              }

              return '-';
            },
          },
        ],
      });
    });
  }

  colunasEstudantes.push({
    title: 'Informações adicionais',
    align: 'center',
    width: '130px',
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const onClickExpandir = (expandir, dadosEstudante) => {
    if (expandir) {
      setExpandedRowKeys([dadosEstudante?.codigoAluno]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const temLinhaExpandida = dados =>
    expandedRowKeys.filter(item => String(item) === String(dados));

  const expandIcon = (expanded, onExpand, record) => {
    const ehLinhaExpandida = temLinhaExpandida(record.codigoAluno);
    const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
    return (
      <TextoEstilizado cor={corTexto}>
        Detalhar
        <FontAwesomeIcon
          style={{ fontSize: 24, marginLeft: 5, cursor: 'pointer' }}
          icon={expanded ? faAngleUp : faAngleDown}
          onClick={e => onExpand(record, e)}
        />
      </TextoEstilizado>
    );
  };

  const montarColunaFrequencia = (value, row, index) => {
    if (expandedRowKeys?.length) {
      const aluno = dadosFrequencia?.alunos.find(
        item => item?.codigoAluno === expandedRowKeys[0]
      );

      if (!aluno) {
        return '';
      }
      let children = '';

      const percentual = aluno?.indicativoFrequencia?.percentual
        ? `${aluno.indicativoFrequencia.percentual}%`
        : '';

      switch (aluno?.indicativoFrequencia?.tipo) {
        case tipoIndicativoFrequencia.Alerta:
          children = <IndicativoAlerta>{percentual}</IndicativoAlerta>;
          break;
        case tipoIndicativoFrequencia.Critico:
          children = <IndicativoCritico>{percentual}</IndicativoCritico>;
          break;
        default:
          children = percentual;
          break;
      }

      const obj = {
        children,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = aluno?.aulas?.length || 0;
      } else {
        obj.props.rowSpan = 0;
      }

      return obj;
    }

    return null;
  };

  const montarColunasDataAulaEstudante = (
    aluno,
    dataAula,
    aula,
    aulaId,
    ehReposicao
  ) => {
    return (
      <span className="d-flex justify-content-between align-items-center">
        {ehReposicao ? <ReposicaoLabel linhaDetalhe /> : <></>}
        <span
          className={desabilitarCampos ? 'desabilitar' : ''}
          style={{ marginLeft: 14 }}
        >
          {window.moment(dataAula).format('DD/MM/YYYY')}
        </span>

        <ListaoBotaoAnotacao
          desabilitarCampos={desabilitarCampos || aula.desabilitado}
          ehInfantil={listaoEhInfantil}
          aluno={{
            ...aluno,
            aulaId,
            permiteAnotacao: aula?.permiteAnotacao,
            possuiAnotacao: aula?.possuiAnotacao,
            aula,
          }}
          permiteAnotacao={aula?.permiteAnotacao}
          possuiAnotacao={aula?.possuiAnotacao}
        />
      </span>
    );
  };

  const montarColunasDetalhe = estudante => {
    const colunasDetalhamentoEstudante = [
      {
        title: 'Datas',
        dataIndex: 'aulaId',
        align: 'left',
        ellipsis: true,
        render: (aulaId, row) => {
          const aula = dadosFrequencia.aulas.find(
            item => item.aulaId === aulaId
          );

          return montarColunasDataAulaEstudante(
            estudante,
            aula.dataAula,
            row,
            aulaId,
            aula?.ehReposicao
          );
        },
      },
    ];

    if (estudante?.aulas?.length) {
      const qtdColunasAulasDetalhe = Math.max.apply(
        null,
        dadosFrequencia.aulas.map(aula => aula?.numeroAulas)
      );

      for (
        let indiceAula = 0;
        indiceAula < qtdColunasAulasDetalhe;
        indiceAula++
      ) {
        colunasDetalhamentoEstudante.push({
          title: `Aula ${indiceAula + 1}`,
          align: 'center',
          dataIndex: `detalheFrequencia[${indiceAula}]`,
          width: '150px',
          render: (detalheFreq, dadosAula) =>
            detalheFreq?.numeroAula
              ? montarColunaFrequenciaAula(detalheFreq, dadosAula)
              : '-',
        });
      }
    }

    colunasDetalhamentoEstudante.push({
      title: '%',
      align: 'center',
      width: '70px',
      render: montarColunaFrequencia,
    });

    return colunasDetalhamentoEstudante;
  };

  return dadosFrequencia?.alunos?.length ? (
    <>
      <LinhaTabela className="col-md-12 p-0">
        <DataTable
          idLinha="codigoAluno"
          columns={colunasEstudantes}
          dataSource={dadosFrequencia?.alunos}
          pagination={false}
          semHover
          expandIconColumnIndex={dadosFrequencia?.aulas.length + 3 || null}
          expandedRowKeys={expandedRowKeys}
          onClickExpandir={onClickExpandir}
          rowClassName={record => {
            const ehLinhaExpandida = temLinhaExpandida(record?.codigoAluno);
            const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
            return nomeClasse;
          }}
          expandedRowRender={(record, indexAluno) => {
            const colunasDetalhe = montarColunasDetalhe(record, indexAluno);
            return (
              <>
                <ListaoModalAnotacoesFrequencia
                  dadosListaFrequencia={dadosFrequencia?.alunos}
                  ehInfantil={listaoEhInfantil}
                  componenteCurricularId={
                    componenteCurricular.codigoComponenteCurricular
                  }
                  desabilitarCampos={desabilitarCampos}
                  fechouModal={atualizarDados}
                  indexAluno={indexAluno}
                />
                <DataTable
                  id={`tabela-aluno-${record?.codigoAluno}`}
                  idLinha="aulaId"
                  pagination={false}
                  columns={colunasDetalhe}
                  dataSource={record?.aulas}
                  semHover
                  tableLayout="fixed"
                />
              </>
            );
          }}
          expandIcon={({ expanded, onExpand, record }) =>
            expandIcon(expanded, onExpand, record)
          }
        />
      </LinhaTabela>
    </>
  ) : (
    <></>
  );
};

export default ListaoListaFrequencia;
