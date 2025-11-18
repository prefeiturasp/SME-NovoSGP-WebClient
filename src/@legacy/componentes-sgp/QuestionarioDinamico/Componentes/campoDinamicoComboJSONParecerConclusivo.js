import conselhoClasseService from '@/core/services/conselho-classe-service';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loader from '~/componentes/loader';
import { CampoDinamicoComboJSON } from './campoDinamicoComboJSON';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';
import SelectComponent from '~/componentes/select';

export const CampoDinamicoComboJSONParecerConclusivo = props => {
  const {
    questaoAtual,
    form,
    label,
    desabilitado,
    onChange,
    prefixId,
    turmaId,
  } = props;

  const [loading, setLoading] = useState(false);
  const [lista, setLista] = useState([]);

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const valoresFormulario = questaoAtual?.resposta?.[0]?.texto;

  const obterDados = async () => {
    setLoading(true);
    const resposta = await conselhoClasseService.obterPareceresConclusivosTurma(
      turmaId,
      true
    );

    if (resposta?.sucesso && resposta.dados?.length) {
      const newList = resposta.dados.map(item => ({
        value: item?.id,
        label: item?.nome,
      }));
      setLista(newList);
    } else {
      setLista([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!valoresFormulario) {
      obterDados();
    }
  }, [valoresFormulario]);

  if (valoresFormulario) return <CampoDinamicoComboJSON {...props} />;

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <Loader loading={loading}>
        {label}
        <SelectComponent
          id={id}
          form={form}
          labelInValue
          lista={lista}
          valueText="label"
          valueOption="value"
          name={String(questaoAtual.id)}
          placeholder={questaoAtual?.placeHolder}
          disabled={desabilitado || questaoAtual.somenteLeitura}
          onChange={valorAtualSelecionado => {
            onChange(valorAtualSelecionado);
          }}
        />
      </Loader>
    </ColunaDimensionavel>
  );
};

CampoDinamicoComboJSONParecerConclusivo.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoComboJSONParecerConclusivo.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};
