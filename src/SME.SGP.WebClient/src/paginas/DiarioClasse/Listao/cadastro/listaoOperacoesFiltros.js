import { Col, Row } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import {
  SGP_SELECT_BIMESTRE,
  SGP_SELECT_COMPONENTE_CURRICULAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { erros, ServicoDisciplina } from '~/servicos';
import ListaoContext from '../listaoContext';

const ListaoOperacoesFiltros = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { modalidade, turma } = turmaSelecionada;

  const {
    obterBimestres,
    bimestre,
    listaBimestres,
    componenteCurricularInicial,
    setComponenteCurricularInicial,
    bimestreOperacoes,
    setBimestreOperacoes,
    setComponenteCurricular,
    componenteCurricular,
  } = useContext(ListaoContext);

  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
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
        setComponenteCurricular(
          String(resposta.data[0].codigoComponenteCurricular)
        );
      }
    } else {
      setListaComponenteCurricular([]);
      setComponenteCurricular();
    }
  }, [turma]);

  useEffect(() => {
    setListaComponenteCurricular([]);
    setComponenteCurricular();
    setListaBimestresOperacoes([]);
    setBimestreOperacoes();
    if (turma) {
      obterComponentesCurriculares();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turma, obterComponentesCurriculares]);

  useEffect(() => {
    if (
      modalidade &&
      listaComponenteCurricular?.length &&
      componenteCurricular
    ) {
      const bimestres = obterBimestres(modalidade);
      setListaBimestresOperacoes(bimestres);
    } else {
      setListaBimestresOperacoes([]);
      setBimestreOperacoes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidade, turma, componenteCurricular]);

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
        setComponenteCurricular(String(componenteCurricularInicial));
      }
      setComponenteCurricularInicial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componenteCurricularInicial, listaComponenteCurricular]);

  const onChangeBimestre = valor => setBimestreOperacoes(valor);
  const onChangeComponenteCurricular = valor => setComponenteCurricular(valor);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={24} lg={10}>
          <Loader loading={exibirLoader} tip="">
            <SelectComponent
              label="Componente curricular"
              id={SGP_SELECT_COMPONENTE_CURRICULAR}
              lista={listaComponenteCurricular}
              valueOption="codigoComponenteCurricular"
              valueText="nome"
              valueSelect={componenteCurricular}
              onChange={onChangeComponenteCurricular}
              placeholder="Selecione um componente curricular"
              showSearch
              disabled={
                !turmaSelecionada.turma ||
                listaComponenteCurricular.length === 1 ||
                !listaComponenteCurricular.length
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
