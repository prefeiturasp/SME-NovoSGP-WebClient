import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '~/componentes';
import {
  setParecerCoordenacao,
  setParecerEmEdicao,
} from '~/redux/modulos/planoAEE/actions';

const SecaoParecerCoordenacao = ({ desabilitar }) => {
  const parecerCoordenacao = useSelector(
    store => store.planoAEE.parecerCoordenacao
  );
  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);

  const dispatch = useDispatch();

  const mudarDescricaoCordenacao = texto => {
    dispatch(setParecerEmEdicao(true));
    dispatch(setParecerCoordenacao(texto));
  };

  return (
    <div className="mb-3">
      <Editor
        label="Parecer da coordenação"
        onChange={mudarDescricaoCordenacao}
        inicial={dadosParecer?.parecerCoordenacao || parecerCoordenacao || ''}
        desabilitar={desabilitar}
        removerToolbar={desabilitar}
      />
    </div>
  );
};

SecaoParecerCoordenacao.defaultProps = {
  desabilitar: false,
};

SecaoParecerCoordenacao.propTypes = {
  desabilitar: PropTypes.bool,
};

export default SecaoParecerCoordenacao;
