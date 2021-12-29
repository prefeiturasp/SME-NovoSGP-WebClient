import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import shortid from 'shortid';
import { Auditoria, Base, CardCollapse } from '~/componentes';
import ListaoContext from '../../../listaoContext';
import ListaoObjetivosAprendizagem from './componentes/listaoObjetivosAprendizagem';
import ObjetivosEspecificosDesenvolvimentoAula from './componentes/listaoPlanoAulaCampoEditor';

const ListaoPlanoAulaMontarDados = () => {
  const {
    dadosPlanoAula,
    somenteConsultaListao,
    periodoAbertoListao,
    componenteCurricular,
  } = useContext(ListaoContext);

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const configCabecalho = {
    altura: '48px',
    corBorda: Base.AzulBordaCollapse,
  };

  const montar = (plano, indexPlano) => {
    const { dataAula, qtdAulas, ehReposicao } = plano;

    const indice = `plano-aula-collapse-${indexPlano}`;
    let titulo = `${window
      .moment(dataAula)
      .format('DD/MM/YYYY')} - ${qtdAulas} Aula(s)`;

    if (ehReposicao) {
      titulo += ' - Reposição';
    }
    return (
      <CardCollapse
        titulo={titulo}
        indice={indice}
        key={indice}
        configCabecalho={configCabecalho}
        show
      >
        {componenteCurricular?.possuiObjetivos ? (
          <ListaoObjetivosAprendizagem
            indexPlano={indexPlano}
            desabilitarCampos={desabilitarCampos}
            plano={plano}
          />
        ) : (
          <ObjetivosEspecificosDesenvolvimentoAula
            dados={plano}
            indexPlano={indexPlano}
            desabilitar={desabilitarCampos}
          />
        )}
        <Row gutter={[24, 24]}>
          {plano?.criadoEm ? (
            <Auditoria
              criadoEm={plano?.criadoEm}
              criadoPor={plano?.criadoPor}
              alteradoPor={plano?.alteradoPor}
              alteradoEm={plano?.alteradoEm}
              alteradoRf={plano?.alteradoRf}
              criadoRf={plano?.criadoRf}
            />
          ) : (
            <></>
          )}
        </Row>
      </CardCollapse>
    );
  };

  return dadosPlanoAula?.length ? (
    dadosPlanoAula.map((plano, indexPlano) => (
      <Col sm={24} key={shortid.generate()}>
        {montar(plano, indexPlano)}
      </Col>
    ))
  ) : (
    <></>
  );
};

export default ListaoPlanoAulaMontarDados;
