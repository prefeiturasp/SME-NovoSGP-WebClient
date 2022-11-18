import PropTypes from 'prop-types';
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
  setCodigoDre,
  setCodigoTurma,
  setCodigoUe,
  setDreId,
  setTurmaId,
  setUeId,
} from '~/redux/modulos/localizarEstudante/actions';

const LocalizarEstudante = props => {
  const {} = props;

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const listaAnosLetivo = [
    {
      label: anoAtual,
      id: anoAtual,
    },
  ];

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

  const dreId = useSelector(state => state.localizarEstudante.dreId);
  const codigoDre = useSelector(state => state.localizarEstudante.codigoDre);

  const ueId = useSelector(state => state.localizarEstudante.ueId);
  const codigoUe = useSelector(state => state.localizarEstudante.codigoUe);

  const turmaId = useSelector(state => state.localizarEstudante.turmaId);
  const codigoTurma = useSelector(
    state => state.localizarEstudante.codigoTurma
  );

  const obterDres = useCallback(async () => {
    if (anoAtual) {
      setCarregandoDres(true);

      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/false/dres?anoLetivo=${anoAtual}`
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        const lista = resposta.data
          .map(item => ({
            nome: item.nome,
            id: String(item.id),
            codigo: String(item.codigo),
          }))
          .sort(FiltroHelper.ordenarLista('nome'));
        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          store.dispatch(setDreId(lista[0].id));
          store.dispatch(setCodigoDre(lista[0].codigo));
        }
      } else {
        setListaDres([]);
        store.dispatch(setDreId());
        store.dispatch(setCodigoDre());
      }
    }
  }, [anoAtual]);

  const obterUes = useCallback(async () => {
    if (codigoDre && anoAtual) {
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        codigoDre,
        `v1/abrangencias/false/dres/${codigoDre}/ues?anoLetivo=${anoAtual}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data.map(item => ({
          nome: item.nome,
          id: String(item.id),
          codigo: String(item.codigo),
        }));

        if (lista?.length === 1) {
          store.dispatch(setUeId(lista[0].id));
          store.dispatch(setCodigoUe(lista[0].codigo));
        }

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [codigoDre, anoAtual]);

  const obterTurmas = useCallback(async () => {
    if (codigoUe) {
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

      if (resposta?.data) {
        setListaTurmas(resposta.data);

        if (resposta?.data.length === 1) {
          store.dispatch(setTurmaId());
          store.dispatch(setCodigoTurma());
        }
      }
    }
  }, [codigoUe, anoAtual]);

  const onChangeDre = dre => {
    store.dispatch(setDreId(dre));
    store.dispatch(setCodigoUe());
    store.dispatch(setCodigoTurma());

    setListaUes([]);
    setListaTurmas([]);
  };

  const onChangeUe = ue => {
    store.dispatch(setCodigoUe(ue));
    store.dispatch(setCodigoTurma());

    setListaTurmas([]);
  };

  const onChangeTurma = turma => {
    store.dispatch(setCodigoTurma(turma));
  };

  const onChangeLocalizadorEstudante = aluno => {
    if (aluno?.alunoCodigo && aluno?.alunoNome) {
      setAlunoLocalizadorSelecionado({
        codigoAluno: aluno?.alunoCodigo,
        codigoTurma: aluno?.codigoTurma,
        turmaId: aluno?.turmaId,
      });
    } else {
      setAlunoLocalizadorSelecionado();
    }
  };

  useEffect(() => {
    if (anoAtual) {
      obterDres();
    }
  }, [anoAtual, obterDres]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setListaUes([]);
      store.dispatch(setCodigoUe());
    }
  }, [codigoDre, anoAtual, obterUes]);

  useEffect(() => {
    if (codigoUe) {
      obterTurmas();
    } else {
      setListaTurmas([]);
      store.dispatch(setCodigoTurma());
    }
  }, [codigoUe, obterTurmas]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <SelectComponent
            valueText="id"
            label="Ano letivo"
            valueOption="label"
            lista={listaAnosLetivo}
            valueSelect={anoAtual}
            placeholder="Ano letivo"
            id={SGP_SELECT_ANO_LETIVO}
            disabled={listaAnosLetivo?.length === 1}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Loader loading={carregandoDres} ignorarTip>
            <SelectComponent
              showSearch
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
              showSearch
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
              placeholder="Turma"
              lista={listaTurmas}
              valueOption="codigo"
              id={SGP_SELECT_TURMA}
              valueText="nomeFiltro"
              onChange={onChangeTurma}
              valueSelect={codigoTurma}
              disabled={listaTurmas?.length === 1}
            />
          </Loader>
        </Col>

        <Col sm={24} md={24} lg={16}>
          <LocalizadorEstudante
            showLabel
            anoLetivo={anoAtual}
            id={SGP_SELECT_ESTUDANTE_CRIANCA}
            ueId={codigoDre ? codigoUe : ''}
            onChange={onChangeLocalizadorEstudante}
            // desabilitado={
            //   !codigoUe || ((ehProfessor || ehProfessorInfantil) && !codigoTurma)
            // }
            codigoTurma={codigoDre ? codigoTurma : ''}
            valorInicialAlunoCodigo={alunoLocalizadorSelecionado?.codigoAluno}
          />
        </Col>
      </Row>
    </>
  );
};

LocalizarEstudante.propTypes = {};

LocalizarEstudante.defaultProps = {};

export default LocalizarEstudante;
