import DataTable from '~/componentes/table/dataTable';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import { Radio } from 'antd';

function TabelaContextoSocial(props) {
  const { label, questaoAtual, form, onChange, disabled } = props;

  const colunas = [
    {
      title: 'Raça',
      dataIndex: 'grupoEtnico',
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
    },
    {
      title: 'Responsável/familiar legal',
      dataIndex: 'responsavel',
    },
    {
      title: 'Responsáveis migrantes',
      dataIndex: 'responsavelEhImigrante',
      render: value => (
        <Radio.Group value={value}>
          <Radio value={true}>Sim</Radio>
          <Radio value={false}>Não</Radio>
        </Radio.Group>
      ),
    },
    {
      title: 'Estudante migrante',
      dataIndex: 'ehImigrante',
      render: value => (
        <Radio.Group value={value}>
          <Radio value={true}>Sim</Radio>
          <Radio value={false}>Não</Radio>
        </Radio.Group>
      ),
    },
  ];
  return (
    <div>
      <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
        <DataTable
          gerarIdUnico
          columns={colunas}
          pagination={false}
          dataSource={questaoAtual.resposta}
        />
      </ColunaDimensionavel>
    </div>
  );
}

export default TabelaContextoSocial;
