import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';

import { Base, PainelCollapse } from '~/componentes';

import { erros } from '~/servicos';
import ServicoDiarioBordo from '~/servicos/Paginas/DiarioClasse/ServicoDiarioBordo';

import ListaoContext from '../../../listaoContext';

const TabListaoDiarioBordoCollapses = () => {
  const [diariosBordo, setDiariosBordo] = useState([]);

  const usuario = useSelector(store => store.usuario);
  // const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;
  // const acaoTelaEmEdicao = useSelector(store => store.geral.acaoTelaEmEdicao);

  const {
    // bimestreOperacoes,
    setExibirLoaderGeral,
    // listaPeriodos,
    // setListaPeriodos,
    periodo,
    // setPeriodo,
    // periodoAbertoListao,
    compCurricularTabDiarioBordo,
    // setCompCurricularTabDiarioBordo,
  } = useContext(ListaoContext);

  const exibirDiarioBordoCollapses =
    compCurricularTabDiarioBordo && periodo && diariosBordo?.length;

  const obterDiarioBordoListao = useCallback(
    async (
      turmaSelec,
      periodoSelecionado,
      compCurricularTabDiarioBordoSelecionado
    ) => {
      setExibirLoaderGeral(true);
      const retorno = await ServicoDiarioBordo.obterDiarioBordoListao(
        turmaSelec,
        periodoSelecionado?.dataInicio,
        periodoSelecionado?.dataFim,
        compCurricularTabDiarioBordoSelecionado
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoaderGeral(false));

      if (retorno?.data) {
        setDiariosBordo(retorno.data);
      }
    },
    [setExibirLoaderGeral]
  );

  useEffect(() => {
    if (turma && periodo && compCurricularTabDiarioBordo) {
      obterDiarioBordoListao(turma, periodo, compCurricularTabDiarioBordo);
    }
  }, [turma, periodo, compCurricularTabDiarioBordo, obterDiarioBordoListao]);

  const onColapse = () => {};

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24}>
        {exibirDiarioBordoCollapses &&
          diariosBordo.map(({ id, titulo, pendente }) => {
            const bordaCollapse = pendente
              ? Base.LaranjaStatus
              : Base.AzulBordaCollapse;
            const keyCollapse = id + titulo;

            return (
              <PainelCollapse accordion onChange={onColapse}>
                <PainelCollapse.Painel
                  key={keyCollapse}
                  accordion
                  espacoPadrao
                  corBorda={bordaCollapse}
                  temBorda
                  header={titulo}
                  ehPendente={pendente}
                />
              </PainelCollapse>
            );
          })}
      </Col>
    </Row>
  );
};

export default TabListaoDiarioBordoCollapses;
