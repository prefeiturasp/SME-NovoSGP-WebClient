import PropTypes from 'prop-types';
import { DataTable } from '~/componentes';
import Label from '~/componentes/label';
import { SGP_TABLE_AVALIACOES_EXTERNAS_PROVA_SP } from '~/constantes/ids/table';
import comDefaultProps from '~/utils/comDefaultProps';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';

const AvaliacoesExternasProvaSPBase = props => {
  const { label, questaoAtual, form } = props;

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length ? valoresFormulario : [];

  const colunas = [
    {
      title: 'Área de conhecimento',
      dataIndex: 'areaConhecimento',
    },
    {
      title: 'Proficiência',
      dataIndex: 'proficiencia',
    },
    {
      title: 'Nível',
      dataIndex: 'nivel',
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
          id={SGP_TABLE_AVALIACOES_EXTERNAS_PROVA_SP}
        />
      </div>
    </ColunaDimensionavel>
  );
};

AvaliacoesExternasProvaSPBase.propTypes = {
  label: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

AvaliacoesExternasProvaSPBase.defaultProps = {
  label: '',
  form: null,
  questaoAtual: null,
};

export const AvaliacoesExternasProvaSP = comDefaultProps(
  AvaliacoesExternasProvaSPBase,
  AvaliacoesExternasProvaSPBase.defaultProps
);
