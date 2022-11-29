import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import DetalhesAluno from '~/componentes/Alunos/Detalhes';
import { setDadosObjectCardEstudante } from '~/redux/modulos/objectCardEstudante/actions';
import { erros } from '~/servicos';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import ServicoEstudante from '~/servicos/Paginas/Estudante/ServicoEstudante';

const ObjectCardEstudante = props => {
  const {
    codigoAluno,
    anoLetivo,
    codigoTurma,
    exibirBotaoImprimir,
    exibirFrequencia,
    permiteAlterarImagem,
    dadosIniciais,
    consultarFrequenciaGlobal,
  } = props;

  const dispatch = useDispatch();

  const dadosObjectCardEstudante = useSelector(
    store => store.objectCardEstudante.dadosObjectCardEstudante
  );

  const [exibirLoader, setExibirLoader] = useState(false);

  const obterFrequenciaGlobalAluno = useCallback(async () => {
    const retorno = await ServicoConselhoClasse.obterFrequenciaAluno(
      codigoAluno,
      codigoTurma
    ).catch(e => erros(e));

    return retorno?.data;
  }, [codigoTurma, codigoAluno]);

  const obterDadosEstudante = useCallback(async () => {
    setExibirLoader(true);
    const resultado = await ServicoEstudante.obterDadosEstudante(
      codigoAluno,
      anoLetivo,
      codigoTurma
    ).catch(e => erros(e));

    if (resultado?.data) {
      const aluno = {
        ...resultado.data,
        codigoEOL: resultado.data.codigoAluno,
        numeroChamada: resultado.data.numeroAlunoChamada,
        turma: resultado.data.turmaEscola,
      };
      if (consultarFrequenciaGlobal) {
        const novaFreq = await obterFrequenciaGlobalAluno();
        aluno.frequencia = novaFreq;
      }
      dispatch(setDadosObjectCardEstudante({ ...aluno }));
      setExibirLoader(false);
    }
  }, [
    dispatch,
    consultarFrequenciaGlobal,
    codigoAluno,
    anoLetivo,
    codigoTurma,
    obterFrequenciaGlobalAluno,
  ]);

  useEffect(() => {
    if (!dadosObjectCardEstudante?.codigoEOL && !dadosIniciais) {
      if (codigoAluno && anoLetivo) {
        obterDadosEstudante();
      } else {
        dispatch(setDadosObjectCardEstudante());
      }
    }
  }, [
    dispatch,
    codigoAluno,
    anoLetivo,
    codigoTurma,
    dadosObjectCardEstudante,
    obterDadosEstudante,
    dadosIniciais,
  ]);

  useEffect(() => {
    if (!dadosObjectCardEstudante?.codigoEOL && dadosIniciais) {
      const aluno = {
        ...dadosIniciais,
        codigoEOL: dadosIniciais.codigoAluno,
        numeroChamada: dadosIniciais.numeroAlunoChamada,
        turma: dadosIniciais.turmaEscola,
      };
      dispatch(setDadosObjectCardEstudante(aluno));
    }
  }, [dispatch, dadosObjectCardEstudante, dadosIniciais]);

  useEffect(() => {
    return () => dispatch(setDadosObjectCardEstudante());
  }, [dispatch]);

  return (
    <Loader loading={exibirLoader}>
      <DetalhesAluno
        dados={dadosObjectCardEstudante}
        exibirBotaoImprimir={exibirBotaoImprimir}
        exibirFrequencia={exibirFrequencia}
        permiteAlterarImagem={permiteAlterarImagem}
      />
    </Loader>
  );
};

ObjectCardEstudante.propTypes = {
  codigoAluno: PropTypes.oneOfType([PropTypes.any]),
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  codigoTurma: PropTypes.oneOfType([PropTypes.any]),
  exibirBotaoImprimir: PropTypes.bool,
  exibirFrequencia: PropTypes.bool,
  permiteAlterarImagem: PropTypes.bool,
  dadosIniciais: PropTypes.oneOfType([PropTypes.any]),
  consultarFrequenciaGlobal: PropTypes.bool,
};

ObjectCardEstudante.defaultProps = {
  codigoAluno: '',
  anoLetivo: '',
  codigoTurma: null,
  exibirBotaoImprimir: true,
  exibirFrequencia: true,
  permiteAlterarImagem: true,
  dadosIniciais: null,
  consultarFrequenciaGlobal: false,
};

export default ObjectCardEstudante;
