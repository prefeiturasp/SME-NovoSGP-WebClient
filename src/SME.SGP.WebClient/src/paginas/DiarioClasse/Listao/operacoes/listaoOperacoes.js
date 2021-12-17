import React, { useContext, useEffect } from 'react';
import { Col } from 'antd';

import { useSelector } from 'react-redux';
import { Card, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import ListaoContext from '../listaoContext';
import ListaoAlertaTurma from './listaoAlertaTurma';
import ListaoOperacoesBotoesAcao from './listaoOperacoesBotoesAcao';
import ListaoOperacoesFiltros from './listaoOperacoesFiltros';
import ListaoTabs from './listaoTabs/listaoTabs';
import { RotasDto } from '~/dtos';

const ListaoOperacoes = () => {
  const { exibirLoaderGeral, setPermissaoTela } = useContext(ListaoContext);

  const permissoes = useSelector(state => state.usuario.permissoes);
  const permissoesTela = permissoes[RotasDto.LISTAO_OPERACOES];

  useEffect(() => {
    if (permissoesTela) {
      setPermissaoTela(permissoesTela);
    }
  }, [permissoesTela, setPermissaoTela]);

  return (
    <>
      <ListaoAlertaTurma />
      <Cabecalho pagina="Operações" />
      <Card>
        <Col span={24}>
          <Loader loading={exibirLoaderGeral} ignorarTip>
            <ListaoOperacoesBotoesAcao />
            <ListaoOperacoesFiltros />
            <ListaoTabs />
          </Loader>
        </Col>
      </Card>
    </>
  );
};

export default ListaoOperacoes;
