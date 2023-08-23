import PropTypes from 'prop-types';
import { DataTable } from '~/componentes';
import Label from '~/componentes/label';
import { SGP_TABLE_FREQUENCIA_TURMA_PAP } from '~/constantes/ids/table';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import { formatarFrequencia } from '@/@legacy/utils';

const TabelaFrequenciaTurmaPAP = props => {
  const { label, questaoAtual, form } = props;

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = [valoresFormulario];

  const colunas = [
    {
      title: 'Qtd. de Aulas',
      dataIndex: 'TotalAulas',
      align: 'center',
    },
    {
      title: 'Qtd. de Presença/Remoto',
      dataIndex: 'TotalPresencaRemoto',
      align: 'center',
    },
    {
      title: 'Qtd. de Ausências',
      dataIndex: 'TotalAusencias',
      align: 'center',
    },
    {
      title: 'Qtd. de Compensações',
      dataIndex: 'TotalCompensacoes',
      align: 'center',
    },
    {
      title: 'Percentual de Frequência',
      align: 'center',
      dataIndex: 'PercentualFrequenciaFormatado',
      render: percentualFrequenciaFormatado =>
        formatarFrequencia(percentualFrequenciaFormatado),
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
