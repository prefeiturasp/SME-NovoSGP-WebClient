import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Loader, SelectComponent } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import {
  BotaoGerarRelatorioRegistroIndividual,
  BotaoOrdenarListaAlunos,
  BotoesAcoes,
  DadosRegistroIndividual,
  Mensagens,
  ModalImpressaoRegistroIndividual,
  ObjectCardRegistroIndividual,
  TabelaRetratilRegistroIndividual,
} from './componentes';

import {
  resetarDadosRegistroIndividual,
  resetDataNovoRegistro,
  setAlunosRegistroIndividual,
  setComponenteCurricularSelecionado,
  setDadosAlunoObjectCard,
  setExibirLoaderGeralRegistroIndividual,
  setRecolherRegistrosAnteriores,
} from '~/redux/modulos/registroIndividual/actions';

import {
  ehTurmaInfantil,
  erros,
  ServicoDisciplina,
  ServicoRegistroIndividual,
  verificaSomenteConsulta,
} from '~/servicos';

import { RotasDto } from '~/dtos';
import MetodosRegistroIndividual from '~/componentes-sgp/RegistroIndividual/metodosRegistroIndividual';
import { SGP_SELECT_COMPONENTE_CURRICULAR } from '~/constantes/ids/select';

const RegistroIndividual = () => {
  const [exibirListas, setExibirListas] = useState(false);
  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [turmaInfantil, setTurmaInfantil] = useState(false);

  const componenteCurricularSelecionado = useSelector(
    state => state.registroIndividual.componenteCurricularSelecionado
  );

  const podeRealizarNovoRegistro = useSelector(
    state => state.registroIndividual.podeRealizarNovoRegistro
  );
  const exibirLoaderGeralRegistroIndividual = useSelector(
    state => state.registroIndividual.exibirLoaderGeralRegistroIndividual
  );

  const turmaSelecionada = useSelector(state => state.usuario.turmaSelecionada);
  const permissoes = useSelector(state => state.usuario.permissoes);
  const turmaId = turmaSelecionada?.id || 0;
  const permissoesTela = permissoes[RotasDto.REGISTRO_INDIVIDUAL];

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const dispatch = useDispatch();

  const resetarTela = useCallback(() => {
    dispatch(resetarDadosRegistroIndividual());
  }, [dispatch]);

  const obterListaAlunos = useCallback(async () => {
    const retorno = await ServicoRegistroIndividual.obterListaAlunos({
      componenteCurricularId: componenteCurricularSelecionado,
      turmaId,
    }).catch(e => erros(e));
    if (retorno?.data) {
      dispatch(setExibirLoaderGeralRegistroIndividual(false));
      dispatch(setAlunosRegistroIndividual(retorno.data));
      setExibirListas(true);
    } else {
      setExibirListas(false);
      dispatch(setAlunosRegistroIndividual([]));
      resetarTela();
    }
  }, [dispatch, resetarTela, componenteCurricularSelecionado, turmaId]);

  useEffect(() => {
    if (componenteCurricularSelecionado) {
      obterListaAlunos();
    } else {
      setExibirListas(false);
      dispatch(setAlunosRegistroIndividual([]));
      resetarTela();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componenteCurricularSelecionado]);

  useEffect(() => {
    if (!turmaId) {
      dispatch(setComponenteCurricularSelecionado(undefined));
    }
  }, [dispatch, turmaId]);

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setTurmaInfantil(infantil);

    verificaSomenteConsulta(permissoesTela, !infantil);
  }, [modalidadesFiltroPrincipal, turmaSelecionada, permissoesTela]);

  const permiteOnChangeAluno = async () => {
    return true;
  };

  const obterComponentesCurriculares = useCallback(async () => {
    const turma = turmaSelecionada?.turma || 0;
    dispatch(setExibirLoaderGeralRegistroIndividual(true));
    const resposta = await ServicoDisciplina.obterDisciplinasPorTurma(turma)
      .catch(e => erros(e))
      .finally();

    if (resposta?.data?.length) {
      setListaComponenteCurricular(resposta?.data);

      if (resposta?.data.length === 1) {
        dispatch(
          setComponenteCurricularSelecionado(
            String(resposta?.data[0].codigoComponenteCurricular)
          )
        );
      }
    } else {
      dispatch(setComponenteCurricularSelecionado(undefined));
      setListaComponenteCurricular([]);
    }
  }, [dispatch, turmaSelecionada]);

  useEffect(() => {
    if (turmaSelecionada?.turma && turmaInfantil) {
      dispatch(setComponenteCurricularSelecionado(undefined));
      obterComponentesCurriculares();
      return;
    }
    resetarTela();
  }, [
    turmaSelecionada,
    obterComponentesCurriculares,
    resetarTela,
    turmaInfantil,
    dispatch,
  ]);

  const onChangeComponenteCurricular = valor => {
    dispatch(setComponenteCurricularSelecionado(valor));
  };

  const onChangeAlunoSelecionado = async aluno => {
    MetodosRegistroIndividual.verificarSalvarRegistroIndividual(false);
    MetodosRegistroIndividual.resetarInfomacoes(true);
    resetarTela();
    dispatch(resetDataNovoRegistro(false));
    dispatch(setDadosAlunoObjectCard(aluno));

    if (podeRealizarNovoRegistro) {
      dispatch(setRecolherRegistrosAnteriores(true));
    }
  };

  useEffect(() => {
    return () => {
      resetarTela();
      dispatch(setComponenteCurricularSelecionado(undefined));
    };
  }, [turmaSelecionada, dispatch, resetarTela]);

  return (
    <Loader loading={exibirLoaderGeralRegistroIndividual}>
      <Mensagens />
      <ModalImpressaoRegistroIndividual />
      <Cabecalho pagina="Registro individual">
        <BotoesAcoes turmaInfantil={turmaInfantil} />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-4">
              <SelectComponent
                id={SGP_SELECT_COMPONENTE_CURRICULAR}
                name="ComponenteCurricularId"
                lista={listaComponenteCurricular || []}
                valueOption="codigoComponenteCurricular"
                valueText="nome"
                valueSelect={componenteCurricularSelecionado}
                onChange={onChangeComponenteCurricular}
                placeholder="Selecione um componente curricular"
                disabled={
                  !turmaInfantil || listaComponenteCurricular?.length === 1
                }
              />
            </div>
          </div>
          <div className="row">
            {exibirListas && turmaInfantil && (
              <>
                <div className="col-md-12 mb-3 d-flex">
                  <BotaoOrdenarListaAlunos />
                  <BotaoGerarRelatorioRegistroIndividual />
                </div>
                <div className="col-md-12 mb-2">
                  <TabelaRetratilRegistroIndividual
                    onChangeAlunoSelecionado={onChangeAlunoSelecionado}
                    permiteOnChangeAluno={permiteOnChangeAluno}
                  >
                    <>
                      <div className="mb-2">
                        <ObjectCardRegistroIndividual />
                      </div>
                      <DadosRegistroIndividual />
                    </>
                  </TabelaRetratilRegistroIndividual>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default RegistroIndividual;
