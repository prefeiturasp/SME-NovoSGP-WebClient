import { Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Base, PainelCollapse } from '~/componentes';
import ListaoContext from '../../../listaoContext';
import { obterDiarioBordoListao } from '../../../listaoFuncoes';
import ConteudoCollapse from './conteudoCollapse';

const TabListaoDiarioBordoCollapses = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const {
    setExibirLoaderGeral,
    periodo,
    componenteCurricularDiarioBordo,
    dadosDiarioBordo,
    setDadosDiarioBordo,
    setDadosIniciaisDiarioBordo,
  } = useContext(ListaoContext);

  const exibirDiarioBordoCollapses =
    componenteCurricularDiarioBordo && periodo && dadosDiarioBordo?.length;

  useEffect(() => {
    if (turma && periodo && componenteCurricularDiarioBordo) {
      obterDiarioBordoListao(
        turma,
        periodo,
        componenteCurricularDiarioBordo,
        setExibirLoaderGeral,
        setDadosDiarioBordo,
        setDadosIniciaisDiarioBordo
      );
    }
  }, [periodo]);

  const onColapse = () => {};

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24}>
        {!!exibirDiarioBordoCollapses &&
          dadosDiarioBordo.map((dados, indexDiarioBordo) => {
            const { id, titulo, pendente } = dados;
            const bordaCollapse = pendente
              ? Base.LaranjaStatus
              : Base.AzulBordaCollapse;
            const keyCollapse = id + titulo;

            return (
              <PainelCollapse
                accordion
                onChange={onColapse}
                key={keyCollapse}
                defaultActiveKey={keyCollapse}
              >
                <PainelCollapse.Painel
                  key={keyCollapse}
                  accordion
                  espacoPadrao
                  corBorda={bordaCollapse}
                  temBorda
                  header={titulo}
                  ehPendente={pendente}
                >
                  <ConteudoCollapse
                    dados={dados}
                    indexDiarioBordo={indexDiarioBordo}
                    key={keyCollapse}
                  />
                </PainelCollapse.Painel>
              </PainelCollapse>
            );
          })}
      </Col>
    </Row>
  );
};

export default TabListaoDiarioBordoCollapses;
