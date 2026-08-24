import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpandirLinha } from '~/redux/modulos/notasConceitos/actions';
import comDefaultProps from '~/utils/comDefaultProps';

import { IconePlusMarcadores } from './avaliacao.css';

const ColunaNotaFinalRegencia = props => {
  const dispatch = useDispatch();

  const expandirLinha = useSelector(
    store => store.notasConceitos.expandirLinha
  );

  const { indexLinha } = props;

  const onClickExpandir = index => {
    let novaLinha = [];
    if (expandirLinha[index]) {
      expandirLinha[index] = false;
      novaLinha = expandirLinha;
    } else {
      novaLinha[index] = true;
    }

    dispatch(setExpandirLinha([...novaLinha]));
  };

  return (
    <IconePlusMarcadores
      onClick={() => onClickExpandir(indexLinha)}
      className={
        expandirLinha[indexLinha]
          ? 'fas fa-minus-circle '
          : 'fas fa-plus-circle'
      }
    />
  );
};

ColunaNotaFinalRegencia.propTypes = {
  indexLinha: PropTypes.number,
};

export default comDefaultProps(ColunaNotaFinalRegencia, {
  indexLinha: null,
});
