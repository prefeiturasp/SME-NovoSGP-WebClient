import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { RadioGroupButton } from '~/componentes';
import Label from '~/componentes/label';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const ContainerRadioGroupButton = styled.div`
  .ant-radio-group {
    display: flex;

    .ant-radio-wrapper {
      display: flex;
      align-items: center;
    }
  }

  label {
    margin-bottom: 0;
  }
`;

const CampoDinamicoRadio = props => {
  const { questaoAtual, form, label, desabilitado, onChange, prefixId } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const opcoes = questaoAtual?.opcaoResposta.map(item => {
    return {
      label: (
        <Label withDiv text={item.nome} observacaoText={item.observacao} />
      ),
      value: item.id,
    };
  });

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <ContainerRadioGroupButton>
        {label}
        <RadioGroupButton
          id={id}
          form={form}
          opcoes={opcoes}
          className="mt-2"
          name={String(questaoAtual?.id)}
          desabilitado={desabilitado || questaoAtual?.somenteLeitura}
          onChange={e => {
            const valorAtualSelecionado = e.target.value;
            onChange(valorAtualSelecionado);
          }}
        />
      </ContainerRadioGroupButton>
    </ColunaDimensionavel>
  );
};

CampoDinamicoRadio.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoRadio.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
};

export default CampoDinamicoRadio;
