import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import {
  SGP_SELECT_BIMESTRE,
  SGP_SELECT_COMPONENTE_CURRICULAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { ModalidadeDTO } from '~/dtos';
import { setLimparModoEdicaoGeral } from '~/redux/modulos/geral/actions';
import { erros, ServicoDisciplina } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import ListaoContext from '../listaoContext';

const ListaoOperacoesFiltros = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { modalidade, turma } = turmaSelecionada;
  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const acaoTelaEmEdicao = useSelector(store => store.geral.acaoTelaEmEdicao);

  const {
    bimestre,
    listaBimestres,
    componenteCurricularInicial,
    setComponenteCurricularInicial,
    bimestreOperacoes,
    setBimestreOperacoes,
    setComponenteCurricular,
    componenteCurricular,
    setListaComponenteCurricular,
    listaComponenteCurricular,
    setPeriodoAbertoListao,
    limparTelaListao,
  } = useContext(ListaoContext);

  const [listaBimestresOperacoe, setListaBimestresOperacoes] = useState(
    listaBimestres
  );

  const [bimestreInicial, setBimestreInicial] = useState(bimestre);

  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    return () => {
      setComponenteCurricular();
      setBimestreOperacoes();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const obterComponentesCurriculares = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await ServicoDisciplina.obterDisciplinasPorTurma(turma)
      .finally(() => setExibirLoader(false))
      .catch(e => erros(e));

    if (resposta?.data?.length) {
      setListaComponenteCurricular(resposta.data);
      if (resposta.data.length === 1) {
        setComponenteCurricular({ ...resposta.data[0] });
      }
    } else {
      setListaComponenteCurricular([]);
      setComponenteCurricular();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma]);

  useEffect(() => {
    setListaComponenteCurricular([]);
    setComponenteCurricular();
    setListaBimestresOperacoes([]);
    setBimestreOperacoes();

    if (turma) {
      obterComponentesCurriculares();
    } else {
      limparTelaListao();
      dispatch(setLimparModoEdicaoGeral());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma, obterComponentesCurriculares]);

  useEffect(() => {
    if (bimestreOperacoes && listaBimestresOperacoe?.length) {
      const dadosBimestre = listaBimestresOperacoe.find(
        item => item.valor === bimestreOperacoes
      );
      if (dadosBimestre) {
        setPeriodoAbertoListao(dadosBimestre.periodoAberto);
      } else {
        setPeriodoAbertoListao(true);
      }
    } else {
      setPeriodoAbertoListao(true);
    }
  }, [bimestreOperacoes, listaBimestresOperacoe]);

  const obterBimestresAbertoFechado = useCallback(async () => {
    const retorno = await ServicoPeriodoEscolar.obterPeriodosAbertos(
      turma
    ).catch(e => erros(e));
    if (retorno?.data?.length) {
      const lista = retorno.data.map(item => {
        return {
          valor: String(item.bimestre),
          descricao: `${item.bimestre}º Bimestre`,
          periodoAberto: item.aberto,
        };
      });

      if (modalidade !== String(ModalidadeDTO.INFANTIL)) {
        lista.push({ descricao: 'Final', valor: '0' });
      }
      setListaBimestresOperacoes(lista);
    } else {
      setListaBimestresOperacoes([]);
    }
  }, [turma, modalidade]);

  useEffect(() => {
    if (turma && listaComponenteCurricular?.length && componenteCurricular) {
      obterBimestresAbertoFechado();
    } else {
      setListaBimestresOperacoes([]);
      setBimestreOperacoes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma, componenteCurricular, listaComponenteCurricular]);

  useEffect(() => {
    if (
      bimestreInicial &&
      listaBimestresOperacoe?.length &&
      listaComponenteCurricular?.length &&
      componenteCurricular
    ) {
      setBimestreOperacoes(bimestreInicial);
      setBimestreInicial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bimestreInicial,
    listaBimestresOperacoe,
    listaComponenteCurricular,
    componenteCurricular,
  ]);

  useEffect(() => {
    if (
      componenteCurricularInicial &&
      listaComponenteCurricular?.length &&
      listaComponenteCurricular?.length > 1
    ) {
      const componenteNaLista = listaComponenteCurricular.find(
        item => item.codigoComponenteCurricular === componenteCurricularInicial
      );
      if (componenteNaLista) {
        setComponenteCurricular(componenteNaLista);
      }
      setComponenteCurricularInicial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componenteCurricularInicial, listaComponenteCurricular]);

  const onChangeBimestre = async valor => {
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        setBimestreOperacoes(valor);
      }
    } else {
      setBimestreOperacoes(valor);
    }
  };

  const obterComponente = valor => {
    if (valor && listaComponenteCurricular?.length) {
      let componente = null;

      componente = listaComponenteCurricular?.find(
        item => Number(item?.codigoComponenteCurricular) === Number(valor)
      );
      return componente;
    }
    return null;
  };

  const setarComponente = valor => {
    setBimestreOperacoes();
    const componenteAtual = obterComponente(valor);
    if (componenteAtual) {
      setComponenteCurricular({ ...componenteAtual });
    } else {
      setComponenteCurricular();
    }
  };

  const onChangeComponenteCurricular = async valor => {
    if (telaEmEdicao) {
      const salvou = await acaoTelaEmEdicao();
      if (salvou) {
        setarComponente(valor);
      }
    } else {
      setarComponente(valor);
    }
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={16} lg={10}>
          <Loader loading={exibirLoader} tip="">
            <SelectComponent
              label="Componente curricular"
              id={SGP_SELECT_COMPONENTE_CURRICULAR}
              lista={listaComponenteCurricular}
              valueOption="codigoComponenteCurricular"
              valueText="nome"
              valueSelect={
                componenteCurricular?.codigoComponenteCurricular
                  ? String(componenteCurricular?.codigoComponenteCurricular)
                  : undefined
              }
              onChange={onChangeComponenteCurricular}
              placeholder="Selecione um componente curricular"
              showSearch
              disabled={
                !turmaSelecionada.turma ||
                listaComponenteCurricular?.length === 1 ||
                !listaComponenteCurricular?.length
              }
            />
          </Loader>
        </Col>
        <Col sm={24} md={8} lg={6}>
          <SelectComponent
            id={SGP_SELECT_BIMESTRE}
            lista={listaBimestresOperacoe}
            valueOption="valor"
            valueText="descricao"
            label="Bimestre"
            disabled={
              listaBimestresOperacoe?.length === 1 ||
              !listaBimestresOperacoe?.length
            }
            valueSelect={bimestreOperacoes}
            onChange={onChangeBimestre}
            placeholder="Selecione o bimestre"
          />
        </Col>
      </Row>
    </Col>
  );
};

export default ListaoOperacoesFiltros;
