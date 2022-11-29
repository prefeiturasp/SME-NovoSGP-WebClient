import React, { useState, useCallback, useEffect } from 'react';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Loader, LocalizadorEstudante, SelectComponent } from '~/componentes';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_ESTUDANTE_CRIANCA,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { AbrangenciaServico, erros } from '~/servicos';
import { FiltroHelper } from '..';
import { store } from '~/redux';
import {
  setAluno,
  setDre,
  setTurma,
  setUe,
  setAnoLetivo,
} from '~/redux/modulos/localizarEstudante/actions';

const LocalizarEstudante = () => {
  const [anoAtual] = useState(window.moment().format('YYYY'));

  const listaAnosLetivo = [{ label: anoAtual, id: anoAtual }];

  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [
    alunoLocalizadorSelecionado,
    setAlunoLocalizadorSelecionado,
  ] = useState();

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);

  const codigoDre = useSelector(state => state.localizarEstudante.dre)?.codigo;
  const codigoUe = useSelector(state => state.localizarEstudante.ue)?.codigo;
  const codigoTurma = useSelector(state => state.localizarEstudante.turma)
    ?.codigo;

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);

    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/false/dres?anoLetivo=${anoAtual}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        store.dispatch(setDre(lista[0]));
      }
      setListaDres(lista);
    } else {
      setListaDres([]);
      store.dispatch(setDre());
    }
  }, [anoAtual]);

  const obterUes = useCallback(async () => {
    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      codigoDre,
      `v1/abrangencias/false/dres/${codigoDre}/ues?anoLetivo=${anoAtual}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      if (resposta?.data?.length === 1) {
        store.dispatch(setUe(resposta.data[0]));
      }

      setListaUes(resposta.data);
    } else {
      setListaUes([]);
      store.dispatch(setUe());
    }
  }, [codigoDre, anoAtual]);

  const obterTurmas = useCallback(async () => {
    setCarregandoTurmas(true);
    const resposta = await AbrangenciaServico.buscarTurmas(
      codigoUe,
      0,
      '',
      anoAtual,
      false
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.map(t => {
        return { ...t, nome: t?.nomeFiltro };
      });

      if (lista?.length === 1) {
        store.dispatch(setTurma(lista[0]));
      }
      setListaTurmas(lista);
    } else {
      setListaTurmas([]);
      store.dispatch(setTurma());
    }
  }, [codigoUe, anoAtual]);

  const onChangeDre = codigo => {
    const dreSelecionada = listaDres?.find(d => d?.codigo === codigo);

    store.dispatch(setDre(dreSelecionada));
    store.dispatch(setUe());
    store.dispatch(setTurma());

    setListaUes([]);
    setListaTurmas([]);

    store.dispatch(setAluno());
    setAlunoLocalizadorSelecionado();
  };

  const onChangeUe = codigo => {
    const ueSelecionada = listaUes?.find(d => d?.codigo === codigo);

    store.dispatch(setUe(ueSelecionada));
    store.dispatch(setTurma());

    setListaTurmas([]);

    store.dispatch(setAluno());
    setAlunoLocalizadorSelecionado();
  };

  const onChangeTurma = codigo => {
    const turmaSelecionada = listaTurmas?.find(d => d?.codigo === codigo);

    store.dispatch(setAluno());
    setAlunoLocalizadorSelecionado();
    store.dispatch(setTurma(turmaSelecionada));
  };

  const onChangeLocalizadorEstudante = (aluno, limpouDados) => {
    if (aluno?.alunoCodigo && aluno?.alunoNome) {
      const dadosAluno = {
        codigoAluno: aluno?.alunoCodigo,
      };

      setAlunoLocalizadorSelecionado(dadosAluno);
      store.dispatch(setAluno(dadosAluno));

      if (!codigoTurma) {
        const dadosTurma = {
          codigo: aluno?.codigoTurma,
          nome: aluno?.nomeComModalidadeTurma,
          id: aluno?.turmaId,
        };

        store.dispatch(setTurma(dadosTurma));
      }
    } else {
      setAlunoLocalizadorSelecionado();
      store.dispatch(setAluno());
      if (!limpouDados) {
        store.dispatch(setTurma());
      }
    }
  };

  useEffect(() => {
    if (anoAtual) {
      obterDres();
      store.dispatch(setAnoLetivo(anoAtual));
    }
  }, [anoAtual, obterDres]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setListaUes([]);
      store.dispatch(setUe());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoDre]);

  useEffect(() => {
    if (codigoUe) {
      obterTurmas();
    } else {
      setListaTurmas([]);
      store.dispatch(setTurma());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoUe]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <SelectComponent
            valueText="id"
            label="Ano letivo"
            valueOption="label"
            valueSelect={anoAtual}
            lista={listaAnosLetivo}
            placeholder="Ano letivo"
            id={SGP_SELECT_ANO_LETIVO}
            disabled={listaAnosLetivo?.length === 1}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Loader loading={carregandoDres} ignorarTip>
            <SelectComponent
              valueText="nome"
              id={SGP_SELECT_DRE}
              valueOption="codigo"
              onChange={onChangeDre}
              lista={listaDres || []}
              placeholder="Selecione uma DRE"
              disabled={listaDres?.length === 1}
              valueSelect={codigoDre || undefined}
              label="Diretoria Regional de Educação (DRE)"
            />
          </Loader>
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Loader loading={carregandoUes} ignorarTip>
            <SelectComponent
              valueText="nome"
              id={SGP_SELECT_UE}
              valueOption="codigo"
              onChange={onChangeUe}
              lista={listaUes || []}
              label="Unidade Escolar (UE)"
              placeholder="Selecione uma UE"
              valueSelect={codigoUe || undefined}
              disabled={!codigoDre || listaUes?.length === 1}
            />
          </Loader>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={24} lg={8}>
          <Loader loading={carregandoTurmas} ignorarTip>
            <SelectComponent
              label="Turma"
              valueText="nome"
              placeholder="Turma"
              lista={listaTurmas}
              valueOption="codigo"
              id={SGP_SELECT_TURMA}
              onChange={onChangeTurma}
              valueSelect={codigoTurma}
              disabled={!codigoUe || listaTurmas?.length === 1}
            />
          </Loader>
        </Col>

        <Col sm={24} md={24} lg={16} style={{ padding: 0 }}>
          <LocalizadorEstudante
            showLabel
            novaEstrutura
            anoLetivo={anoAtual}
            desabilitado={!codigoUe}
            ueId={codigoDre ? codigoUe : ''}
            id={SGP_SELECT_ESTUDANTE_CRIANCA}
            labelAlunoNome="Criança/Estudante"
            onChange={onChangeLocalizadorEstudante}
            placeholder="Procure pelo nome da criança"
            codigoTurma={codigoDre ? codigoTurma : ''}
            valorInicialAlunoCodigo={alunoLocalizadorSelecionado?.codigoAluno}
          />
        </Col>
      </Row>
    </>
  );
};

export default LocalizarEstudante;
