import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable } from '~/componentes';
import { Ordenacao } from '~/componentes-sgp';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import {
  setDadosModalAnotacaoFrequencia,
  setExibirModalAnotacaoFrequencia,
} from '~/redux/modulos/modalAnotacaoFrequencia/actions';
import ServicoAnotacaoFrequenciaAluno from '~/servicos/Paginas/DiarioClasse/ServicoAnotacaoFrequenciaAluno';
import { formatarFrequencia } from '~/utils';
import CampoTiposFrequencia from './componentes/campoTiposFrequencia';
import ListaoBotaoAnotacao from './componentes/listaoBotaoAnotacao';
import ListaoModalAnotacoesFrequencia from './componentes/listaoModalAnotacaoFrequencia';
import ReposicaoLabel from './componentes/reposicaoLabel';
import {
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

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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
        desabilitar={desabilitarCampos || !aulaHeader.podeEditar}
      />
    );
  };

  const encontrarAulas = dadosAula =>
    dadosFrequencia?.aulas.find(item => item.aulaId === dadosAula.aulaId);

  const montarColunaFrequenciaDiaria = dadosDiaAula => {
    const aulasGerais = encontrarAulas(dadosDiaAula);
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
        desabilitar={
          desabilitarCampos ||
          dadosDiaAula?.desabilitado ||
          !aulasGerais.podeEditar
        }
      />
    );
  };

  const montarColunaFrequenciaAula = (detalheFreq, dadosAula) => {
    const aulasGerais = encontrarAulas(dadosAula);
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
        desabilitar={
          desabilitarCampos ||
          dadosAula?.desabilitado ||
          !aulasGerais.podeEditar
        }
      />
    );
  };

  const temLinhaExpandida = dados =>
    expandedRowKeys.filter(item => String(item) === String(dados));

  const montarColunaNumeroAula = aluno => {
    const ehLinhaExpandida = temLinhaExpandida(aluno?.codigoAluno);
    return (
      <span className="d-flex justify-content-center">
        <span>{aluno.numeroAlunoChamada}</span>

        {aluno?.marcador ? (
          <Tooltip
            title={aluno?.marcador?.descricao}
            placement="top"
            destroyTooltipOnHide
          >
            <MarcadorSituacao
              className="fas fa-circle"
              style={{
                marginRight: '-10px',
                color: ehLinhaExpandida?.length ? Base.Branco : Base.Roxo,
              }}
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
      <div className="d-flex justify-content-between">
        <div style={{ width: 350 }} className="d-flex justify-content-start">
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

  if (dadosFrequencia?.aulas?.length) {
    dadosFrequencia.aulas.forEach(aula => {
      const ehAulaCj = aula?.aulaCj;
      const ehAulaReposicao = aula?.ehReposicao;
      const widthCJReposicao = ehAulaCj && ehAulaReposicao ? '185px' : '170px';
      const width = ehAulaCj ? widthCJReposicao : '150px';
      const marginLeft = ehAulaCj && ehAulaReposicao ? 15 : '';

      colunasEstudantes.push({
        title: () => (
          <div>
            <div style={{ fontSize: 16, marginRight: 3, marginLeft }}>
              {aula?.dataAula}
            </div>
            {ehAulaReposicao ? <ReposicaoLabel /> : <></>}
          </div>
        ),
        align: 'center',
        width,
        className: 'position-relative',
        children: [
          {
            align: 'center',
            width,
            className: 'posicao-marcar-todos-header',
            title: montarColunaFrequenciaMarcarTodasAulas(aula),
            key: aula?.aulaId,
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

  const onClickExpandir = (expandir, dadosEstudante) => {
    if (expandir) {
      setExpandedRowKeys([dadosEstudante?.codigoAluno]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const expandIcon = (expanded, onExpand, record) => {
    const ehLinhaExpandida = temLinhaExpandida(record.codigoAluno);
    const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
    return (
      <TextoEstilizado
        cor={corTexto}
        style={{ cursor: 'pointer' }}
        onClick={() => onExpand(record)}
      >
        Detalhar
        <FontAwesomeIcon
          style={{ fontSize: 24, marginLeft: 5, cursor: 'pointer' }}
          icon={expanded ? faAngleUp : faAngleDown}
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

      const percentual = formatarFrequencia(
        aluno?.indicativoFrequencia?.percentual
      );

      children = percentual;

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
    const aulasGerais = encontrarAulas(aula);

    return (
      <span className="d-flex justify-content-between align-items-center">
        {ehReposicao ? <ReposicaoLabel linhaDetalhe /> : <></>}
        <span style={{ marginLeft: 14 }}>{dataAula}</span>

        <ListaoBotaoAnotacao
          desabilitarCampos={desabilitarCampos || aula.desabilitado}
          ehInfantil={listaoEhInfantil}
          permiteAnotacao={aula?.permiteAnotacao && aulasGerais?.podeEditar}
          possuiAnotacao={aula?.possuiAnotacao}
          onClickAnotacao={() => {
            dispatch(
              setDadosModalAnotacaoFrequencia({
                ...aluno,
                aulaId,
                permiteAnotacao: aula?.permiteAnotacao,
                possuiAnotacao: aula?.possuiAnotacao,
                aula,
              })
            );
            dispatch(setExibirModalAnotacaoFrequencia(true));
          }}
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
        className: 'position-relative',
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

  useEffect(() => {
    ServicoAnotacaoFrequenciaAluno.obterMotivosAusenciaRedux();
  }, []);

  return dadosFrequencia?.alunos?.length ? (
    <>
      <ListaoModalAnotacoesFrequencia
        dadosListaFrequencia={dadosFrequencia?.alunos}
        ehInfantil={listaoEhInfantil}
        componenteCurricularId={componenteCurricular.codigoComponenteCurricular}
        desabilitarCampos={desabilitarCampos}
        fechouModal={atualizarDados}
      />
      <div className="col-sm-12 p-0 mb-3 d-flex justify-content-start">
        <Ordenacao
          conteudoParaOrdenar={dadosFrequencia?.alunos}
          ordenarColunaNumero="numeroAlunoChamada"
          ordenarColunaTexto="nomeAluno"
          retornoOrdenado={retorno => {
            if (dadosFrequencia?.alunos?.length) {
              setDadosFrequencia({ ...dadosFrequencia, alunos: [...retorno] });
            }
          }}
        />
      </div>
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
              <DataTable
                id={`tabela-aluno-${record?.codigoAluno}`}
                idLinha="aulaId"
                pagination={false}
                columns={colunasDetalhe}
                dataSource={record?.aulas}
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
    </>
  ) : (
    <></>
  );
};

export default ListaoListaFrequencia;
