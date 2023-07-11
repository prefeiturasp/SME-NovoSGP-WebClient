import { Tooltip } from 'antd';
import t from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import shortid from 'shortid';
import EstudanteAtendidoAEE from '@/components/sgp/estudante-atendido-aee';
import {
  SGP_TABLE_REGISTRO_INDIVIDUAL,
  SGP_TABLE_REGISTRO_INDIVIDUAL_LINHA,
} from '~/constantes/ids/table';
import Cabecalho from './componentes/Cabecalho';
import { DetalhesAluno, LinhaTabela, Tabela, TabelaEstilo } from './style';
import InconsistenciasEstudante from './componentes/Inconsistencias';
import EstudanteMatriculadoPAP from '@/components/sgp/estudante-matriculado-pap';

function TabelaRetratil({
  alunos,
  children,
  onChangeAlunoSelecionado,
  permiteOnChangeAluno,
  codigoAlunoSelecionado,
  exibirProcessoConcluido,
  tituloCabecalho,
  pularDesabilitados,
  larguraAluno,
}) {
  const [retraido, setRetraido] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  useEffect(() => {
    if (codigoAlunoSelecionado) {
      const alunoSelecionar = alunos.find(
        item => String(item.codigoEOL) === String(codigoAlunoSelecionado)
      );

      if (alunoSelecionar) {
        setAlunoSelecionado(alunoSelecionar);
      }
    }

    if (!(alunos && alunos.length)) {
      setAlunoSelecionado(null);
    }
  }, [alunos, codigoAlunoSelecionado]);

  const permiteSelecionarAluno = useCallback(async () => {
    if (permiteOnChangeAluno) {
      const permite = await permiteOnChangeAluno();
      return permite;
    }
    return true;
  }, [permiteOnChangeAluno]);

  const isAlunoSelecionado = aluno => {
    return alunoSelecionado && aluno.codigoEOL === alunoSelecionado.codigoEOL;
  };

  const proximoAlunoHabilitado = aluno => {
    const indexProximo = alunos.indexOf(aluno) + 1;
    if (indexProximo !== alunos.length) {
      const proximoAluno = alunos[indexProximo];
      if (proximoAluno.desabilitado) {
        return proximoAlunoHabilitado(proximoAluno);
      }
      return proximoAluno;
    }
    return false;
  };

  const proximoAlunoHandler = useCallback(async () => {
    const permite = await permiteSelecionarAluno();
    if (permite) {
      if (alunos.indexOf(alunoSelecionado) === alunos.length - 1) return;
      const aluno = pularDesabilitados
        ? proximoAlunoHabilitado(alunoSelecionado)
        : alunos[alunos.indexOf(alunoSelecionado) + 1];
      if (aluno) {
        setAlunoSelecionado(aluno);
        onChangeAlunoSelecionado(aluno);
      }
    }

  }, [
    alunoSelecionado,
    alunos,
    onChangeAlunoSelecionado,
    permiteSelecionarAluno,
  ]);

  const anteriorAlunoHabilitado = aluno => {
    const indexAnterior = alunos.indexOf(aluno) - 1;
    if (indexAnterior >= 0) {
      const alunoAnterior = alunos[indexAnterior];
      if (alunoAnterior.desabilitado) {
        return anteriorAlunoHabilitado(alunoAnterior);
      }
      return alunoAnterior;
    }
    return false;
  };

  const anteriorAlunoHandler = useCallback(async () => {
    const permite = await permiteSelecionarAluno();
    if (permite) {
      if (alunos.indexOf(alunoSelecionado) === 0) return;
      const aluno = pularDesabilitados
        ? anteriorAlunoHabilitado(alunoSelecionado)
        : alunos[alunos.indexOf(alunoSelecionado) - 1];
      if (aluno) {
        setAlunoSelecionado(aluno);
        onChangeAlunoSelecionado(aluno);
      }
    }

  }, [
    alunoSelecionado,
    alunos,
    onChangeAlunoSelecionado,
    permiteSelecionarAluno,
  ]);

  const desabilitarAnterior = () => {
    return (
      alunos.length === 0 ||
      alunos.indexOf(alunoSelecionado) === 0 ||
      !alunoSelecionado
    );
  };

  const desabilitarProximo = () => {
    return (
      alunos.length === 0 ||
      alunos.indexOf(alunoSelecionado) === alunos.length - 1 ||
      !alunoSelecionado
    );
  };

  const onClickLinhaAluno = async aluno => {
    const permite = await permiteSelecionarAluno();
    if (permite) {
      setAlunoSelecionado(aluno);
      onChangeAlunoSelecionado(aluno);
    }
  };

  return (
    <TabelaEstilo>
      <div className="tabelaCollapse">
        <Tabela
          id={SGP_TABLE_REGISTRO_INDIVIDUAL}
          className={retraido && `retraido`}
        >
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nome</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((item, index) => (
              <LinhaTabela
                id={`${SGP_TABLE_REGISTRO_INDIVIDUAL_LINHA}${index}`}
                className={isAlunoSelecionado(item) && `selecionado`}
                key={shortid.generate()}
                ativo={!item.desabilitado}
                onClick={() => onClickLinhaAluno(item)}
                processoConcluido={item.processoConcluido}
              >
                <td>
                  {item.numeroChamada}
                  {item.marcador && item.marcador.descricao ? (
                    <Tooltip title={item.marcador.descricao}>
                      <span className="iconeSituacao" />
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                  <InconsistenciasEstudante codigoAluno={item?.codigoEOL} />
                </td>
                <td>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{
                      marginLeft: '-9px',
                    }}
                  >
                    <div>
                      {exibirProcessoConcluido && (
                        <i className="icone-concluido fa fa-check-circle" />
                      )}
                      {item.nome}
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <EstudanteAtendidoAEE show={item.ehAtendidoAEE} />
                      <EstudanteMatriculadoPAP
                        show={item?.ehMatriculadoTurmaPAP}
                      />
                      {item.marcadorDiasSemRegistroExibir && (
                        <div className="pl-3">
                          <Tooltip title={item.marcadorDiasSemRegistroTexto}>
                            <i className="fas fa-exclamation icone-ausencia" />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </LinhaTabela>
            ))}
          </tbody>
        </Tabela>
      </div>
      <DetalhesAluno larguraAluno={larguraAluno}>
        <Cabecalho
          titulo={tituloCabecalho}
          retraido={retraido}
          onClickCollapse={() => setRetraido(!retraido)}
          onClickAnterior={anteriorAlunoHandler}
          onClickProximo={proximoAlunoHandler}
          desabilitarAnterior={desabilitarAnterior()}
          desabilitarProximo={desabilitarProximo()}
        />
        {children}
      </DetalhesAluno>
    </TabelaEstilo>
  );
}

TabelaRetratil.propTypes = {
  alunos: t.oneOfType([t.array]),
  children: t.oneOfType([t.any]),
  onChangeAlunoSelecionado: t.func,
  permiteOnChangeAluno: t.func,
  codigoAlunoSelecionado: t.oneOfType([t.any]),
  exibirProcessoConcluido: t.bool,
  tituloCabecalho: t.string,
  pularDesabilitados: t.bool,
  larguraAluno: t.string,
};

TabelaRetratil.defaultProps = {
  alunos: [],
  children: () => {},
  onChangeAlunoSelecionado: () => {},
  permiteOnChangeAluno: () => true,
  codigoAlunoSelecionado: null,
  exibirProcessoConcluido: false,
  tituloCabecalho: 'Detalhes do estudante',
  pularDesabilitados: false,
  larguraAluno: '',
};

export default TabelaRetratil;
