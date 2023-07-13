import PropTypes from 'prop-types';
import { DataTable } from '~/componentes';
import Label from '~/componentes/label';
import { SGP_TABLE_FREQUENCIA_TURMA_PAP } from '~/constantes/ids/table';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';

const TabelaFrequenciaTurmaPAP = props => {
  const { label, questaoAtual, form } = props;

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length ? valoresFormulario : [];

  // TODO Trocar DTO e alterar os dataIndex
  const colunas = [
    {
      title: 'Qtd. de Aulas',
      dataIndex: 'qtdAulas',
    },
    {
      title: 'Qtd. de Presença/Remoto',
      dataIndex: 'qtdPresencaRemoto',
    },
    {
      title: 'Qtd. de Ausências',
      dataIndex: 'qtdAusencias',
    },
    {
      title: 'Qtd. de Compensações',
      dataIndex: 'qtdCompensacoes',
    },
    {
      title: 'Percentual de Frequência',
      dataIndex: 'percentualFrequencia',
    },
  ];

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <Label text={label} />

      <div>
        <DataTable
          gerarIdUnico
          columns={colunas}
          pagination={false}
          dataSource={dadosTabela}
          id={SGP_TABLE_FREQUENCIA_TURMA_PAP}
        />
      </div>
    </ColunaDimensionavel>
  );
};

TabelaFrequenciaTurmaPAP.propTypes = {
  label: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

TabelaFrequenciaTurmaPAP.defaultProps = {
  label: '',
  form: null,
  questaoAtual: null,
};

export default TabelaFrequenciaTurmaPAP;
