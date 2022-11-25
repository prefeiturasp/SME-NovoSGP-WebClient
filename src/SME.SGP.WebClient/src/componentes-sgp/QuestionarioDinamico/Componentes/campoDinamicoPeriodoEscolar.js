import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '~/componentes/loader';
import SelectComponent from '~/componentes/select';
import { erros } from '~/servicos';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoPeriodoEscolar = props => {
  const {
    questaoAtual,
    form,
    label,
    desabilitado,
    onChange,
    turmaId,
    questionarioId,
    prefixId,
  } = props;

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const [lista, setLista] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const dispatch = useDispatch();
  const obterBimestres = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoPeriodoEscolar.obterBimestresPorTurmaId(
      turmaId
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data) {
      setLista(retorno.data);
    } else {
      setLista([]);
    }
  }, [turmaId]);

  const habilitaEdicaoSeMudarBimestreAtual = (questao, bimestreAtual) => {
    if (
      questionarioId &&
      questao?.resposta[0]?.texto !== String(bimestreAtual)
    ) {
      dispatch(setQuestionarioDinamicoEmEdicao(true));
    } else {
      dispatch(setQuestionarioDinamicoEmEdicao(false));
    }
  };

  const obterBimestreAtual = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoPeriodoEscolar.obterBimestreAtualPorTurmaId(
      turmaId
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));
    if (retorno?.data) {
      habilitaEdicaoSeMudarBimestreAtual(questaoAtual, retorno.data.id);
      form.setFieldValue(String(questaoAtual.id), String(retorno.data.id));
    } else {
      form.setFieldValue(String(questaoAtual.id), '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId, form, questaoAtual]);

  useEffect(() => {
    if (turmaId) {
      obterBimestres();
      if (!desabilitado) {
        obterBimestreAtual();
      }
    } else {
      setLista([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId, obterBimestres, desabilitado]);

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      {label}
      <Loader loading={exibirLoader}>
        <SelectComponent
          id={id}
          form={form}
          lista={lista}
          valueOption="id"
          valueText="descricao"
          name={String(questaoAtual?.id)}
          disabled={desabilitado || questaoAtual?.somenteLeitura}
          onChange={valorAtualSelecionado => {
            onChange(valorAtualSelecionado);
          }}
        />
      </Loader>
    </ColunaDimensionavel>
  );
};

CampoDinamicoPeriodoEscolar.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
  turmaId: PropTypes.oneOfType([PropTypes.any]),
  questionarioId: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoPeriodoEscolar.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  prefixId: '',
  desabilitado: false,
  onChange: () => {},
  turmaId: null,
  questionarioId: null,
};

export default CampoDinamicoPeriodoEscolar;
