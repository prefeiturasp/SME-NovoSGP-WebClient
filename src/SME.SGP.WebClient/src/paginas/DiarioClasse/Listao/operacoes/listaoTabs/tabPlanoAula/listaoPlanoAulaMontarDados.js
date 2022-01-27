import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import shortid from 'shortid';
import { Alert, Auditoria, Base, CardCollapse } from '~/componentes';
import ListaoContext from '../../../listaoContext';
import CopiarConteudoListaoPlanoAula from './componentes/copiarConteudoListaoPlanoAula';
import ListaoObjetivosAprendizagem from './componentes/listaoObjetivosAprendizagem';
import ObjetivosEspecificosDesenvolvimentoAula from './componentes/listaoPlanoAulaCampoEditor';

const ListaoPlanoAulaMontarDados = () => {
  const {
    dadosPlanoAula,
    setDadosPlanoAula,
    somenteConsultaListao,
    periodoAbertoListao,
    componenteCurricular,
    setExibirLoaderGeral,
    setExecutarObterPlanoAulaPorPeriodo,
  } = useContext(ListaoContext);

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const configCabecalho = {
    altura: '48px',
    corBorda: Base.AzulBordaCollapse,
  };

  const montar = (plano, indexPlano) => {
    const { dataAula, qtdAulas, ehReposicao, aulaCj } = plano;

    const indice = `plano-aula-collapse-${indexPlano}`;
    const textoCj = aulaCj ? 'Aula CJ' : '';
    let titulo = `${window
      .moment(dataAula)
      .format('DD/MM/YYYY')} ${textoCj} - ${qtdAulas} Aula(s)`;

    if (ehReposicao) {
      titulo += ' - Reposição';
    }

    const desabilitar = plano?.bloquearParaCopia || desabilitarCampos;
    return (
      <CardCollapse
        titulo={titulo}
        indice={indice}
        key={indice}
        configCabecalho={configCabecalho}
        show
      >
        {plano.bloquearParaCopia && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'bloquear-para-copia',
              mensagem: 'Conteúdo será copiado de outra data',
              estiloTitulo: { fontSize: '18px' },
            }}
            className="mb-2"
          />
        )}
        {componenteCurricular?.possuiObjetivos ? (
          <ListaoObjetivosAprendizagem
            indexPlano={indexPlano}
            desabilitarCampos={desabilitar}
            plano={plano}
          />
        ) : (
          <ObjetivosEspecificosDesenvolvimentoAula
            dados={plano}
            indexPlano={indexPlano}
            desabilitar={desabilitar}
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
        <Row gutter={[24, 24]}>
          <Col sm={24}>
            <CopiarConteudoListaoPlanoAula
              desabilitar={desabilitar}
              dadosPlanoAtual={plano}
              codigoComponenteCurricular={
                componenteCurricular?.codigoComponenteCurricular
              }
              setExibirLoaderGeral={setExibirLoaderGeral}
              dadosPlanoAula={dadosPlanoAula}
              setDadosPlanoAula={setDadosPlanoAula}
              indexPlano={indexPlano}
              setExecutarObterPlanoAulaPorPeriodo={
                setExecutarObterPlanoAulaPorPeriodo
              }
            />
          </Col>
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
