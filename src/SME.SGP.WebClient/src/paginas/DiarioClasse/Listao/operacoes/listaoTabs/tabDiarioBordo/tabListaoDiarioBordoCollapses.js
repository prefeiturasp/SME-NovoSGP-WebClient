import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';

import { Base, PainelCollapse } from '~/componentes';

import { erros, ServicoDiarioBordo } from '~/servicos';

import ListaoContext from '../../../listaoContext';
import ConteudoCollapse from './conteudoCollapse';

const TabListaoDiarioBordoCollapses = () => {
  const [diariosBordo, setDiariosBordo] = useState([]);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const {
    setExibirLoaderGeral,
    periodo,
    compCurricularTabDiarioBordo,
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
        {!!exibirDiarioBordoCollapses &&
          diariosBordo.map(diarioBordo => {
            const { id, titulo, pendente } = diarioBordo;
            const bordaCollapse = pendente
              ? Base.LaranjaStatus
              : Base.AzulBordaCollapse;
            const keyCollapse = id + titulo;

            return (
              <>
                <PainelCollapse accordion onChange={onColapse}>
                  <PainelCollapse.Painel
                    key={keyCollapse}
                    accordion
                    espacoPadrao
                    corBorda={bordaCollapse}
                    temBorda
                    header={titulo}
                    ehPendente={pendente}
                  >
                    <ConteudoCollapse {...diarioBordo} />
                  </PainelCollapse.Painel>
                </PainelCollapse>
              </>
            );
          })}
      </Col>
    </Row>
  );
};

export default TabListaoDiarioBordoCollapses;
