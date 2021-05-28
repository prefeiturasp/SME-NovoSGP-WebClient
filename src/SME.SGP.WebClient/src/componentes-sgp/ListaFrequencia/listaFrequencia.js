import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from '~/componentes';
import tipoIndicativoFrequencia from '~/dtos/tipoIndicativoFrequencia';
import ModalAnotacoesFrequencia from '~/paginas/DiarioClasse/FrequenciaPlanoAula/ModalAnotacoes/modalAnotacoes';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import SinalizacaoAEE from '../SinalizacaoAEE/sinalizacaoAEE';
import CampoPreDefinirFrequencia from './componentes/campoPreDefinirFrequencia';
import CampoTipoFrequencia from './componentes/campoTipoFrequencia';
import {
  BtbAnotacao,
  ContainerListaFrequencia,
  MarcadorSituacao,
} from './listaFrequencia.css';

const ListaFrequencia = props => {
  const {
    onChangeFrequencia,
    permissoesTela,
    frequenciaId,
    temPeriodoAberto,
    ehInfantil,
    aulaId,
    componenteCurricularId,
    setDataSource,
  } = props;

  const dataSource = useSelector(
    state => state.frequenciaPlanoAula.listaDadosFrequencia?.listaFrequencia
  );

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [exibirModalAnotacao, setExibirModalAnotacao] = useState(false);
  const [dadosModalAnotacao, setDadosModalAnotacao] = useState({});

  useEffect(() => {
    const somenteConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      frequenciaId > 0
        ? somenteConsulta || !permissoesTela.podeAlterar
        : somenteConsulta || !permissoesTela.podeIncluir;
    setDesabilitarCampos(desabilitar);
    if (!temPeriodoAberto) setDesabilitarCampos(!temPeriodoAberto);
  }, [frequenciaId, permissoesTela, temPeriodoAberto]);

  // const validaSeFaltouTodasAulas = aluno => {
  //   const totalAulas = aluno.aulas.length;
  //   const totalAulasFaltou = aluno.aulas.filter(aula => !aula.compareceu);
  //   return totalAulas === totalAulasFaltou.length;
  // };

  // const validaSeCompareceuTodasAulas = aluno => {
  //   const totalAulas = aluno.aulas.length;
  //   const totalAulasCompareceu = aluno.aulas.filter(aula => aula.compareceu);
  //   return totalAulas === totalAulasCompareceu.length;
  // };

  const marcaPresencaFaltaTodasAulas = (aluno, tipo) => {
    if (!desabilitarCampos && !aluno.desabilitado) {
      aluno.aulas.forEach(aula => {
        aula.compareceu = tipo;
      });
      setDataSource(dataSource);
      onChangeFrequencia();
    }
  };

  const marcarPresencaFaltaTodosAlunos = tipo => {
    if (!desabilitarCampos) {
      dataSource.forEach(aluno => {
        if (!aluno.desabilitado) {
          aluno.aulas.forEach(aula => {
            aula.compareceu = tipo;
          });
        }
      });
      // setDataSource(dataSource);
      onChangeFrequencia();
    }
  };

  const onClickAnotacao = aluno => {
    setDadosModalAnotacao(aluno);
    setExibirModalAnotacao(true);
  };

  const onCloseModalAnotacao = () => {
    setExibirModalAnotacao(false);
    setDadosModalAnotacao({});
  };

  const btnAnotacao = item => {
    const podeAbrirModal =
      (item.permiteAnotacao && !desabilitarCampos) ||
      (item.possuiAnotacao && desabilitarCampos);
    return (
      <Tooltip
        title={
          item.possuiAnotacao
            ? `${ehInfantil ? 'Criança' : 'Estudante'} com anotações`
            : ''
        }
        placement="top"
      >
        <div className=" d-flex justify-content-end">
          <BtbAnotacao
            podeAbrirModal={podeAbrirModal}
            className={item.possuiAnotacao ? 'btn-com-anotacao' : ''}
            onClick={() => {
              if (podeAbrirModal) {
                onClickAnotacao(item);
              }
            }}
          >
            <i className="fas fa-pen" />
          </BtbAnotacao>
        </div>
      </Tooltip>
    );
  };

  const montarColunasEstudante = aluno => {
    return (
      <div className="d-flex" style={{ justifyContent: 'space-between' }}>
        <div className=" d-flex justify-content-start">
          {aluno?.marcador ? (
            <Tooltip title={aluno?.marcador?.descricao} placement="top">
              <MarcadorSituacao
                className="fas fa-circle"
                style={{ marginRight: '4px' }}
              />
            </Tooltip>
          ) : (
            <div className="mr-3" />
          )}
          {aluno?.numeroAlunoChamada} - {aluno?.nomeAluno}
        </div>
        <div className="d-flex justify-content-end">
          <div className="mr-3">
            <SinalizacaoAEE exibirSinalizacao={aluno?.ehAtendidoAEE} />
          </div>
          {btnAnotacao(aluno)}
        </div>
      </div>
    );
  };

  const montarColunaMarcarTodas = aluno => {
    return (
      dataSource[0]?.aulas?.length > 0 && (
        <div className="d-flex justify-content-around">
          <i
            onClick={() => marcaPresencaFaltaTodasAulas(aluno, 'C')}
            className="fas fa-check-circle"
          />
          <i
            onClick={() => marcaPresencaFaltaTodasAulas(aluno, 'F')}
            className="fas fa-times-circle"
          />
          <i
            onClick={() => marcaPresencaFaltaTodasAulas(aluno, 'R')}
            className="fas fa-dot-circle"
          />
        </div>
      )
    );
  };

  const montarColunaAulas = (aula, indexAluno, indexAula) => {
    return (
      <CampoTipoFrequencia
        indexAula={indexAula}
        indexAluno={indexAluno}
        onChange={valorNovo => {
          aula.compareceu = valorNovo;
          onChangeFrequencia();
        }}
        numeroAula={aula.numeroAula}
      />
    );
  };

  const montarColunaFrequencia = aluno => {
    return (
      <span
        className={`width-70 ${
          aluno.indicativoFrequencia &&
          tipoIndicativoFrequencia.Alerta === aluno.indicativoFrequencia.tipo
            ? 'indicativo-alerta'
            : ''
        } ${
          aluno.indicativoFrequencia &&
          tipoIndicativoFrequencia.Critico === aluno.indicativoFrequencia.tipo
            ? 'indicativo-critico'
            : ''
        } `}
      >
        {aluno.indicativoFrequencia
          ? `${aluno.indicativoFrequencia.percentual}%`
          : ''}
      </span>
    );
  };

  const columns = [
    {
      title: () => (
        <span className="fonte-16">
          Lista de {ehInfantil ? 'crianças' : 'estudantes'}
        </span>
      ),
      render: aluno => montarColunasEstudante(aluno),
    },
    {
      title: 'Pré-definir frequência',
      align: 'center',
      width: '75px',
      className: 'p-0',
      render: aluno => {
        const indexAluno = dataSource.indexOf(aluno);
        return (
          <CampoPreDefinirFrequencia
            indexAluno={indexAluno}
            onChange={tipoPreDefinir => {
              aluno.tipoFrequenciaPreDefinido = tipoPreDefinir;
              marcaPresencaFaltaTodasAulas(aluno, tipoPreDefinir);
            }}
          />
        );
      },
    },
    {
      title: () => <span>Marcar todas aulas</span>,
      align: 'center',
      width: '100px',
      className: 'p-1',
      children: [
        {
          width: '100px',
          align: 'center',
          className: 'p-2',
          title: () => {
            return (
              <div className="d-flex">
                <div
                  className="mr-3 ml-2"
                  onClick={() => marcarPresencaFaltaTodosAlunos('C')}
                >
                  C
                </div>
                <div
                  className="mr-3"
                  o
                  onClick={() => marcarPresencaFaltaTodosAlunos('F')}
                >
                  F
                </div>
                <div
                  className="mr-2"
                  onClick={() => marcarPresencaFaltaTodosAlunos('R')}
                >
                  R
                </div>
              </div>
            );
          },
          render: aluno => montarColunaMarcarTodas(aluno),
        },
      ],
    },
  ];

  if (dataSource[0]?.aulas?.length) {
    dataSource[0].aulas.forEach((aula, indexAula) => {
      columns.push({
        title: () => <span className="fonte-16">{aula.numeroAula}</span>,
        align: 'center',
        dataIndex: `aulas.${indexAula}`,
        width: '75px',
        render: (dadosAula, aluno) => {
          const indexAluno = dataSource.indexOf(aluno);
          return montarColunaAulas(dadosAula, indexAluno, indexAula);
        },
      });
    });
  }

  columns.push({
    title: '%',
    align: 'center',
    width: '75px',
    render: aluno => montarColunaFrequencia(aluno),
  });

  return (
    <>
      {exibirModalAnotacao && (
        <ModalAnotacoesFrequencia
          exibirModal={exibirModalAnotacao}
          onCloseModal={onCloseModalAnotacao}
          dadosModalAnotacao={dadosModalAnotacao}
          dadosListaFrequencia={dataSource}
          ehInfantil={ehInfantil}
          aulaId={aulaId}
          componenteCurricularId={componenteCurricularId}
          desabilitarCampos={desabilitarCampos}
        />
      )}
      <ContainerListaFrequencia className="pt-2">
        {dataSource?.length ? (
          <DataTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            semHover
          />
        ) : null}
      </ContainerListaFrequencia>
    </>
  );
};

ListaFrequencia.propTypes = {
  onChangeFrequencia: PropTypes.oneOfType([PropTypes.func]),
  permissoesTela: PropTypes.oneOfType([PropTypes.any]),
  frequenciaId: PropTypes.oneOfType([PropTypes.any]),
  temPeriodoAberto: PropTypes.oneOfType([PropTypes.bool]),
  ehInfantil: PropTypes.oneOfType([PropTypes.bool]),
  aulaId: PropTypes.oneOfType([PropTypes.any]),
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
  setDataSource: PropTypes.oneOfType([PropTypes.func]),
};

ListaFrequencia.defaultProps = {
  onChangeFrequencia: () => {},
  permissoesTela: {},
  frequenciaId: 0,
  temPeriodoAberto: false,
  ehInfantil: false,
  aulaId: '',
  componenteCurricularId: '',
  setDataSource: () => {},
};

export default ListaFrequencia;
