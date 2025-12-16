import { Tabs, Table, Row, Col, Typography } from 'antd';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import './estilo.css';

function TabelaAvaliacoesBimestrais(props) {
  const { label, questaoAtual, form, onChange, disabled } = props;

  const mockQuestaoAtual = [
    {
      bimestre: '1',
      indicadores: [
        { componente: 'PORTUGUÊS', nota: 10, percentualFrequencia: 100 },
        { componente: 'MATEMÁTICA', nota: 10, percentualFrequencia: 100 },
      ],
    },
    {
      bimestre: '2',
      indicadores: [
        { componente: 'PORTUGUÊS', nota: 9, percentualFrequencia: 95 },
        { componente: 'MATEMÁTICA', nota: 8, percentualFrequencia: 90 },
      ],
    },
    {
      bimestre: '3',
      indicadores: [
        { componente: 'PORTUGUÊS', nota: 7, percentualFrequencia: 85 },
        { componente: 'MATEMÁTICA', nota: 6, percentualFrequencia: 80 },
      ],
    },
  ];

  const data = mockQuestaoAtual;

  const columns = [
    { title: 'Componentes', dataIndex: 'componente', key: 'componente' },
    { title: 'Notas', dataIndex: 'nota', key: 'nota' },
    {
      title: '% de frequência',
      dataIndex: 'percentualFrequencia',
      key: 'percentualFrequencia',
    },
  ];

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <div className="tabela-avaliacoes-container">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Typography.Title className="mb-3" level={4}>
              {label}
            </Typography.Title>
          </Col>
        </Row>

        <Tabs defaultActiveKey="1">
          {data.map(bimestre => (
            <Tabs.TabPane
              tab={`${bimestre.bimestre}° Bimestre`}
              key={bimestre.bimestre}
            >
              <Table
                dataSource={bimestre.indicadores}
                columns={columns}
                pagination={false}
                rowKey={record => record.componente}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </ColunaDimensionavel>
  );
}

export default TabelaAvaliacoesBimestrais;
