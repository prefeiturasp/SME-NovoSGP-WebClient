import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import { Auditoria, Base, CardCollapse } from '~/componentes';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import ListaoContext from '../../../listaoContext';
import ListaoObjetivosAprendizagem from './componentes/listaoObjetivosAprendizagem';
import ObjetivosEspecificosDesenvolvimentoAula from './componentes/listaoPlanoAulaCampoEditor';

const ListaoPlanoAulaMontarDados = () => {
  const dispatch = useDispatch();

  const { dadosPlanoAula, setDadosPlanoAula } = useContext(ListaoContext);

  const configCabecalho = {
    altura: '48px',
    corBorda: Base.AzulBordaCollapse,
  };

  // TODO - Permissão!
  const desabilitar = false;

  const onChangeEditor = (novaDescricao, indexPlano) => {
    dadosPlanoAula[indexPlano].descricao = novaDescricao;
    setDadosPlanoAula(dadosPlanoAula);
    dispatch(setTelaEmEdicao(true));
  };

  const montar = (plano, indexPlano) => {
    const { dataAula, qtdAulas, auditoria } = plano;

    const indice = `plano-aula-collapse-${indexPlano}`;
    return (
      <CardCollapse
        titulo={`${dataAula.format('DD/MM/YYYY')} - ${qtdAulas} Aula(s)`}
        indice={indice}
        key={indice}
        configCabecalho={configCabecalho}
      >
        <Row gutter={[24, 24]}>
          <ListaoObjetivosAprendizagem indexPlano={indexPlano} />
        </Row>
        <ObjetivosEspecificosDesenvolvimentoAula
          dados={plano}
          indexPlano={indexPlano}
          desabilitar={desabilitar}
          onChange={novaDescricao => onChangeEditor(novaDescricao, indexPlano)}
        />
        <Row gutter={[24, 24]}>
          <Auditoria
            criadoEm={auditoria?.criadoEm}
            criadoPor={auditoria?.criadoPor}
            alteradoPor={auditoria?.alteradoPor}
            alteradoEm={auditoria?.alteradoEm}
            alteradoRf={auditoria?.alteradoRF}
            criadoRf={auditoria?.criadoRF}
          />
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
