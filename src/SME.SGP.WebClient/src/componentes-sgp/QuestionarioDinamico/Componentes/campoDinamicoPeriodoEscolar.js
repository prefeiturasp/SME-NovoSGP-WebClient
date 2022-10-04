import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '~/componentes/loader';
import SelectComponent from '~/componentes/select';
import { erros } from '~/servicos';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';

const CampoDinamicoPeriodoEscolar = props => {
  const { questaoAtual, form, label, desabilitado, onChange, turmaId } = props;

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
    if (questao?.resposta[0]?.texto !== String(bimestreAtual)) {
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
    }
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
  }, [turmaId, obterBimestres, desabilitado]);

  return (
    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-3">
      {label}
      <Loader loading={exibirLoader}>
        <SelectComponent
          id={String(questaoAtual.id)}
          name={String(questaoAtual.id)}
          form={form}
          lista={lista}
          valueOption="id"
          valueText="descricao"
          disabled={desabilitado || questaoAtual.somenteLeitura}
          onChange={valorAtualSelecionado => {
            onChange(valorAtualSelecionado);
          }}
        />
      </Loader>
    </div>
  );
};

CampoDinamicoPeriodoEscolar.propTypes = {
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
  form: PropTypes.oneOfType([PropTypes.any]),
  label: PropTypes.oneOfType([PropTypes.any]),
  desabilitado: PropTypes.bool,
  onChange: PropTypes.oneOfType([PropTypes.any]),
  turmaId: PropTypes.oneOfType([PropTypes.any]),
};

CampoDinamicoPeriodoEscolar.defaultProps = {
  questaoAtual: null,
  form: null,
  label: '',
  desabilitado: false,
  onChange: () => {},
  turmaId: null,
};

export default CampoDinamicoPeriodoEscolar;
