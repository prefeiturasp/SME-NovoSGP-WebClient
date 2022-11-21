import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { CampoTexto } from '~/componentes';
import {
  SGP_INPUT_NOME_ATIVIDADE,
  SGP_INPUT_NOME_ESTUDANTE,
} from '~/constantes/ids/input';

const CompensacaoAusenciaListaCamposDebounce = props => {
  const {
    disciplinaIdSelecionada,
    setNomeAtividade,
    setNomeAluno,
    nomeAtividade,
    nomeAluno,
  } = props;

  const [nomeAtividadeExibicao, setNomeAtividadeExibicao] = useState('');
  const [nomeAlunoExibicao, setNomeAlunoExibicao] = useState('');
  const [timeoutNomeAtividadeAluno, setTimeoutNomeAtividadeAluno] = useState();

  useEffect(() => {
    setNomeAtividadeExibicao(nomeAtividade);
    setNomeAlunoExibicao(nomeAluno);
  }, [nomeAtividade, nomeAluno]);

  const validarFiltroDebounce = useCallback(
    (texto, onChangeFiltros) => {
      if (timeoutNomeAtividadeAluno) {
        clearTimeout(timeoutNomeAtividadeAluno);
      }
      const timeout = setTimeout(() => {
        onChangeFiltros(texto);
      }, 700);

      setTimeoutNomeAtividadeAluno(timeout);
    },
    [timeoutNomeAtividadeAluno]
  );

  const onChange = (text, setValue) => {
    if (text?.length > 3 || !text) {
      validarFiltroDebounce(text, setValue);
    }
  };

  const onChangeNomeAtividade = e => {
    setNomeAtividadeExibicao(e.target.value);
    onChange(e.target.value, setNomeAtividade);
  };

  const onChangeNomeAluno = e => {
    setNomeAlunoExibicao(e.target.value);
    onChange(e.target.value, setNomeAluno);
  };

  const onBlur = useCallback(
    (text, setValue) => {
      if (timeoutNomeAtividadeAluno) {
        clearTimeout(timeoutNomeAtividadeAluno);
      }

      if (text?.length > 3 || !text) {
        setValue(text);
      }
    },
    [timeoutNomeAtividadeAluno]
  );

  return (
    <>
      <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
        <CampoTexto
          id={SGP_INPUT_NOME_ATIVIDADE}
          placeholder="Nome da Atividade"
          iconeBusca
          allowClear
          onChange={onChangeNomeAtividade}
          onBlur={e => onBlur(e.target.value, setNomeAtividade)}
          value={nomeAtividadeExibicao}
          desabilitado={!disciplinaIdSelecionada}
        />
      </div>
      <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
        <CampoTexto
          id={SGP_INPUT_NOME_ESTUDANTE}
          placeholder="Nome do Estudante"
          iconeBusca
          allowClear
          onChange={onChangeNomeAluno}
          onBlur={e => onBlur(e.target.value, setNomeAluno)}
          value={nomeAlunoExibicao}
          desabilitado={!disciplinaIdSelecionada}
        />
      </div>
    </>
  );
};

CompensacaoAusenciaListaCamposDebounce.propTypes = {
  disciplinaIdSelecionada: PropTypes.oneOfType([PropTypes.any]),
  setNomeAtividade: PropTypes.func,
  setNomeAluno: PropTypes.func,
  nomeAluno: PropTypes.string,
  nomeAtividade: PropTypes.string,
};

CompensacaoAusenciaListaCamposDebounce.defaultProps = {
  disciplinaIdSelecionada: null,
  setNomeAtividade: () => {},
  setNomeAluno: () => {},
  nomeAtividade: '',
  nomeAluno: '',
};

export default CompensacaoAusenciaListaCamposDebounce;
