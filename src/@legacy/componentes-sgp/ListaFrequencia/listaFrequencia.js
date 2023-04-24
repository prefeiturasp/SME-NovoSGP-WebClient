import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from '~/componentes';
import tipoFrequencia from '~/dtos/tipoFrequencia';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import ModalAnotacoesListaFrequencia from './componentes/modalAnotacoesListaFrequencia';
import SinalizacaoAEE from '../SinalizacaoAEE/sinalizacaoAEE';
import BotaoAnotacao from './componentes/botaoAnotacao';
import CampoPreDefinirFrequencia from './componentes/campoPreDefinirFrequencia';
import CampoTipoFrequencia from './componentes/campoTipoFrequencia';
import IconesMarcarTodos from './componentes/iconesMarcarTodos';
import {
  ContainerListaFrequencia,
  MarcadorSituacao,
  MarcarTodasAulasTipoFrequencia,
} from './listaFrequencia.css';
import { formatarFrequencia } from '~/utils';
import { setTemEstudanteAlteradoComCompensacao } from '~/redux/modulos/frequenciaPlanoAula/actions';

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

  const dispatch = useDispatch();

  const dataSource = useSelector(
    state => state.frequenciaPlanoAula.listaDadosFrequencia?.listaFrequencia
  );

  const desabilitaInformacoesDataFutura = useSelector(
    state => state.frequenciaPlanoAula.listaDadosFrequencia?.desabilitado
  );

  const listaTiposFrequencia = useSelector(
    state =>
      state.frequenciaPlanoAula.listaDadosFrequencia?.listaTiposFrequencia
  );

  const componenteCurricular = useSelector(
    state => state.frequenciaPlanoAula.componenteCurricular
  );

  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const aulaIdPodeEditar = useSelector(
    state => state.frequenciaPlanoAula?.aulaIdPodeEditar
  );

  useEffect(() => {
    const somenteConsulta = verificaSomenteConsulta(permissoesTela);
    let desabilitar =
      frequenciaId > 0
        ? somenteConsulta || !permissoesTela.podeAlterar
        : somenteConsulta || !permissoesTela.podeIncluir;

    if (desabilitar) {
      setDesabilitarCampos(desabilitar);
      return;
    }

    if (
      !temPeriodoAberto ||
      !aulaIdPodeEditar ||
      desabilitaInformacoesDataFutura
    ) {
      desabilitar = true;
    }

    setDesabilitarCampos(desabilitar);
  }, [frequenciaId, permissoesTela, temPeriodoAberto, componenteCurricular]);

  const marcaPresencaFaltaTodasAulas = (aluno, tipo) => {
    if (!desabilitarCampos && !aluno.desabilitado) {
      const aulas = [...aluno.aulas];
      aulas.forEach(aula => {
        aula.tipoFrequencia = tipo;
      });
      aluno.aulas = aulas;
      setDataSource(dataSource);
      onChangeFrequencia();

      const possuiCompensacao = aluno?.aulas?.find(a => a?.possuiCompensacao);
      if (possuiCompensacao) {
        dispatch(setTemEstudanteAlteradoComCompensacao(true));
      }
    }
  };

  const marcarPresencaFaltaTodosAlunos = tipo => {
    if (!desabilitarCampos) {
      let teveAlteracao = false;
      let possuiCompensacao = false;

      dataSource.forEach(aluno => {
        if (!aluno.desabilitado) {
          const aulas = [...aluno.aulas];
          aulas.forEach(aula => {
            aula.tipoFrequencia = tipo;
          });
          aluno.aulas = aulas;
          teveAlteracao = true;
          possuiCompensacao = aluno?.aulas?.find(a => a?.possuiCompensacao);
          if (possuiCompensacao) {
            dispatch(setTemEstudanteAlteradoComCompensacao(true));
          }
        }
      });
      if (teveAlteracao) {
        onChangeFrequencia();
      }
    }
  };

  const montarColunasEstudante = aluno => {
    const indexAluno = dataSource.indexOf(aluno);
    const desabilitar = desabilitarCampos || aluno?.desabilitado;
    return (
      <div
        className="d-flex"
        style={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div
          className={`d-flex justify-content-start ${
            desabilitar ? 'desabilitar' : ''
          }`}
        >
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

  const montarColunaAulas = (aula, indexAluno, indexAula, aluno) => {
    return (
      <CampoTipoFrequencia
        indexAula={indexAula}
        indexAluno={indexAluno}
        onChange={valorNovo => {
          aula.tipoFrequencia = valorNovo;
          dataSource[indexAluno].aulas = [...dataSource[indexAluno].aulas];
          onChangeFrequencia();

          if (aula?.possuiCompensacao) {
            dispatch(setTemEstudanteAlteradoComCompensacao(true));
          }
        }}
        numeroAula={aula.numeroAula}
        desabilitar={desabilitarCampos || aluno?.desabilitado}
      />
    );
  };

  const montarColunaFrequencia = aluno => {
    const percentual = formatarFrequencia(
      aluno?.indicativoFrequencia?.percentual
    );
    return percentual;
  };

  const obterTiposFrequenciaPermitidos = () => {
    const exibirCompareceu = listaTiposFrequencia?.find(
      item => item?.valor === tipoFrequencia.Compareceu.valor
    );
    const exibirFaltou = listaTiposFrequencia?.find(
      item => item?.valor === tipoFrequencia.Faltou.valor
    );
    const exibirRemoto = listaTiposFrequencia?.find(
      item => item?.valor === tipoFrequencia.Remoto.valor
    );

    return { exibirCompareceu, exibirFaltou, exibirRemoto };
  };

  const montarTituloColunaMarcarTodas = () => {
    const { exibirCompareceu, exibirFaltou, exibirRemoto } =
      obterTiposFrequenciaPermitidos();

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
    const { exibirCompareceu, exibirFaltou, exibirRemoto } =
      obterTiposFrequenciaPermitidos();

    return (
      <Tooltip
        title={
          <>
            {exibirCompareceu ? <div>C: Compareceu</div> : ''}
            {exibirFaltou ? <div>F: Faltou</div> : ''}
            {exibirRemoto ? <div>R: Remoto</div> : ''}
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
  ];

  if (componenteCurricular.registraFrequencia) {
    columns.push({
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
            desabilitar={desabilitarCampos || aluno?.desabilitado}
          />
        );
      },
    });
    columns.push({
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
          key: 'childrenMarcarTodas',
          render: aluno => {
            const indexAluno = dataSource.indexOf(aluno);
            return (
              <IconesMarcarTodos
                indexAluno={indexAluno}
                marcaPresencaFaltaTodasAulas={tipo =>
                  marcaPresencaFaltaTodasAulas(aluno, tipo)
                }
                desabilitar={desabilitarCampos || aluno?.desabilitado}
              />
            );
          },
        },
      ],
    });
  }

  if (dataSource[0]?.aulas?.length && componenteCurricular.registraFrequencia) {
    dataSource[0].aulas.forEach((aula, indexAula) => {
      columns.push({
        title: () => <span className="fonte-16">{aula.numeroAula}</span>,
        align: 'center',
        dataIndex: `aulas.${indexAula}`,
        width: '75px',
        render: (dadosAula, aluno) => {
          const indexAluno = dataSource.indexOf(aluno);
          return montarColunaAulas(dadosAula, indexAluno, indexAula, aluno);
        },
      });
    });
    columns.push({
      title: '%',
      align: 'center',
      width: '75px',
      render: montarColunaFrequencia,
    });
  }

  return (
    <>
      <ModalAnotacoesListaFrequencia
        dadosListaFrequencia={dataSource}
        ehInfantil={ehInfantil}
        aulaId={aulaId}
        componenteCurricularId={componenteCurricularId}
        desabilitarCampos={desabilitarCampos}
      />

      <ContainerListaFrequencia className="pt-2">
        {dataSource?.length ? (
          <DataTable
            idLinha="codigoAluno"
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
