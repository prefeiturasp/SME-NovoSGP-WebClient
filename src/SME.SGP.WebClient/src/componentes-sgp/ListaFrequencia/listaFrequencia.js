import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from '~/componentes';
import tipoFrequencia from '~/dtos/tipoFrequencia';
import tipoIndicativoFrequencia from '~/dtos/tipoIndicativoFrequencia';
import ModalAnotacoesFrequencia from '~/paginas/DiarioClasse/FrequenciaPlanoAula/ModalAnotacoes/modalAnotacoes';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import SinalizacaoAEE from '../SinalizacaoAEE/sinalizacaoAEE';
import BotaoAnotacao from './componentes/botaoAnotacao';
import CampoPreDefinirFrequencia from './componentes/campoPreDefinirFrequencia';
import CampoTipoFrequencia from './componentes/campoTipoFrequencia';
import IconesMarcarTodos from './componentes/iconesMarcarTodos';
import {
  ContainerListaFrequencia,
  IndicativoAlerta,
  IndicativoCritico,
  MarcadorSituacao,
  MarcarTodasAulasTipoFrequencia,
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

  const listaTiposFrequencia = useSelector(
    state =>
      state.frequenciaPlanoAula.listaDadosFrequencia?.listaTiposFrequencia
  );

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);

  useEffect(() => {
    const somenteConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      frequenciaId > 0
        ? somenteConsulta || !permissoesTela.podeAlterar
        : somenteConsulta || !permissoesTela.podeIncluir;
    setDesabilitarCampos(desabilitar);
    if (!temPeriodoAberto) setDesabilitarCampos(!temPeriodoAberto);
  }, [frequenciaId, permissoesTela, temPeriodoAberto]);

  const marcaPresencaFaltaTodasAulas = (aluno, tipo) => {
    if (!desabilitarCampos && !aluno.desabilitado) {
      const aulas = [...aluno.aulas];
      aulas.forEach(aula => {
        aula.tipoFrequencia = tipo;
      });
      aluno.aulas = aulas;
      setDataSource(dataSource);
      onChangeFrequencia();
    }
  };

  const marcarPresencaFaltaTodosAlunos = tipo => {
    if (!desabilitarCampos) {
      dataSource.forEach(aluno => {
        if (!aluno.desabilitado) {
          const aulas = [...aluno.aulas];
          aulas.forEach(aula => {
            aula.tipoFrequencia = tipo;
          });
          aluno.aulas = aulas;
        }
      });
      onChangeFrequencia();
    }
  };

  const montarColunasEstudante = aluno => {
    const indexAluno = dataSource.indexOf(aluno);

    return (
      <div
        className="d-flex"
        style={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
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
          <BotaoAnotacao
            indexAluno={indexAluno}
            ehInfantil={ehInfantil}
            desabilitarCampos={desabilitarCampos}
          />
        </div>
      </div>
    );
  };

  const montarColunaAulas = (aula, indexAluno, indexAula) => {
    return (
      <CampoTipoFrequencia
        indexAula={indexAula}
        indexAluno={indexAluno}
        onChange={valorNovo => {
          aula.tipoFrequencia = valorNovo;
          dataSource[indexAluno].aulas = [...dataSource[indexAluno].aulas];
          onChangeFrequencia();
        }}
        numeroAula={aula.numeroAula}
      />
    );
  };

  const montarColunaFrequencia = aluno => {
    const percentual =
      aluno?.indicativoFrequencia?.percentual > -1
        ? `${aluno.indicativoFrequencia.percentual}%`
        : '';

    switch (aluno?.indicativoFrequencia?.tipo) {
      case tipoIndicativoFrequencia.Alerta:
        return <IndicativoAlerta>{percentual}</IndicativoAlerta>;
      case tipoIndicativoFrequencia.Critico:
        return <IndicativoCritico>{percentual}</IndicativoCritico>;
      default:
        return percentual;
    }
  };

  const montarTituloColunaMarcarTodas = () => {
    const exibirCompareceu = listaTiposFrequencia?.find(
      item => item?.valor === tipoFrequencia.Compareceu.valor
    );
    const exibirFaltou = listaTiposFrequencia?.find(
      item => item?.valor === tipoFrequencia.Faltou.valor
    );
    const exibirRemoto = listaTiposFrequencia?.find(
      item => item?.valor === tipoFrequencia.Remoto.valor
    );

    let margin = '';
    let totalColunas = 0;

    if (exibirCompareceu) {
      totalColunas += 1;
    }
    if (exibirFaltou) {
      totalColunas += 1;
    }
    if (exibirRemoto) {
      totalColunas += 1;
    }

    if (totalColunas === 2) {
      margin = '15px';
    }

    return (
      <div className="d-flex">
        {exibirCompareceu && (
          <MarcarTodasAulasTipoFrequencia
            style={{ marginLeft: margin, marginRight: margin }}
            onClick={() =>
              marcarPresencaFaltaTodosAlunos(tipoFrequencia.Compareceu.valor)
            }
          >
            <Tooltip title="Compareceu">
              {tipoFrequencia.Compareceu.valor}
            </Tooltip>
          </MarcarTodasAulasTipoFrequencia>
        )}
        {exibirFaltou && (
          <MarcarTodasAulasTipoFrequencia
            style={{
              marginLeft: totalColunas === 3 ? '21px' : margin,
              marginRight: totalColunas === 3 ? '21px' : margin,
            }}
            onClick={() =>
              marcarPresencaFaltaTodosAlunos(tipoFrequencia.Faltou.valor)
            }
          >
            <Tooltip title="Faltou">{tipoFrequencia.Faltou.valor}</Tooltip>
          </MarcarTodasAulasTipoFrequencia>
        )}
        {exibirRemoto && (
          <MarcarTodasAulasTipoFrequencia
            style={{ marginLeft: margin, marginRight: margin }}
            onClick={() =>
              marcarPresencaFaltaTodosAlunos(tipoFrequencia.Remoto.valor)
            }
          >
            <Tooltip title="Remoto">{tipoFrequencia.Remoto.valor}</Tooltip>
          </MarcarTodasAulasTipoFrequencia>
        )}
      </div>
    );
  };

  const montarTituloMarcarTodasAulas = () => {
    return (
      <Tooltip
        title={
          <>
            <div>C: Compareceu</div>
            <div>F: Faltou</div>
            <div>R: Remoto</div>
          </>
        }
      >
        <div>Marcar</div>
        <div>todas aulas</div>
      </Tooltip>
    );
  };

  const montarTituloEstudante = () => {
    return (
      <span className="fonte-16">
        Lista de {ehInfantil ? 'crianças' : 'estudantes'}
      </span>
    );
  };

  const columns = [
    {
      title: montarTituloEstudante,
      render: montarColunasEstudante,
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
      title: montarTituloMarcarTodasAulas(),
      align: 'center',
      width: '100px',
      className: 'p-1',
      children: [
        {
          width: '100px',
          align: 'center',
          className: 'p-2',
          title: montarTituloColunaMarcarTodas(),
          render: aluno => {
            const indexAluno = dataSource.indexOf(aluno);
            return (
              <IconesMarcarTodos
                indexAluno={indexAluno}
                marcaPresencaFaltaTodasAulas={tipo =>
                  marcaPresencaFaltaTodasAulas(aluno, tipo)
                }
              />
            );
          },
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
    render: montarColunaFrequencia,
  });

  return (
    <>
      <ModalAnotacoesFrequencia
        dadosListaFrequencia={dataSource}
        ehInfantil={ehInfantil}
        aulaId={aulaId}
        componenteCurricularId={componenteCurricularId}
        desabilitarCampos={desabilitarCampos}
      />

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
