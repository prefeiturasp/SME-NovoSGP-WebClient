/* eslint-disable react/prop-types */
import { Col, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, ListaPaginada } from '~/componentes';
import { SGP_TABLE_REGISTRO_ACOES } from '~/constantes/ids/table';
import { DrawerBuscaAtivaRegistroAcoesForm } from './drawer-registro-acoes';

const colunas = [
  {
    title: 'Data',
    dataIndex: 'dataRegistro',
    render: data => (data ? window.moment(data).format('DD/MM/YYYY') : ''),
  },
  {
    title: 'Turma',
    dataIndex: 'turma',
  },
  {
    title: 'Conseguiu contato com o responsável',
    dataIndex: 'conseguiuContatoResponsavel',
  },
  {
    title: 'Procedimento realizado',
    dataIndex: 'procedimentoRealizado',
  },
  {
    title: 'Usuário',
    dataIndex: 'usuario',
  },
];

export const MontarDadosTabBuscaAtiva = () => {
  const { aluno } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const [registroAcaoId, setRegistroAcaoId] = useState(0);
  const [mostrarDrawer, setMostrarDrawer] = useState(false);

  const codigoAluno = aluno?.codigoAluno;

  const abrirDrawer = () => {
    setMostrarDrawer(true);
  };

  useEffect(() => {
    if (registroAcaoId) {
      abrirDrawer();
    }
  }, [registroAcaoId]);

  const onCloseDrawer = () => {
    setMostrarDrawer(false);
    setRegistroAcaoId(0);
  };

  const onClickLinha = linha => {
    setRegistroAcaoId(linha?.id);
  };

  return (
    <Card padding="20px 20px">
      {mostrarDrawer && registroAcaoId && (
        <DrawerBuscaAtivaRegistroAcoesForm
          mostrarDrawer={mostrarDrawer}
          onCloseDrawer={onCloseDrawer}
          registroAcaoId={registroAcaoId}
        />
      )}
      <Col xs={24}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Typography.Title level={5}>Registro de Ações</Typography.Title>
          </Col>
          <Col xs={24}>
            <ListaPaginada
              colunas={colunas}
              id={SGP_TABLE_REGISTRO_ACOES}
              onClick={linha => onClickLinha(linha)}
              url={`v1/encaminhamento-naapa/aluno/${codigoAluno}/registros-acao`}
            />
          </Col>
        </Row>
      </Col>
    </Card>
  );
};
