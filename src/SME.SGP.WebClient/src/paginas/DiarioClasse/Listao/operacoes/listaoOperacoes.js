import { Col } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { RotasDto } from '~/dtos';
import ListaoContext from '../listaoContext';
import ListaoAlertaTurma from './listaoAlertaTurma';
import ListaoOperacoesBotoesAcao from './listaoOperacoesBotoesAcao';
import ListaoOperacoesFiltros from './listaoOperacoesFiltros';
import ListaoTabs from './listaoTabs/listaoTabs';
import ListaoLoaderGeral from './listaoLoaderGeral';
import ListaoAlertaPeriodoAberto from './listaoAlertaPeriodoAberto';
import { verificaSomenteConsulta } from '~/servicos';

const ListaoOperacoes = () => {
  const { setSomenteConsultaListao } = useContext(ListaoContext);

  const permissoes = useSelector(state => state.usuario.permissoes);
  const permissoesTela = permissoes[RotasDto.LISTAO_OPERACOES];

  useEffect(() => {
    if (permissoesTela) {
      const soConsulta = verificaSomenteConsulta(permissoesTela);
      setSomenteConsultaListao(soConsulta);
    }
  }, [permissoesTela, setSomenteConsultaListao]);

  return (
    <>
      <ListaoAlertaTurma />
      <ListaoAlertaPeriodoAberto />
      <Cabecalho pagina="Operações" />
      <Card>
        <Col span={24}>
          <ListaoLoaderGeral>
            <ListaoOperacoesBotoesAcao />
            <ListaoOperacoesFiltros />
            <ListaoTabs />
          </ListaoLoaderGeral>
        </Col>
      </Card>
    </>
  );
};

export default ListaoOperacoes;
