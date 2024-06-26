import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import LocalizadorEstudante from '~/componentes/LocalizadorEstudante';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_PROXIMO_PASSO,
} from '~/constantes/ids/button';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_ESTUDANTE_CRIANCA,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import {
  setDadosCollapseLocalizarEstudante,
  setLimparDadosLocalizarEstudante,
} from '~/redux/modulos/collapseLocalizarEstudante/actions';
import { AbrangenciaServico, erros } from '~/servicos';

const CollapseLocalizarEstudanteDados = props => {
  const {
    changeDre,
    changeUe,
    changeTurma,
    changeLocalizadorEstudante,
    clickCancelar,
    clickProximoPasso,
    validarSePermiteProximoPasso,
  } = props;
  const dispatch = useDispatch();

  const ehProfessor = useSelector(store => store.usuario)?.ehProfessor;
  const ehProfessorInfantil = useSelector(
    store => store.usuario
  )?.ehProfessorInfantil;

  const dadosIniciais = useSelector(
    store => store.collapseLocalizarEstudante.dadosIniciaisLocalizarEstudante
  );

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const listaAnosLetivo = [
    {
      desc: anoAtual,
      valor: anoAtual,
    },
  ];

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);

  const [codigoDre, setCodigoDre] = useState(dadosIniciais?.dreId);
  const [codigoUe, setCodigoUe] = useState(dadosIniciais?.ueId);
  const [codigoTurma, setCodigoTurma] = useState();

  const [alunoLocalizadorSelecionado, setAlunoLocalizadorSelecionado] =
    useState();

  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);

  const [carregandoUes, setCarregandoUes] = useState(false);

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
          desc: item.nome,
          valor: String(item.codigo),
        }));

        if (lista?.length === 1) {
          setCodigoUe(lista[0].valor);
        }

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [codigoDre, anoAtual]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setCodigoUe();
      setListaUes([]);
    }
  }, [codigoDre, anoAtual, obterUes]);

  useEffect(() => {
    return () => dispatch(setLimparDadosLocalizarEstudante({}));
  }, [dispatch]);

  const onChangeDre = dre => {
    setCodigoDre(dre);

    setListaUes([]);
    setCodigoUe();

    setListaTurmas([]);
    setCodigoTurma();

    setAlunoLocalizadorSelecionado();
    dispatch(setLimparDadosLocalizarEstudante());

    changeDre(dre);
  };

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
            desc: item.nome,
            valor: String(item.codigo),
            abrev: item.abreviacao,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          setCodigoDre(lista[0].valor);
        }
      } else {
        setListaDres([]);
        setCodigoDre();
      }
    }
  }, [anoAtual]);

  useEffect(() => {
    if (anoAtual) {
      obterDres();
    }
  }, [anoAtual, obterDres]);

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
          setCodigoTurma(resposta.data[0].codigo);
        }
      }
    }
  }, [anoAtual, codigoUe]);

  useEffect(() => {
    if (codigoUe) {
      obterTurmas();
    } else {
      setCodigoTurma();
      setListaTurmas([]);
    }
  }, [codigoUe, obterTurmas]);

  const onChangeUe = ue => {
    setCodigoUe(ue);

    setListaTurmas([]);
    setCodigoTurma();

    setAlunoLocalizadorSelecionado();
    dispatch(setLimparDadosLocalizarEstudante());
    changeUe(ue);
  };

  const onChangeTurma = turma => {
    setCodigoTurma(turma);
    setAlunoLocalizadorSelecionado();
    dispatch(setLimparDadosLocalizarEstudante());
    changeTurma(turma);
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
      dispatch(setLimparDadosLocalizarEstudante());
      changeLocalizadorEstudante(aluno);
    }
  };

  const onClickProximoPasso = async () => {
    let continuar = true;
    if (validarSePermiteProximoPasso) {
      continuar = await validarSePermiteProximoPasso({
        estudanteCodigo: alunoLocalizadorSelecionado.codigoAluno,
        ueCodigo: codigoUe,
      });
    }

    if (continuar) {
      const params = {
        anoLetivo: anoAtual,
        codigoDre,
        codigoUe,
        codigoTurma: alunoLocalizadorSelecionado.codigoTurma,
        codigoAluno: alunoLocalizadorSelecionado.codigoAluno,
        turmaId: alunoLocalizadorSelecionado.turmaId,
      };

      dispatch(setDadosCollapseLocalizarEstudante(params));
      clickProximoPasso(true);
    }
  };

  const onClickCancelar = () => {
    setCodigoDre();
    setListaDres([]);

    setCodigoUe();
    setListaUes([]);

    setListaTurmas([]);
    setCodigoTurma();

    setAlunoLocalizadorSelecionado();
    dispatch(setLimparDadosLocalizarEstudante());

    obterDres();
    clickCancelar();
  };

  return (
    <div className="row">
      <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
        <SelectComponent
          id={SGP_SELECT_ANO_LETIVO}
          label="Ano Letivo"
          lista={listaAnosLetivo}
          valueOption="valor"
          valueText="desc"
          disabled
          valueSelect={anoAtual}
          placeholder="Ano letivo"
        />
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
        <Loader loading={carregandoDres} tip="">
          <SelectComponent
            id={SGP_SELECT_DRE}
            label="Diretoria Regional de Educação (DRE)"
            lista={listaDres}
            valueOption="valor"
            valueText="desc"
            disabled={!anoAtual || listaDres?.length === 1}
            onChange={onChangeDre}
            valueSelect={codigoDre}
            placeholder="Diretoria Regional De Educação (DRE)"
            showSearch
          />
        </Loader>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 mb-2">
        <Loader loading={carregandoUes} tip="">
          <SelectComponent
            id={SGP_SELECT_UE}
            label="Unidade Escolar (UE)"
            lista={listaUes}
            valueOption="valor"
            valueText="desc"
            disabled={!codigoDre || listaUes?.length === 1}
            onChange={onChangeUe}
            valueSelect={codigoUe}
            placeholder="Unidade Escolar (UE)"
            showSearch
          />
        </Loader>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-4 mb-2">
        <Loader loading={carregandoTurmas} tip="">
          <SelectComponent
            id={SGP_SELECT_TURMA}
            lista={listaTurmas}
            valueOption="codigo"
            valueText="nomeFiltro"
            label="Turma"
            valueSelect={codigoTurma}
            onChange={onChangeTurma}
            placeholder="Turma"
            disabled={listaTurmas?.length === 1}
            showSearch
          />
        </Loader>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-8 mb-2">
        <div className="row">
          <LocalizadorEstudante
            id={SGP_SELECT_ESTUDANTE_CRIANCA}
            showLabel
            ueId={codigoDre ? codigoUe : ''}
            onChange={onChangeLocalizadorEstudante}
            anoLetivo={anoAtual}
            desabilitado={
              !codigoUe ||
              ((ehProfessor || ehProfessorInfantil) && !codigoTurma)
            }
            codigoTurma={codigoDre ? codigoTurma : ''}
            valorInicialAlunoCodigo={alunoLocalizadorSelecionado?.codigoAluno}
          />
        </div>
      </div>
      <div className="col-md-12 d-flex justify-content-end pb-4 mt-2">
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="mr-3"
          onClick={onClickCancelar}
        />
        <Button
          id={SGP_BUTTON_PROXIMO_PASSO}
          label="Próximo passo"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickProximoPasso}
          disabled={
            !alunoLocalizadorSelecionado?.codigoAluno ||
            ((ehProfessor || ehProfessorInfantil) && !codigoTurma)
          }
        />
      </div>
    </div>
  );
};

CollapseLocalizarEstudanteDados.propTypes = {
  changeDre: PropTypes.func,
  changeUe: PropTypes.func,
  changeTurma: PropTypes.func,
  changeLocalizadorEstudante: PropTypes.func,
  clickCancelar: PropTypes.func,
  clickProximoPasso: PropTypes.func,
  validarSePermiteProximoPasso: PropTypes.func,
};

CollapseLocalizarEstudanteDados.defaultProps = {
  changeDre: () => {},
  changeUe: () => {},
  changeTurma: () => {},
  changeLocalizadorEstudante: () => {},
  clickCancelar: () => {},
  clickProximoPasso: () => {},
  validarSePermiteProximoPasso: null,
};

export default CollapseLocalizarEstudanteDados;
