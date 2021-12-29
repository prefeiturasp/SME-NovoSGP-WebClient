import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '~/componentes';
import Button from '~/componentes/button';
import { setModoEdicaoFechamentoBimestre } from '~/redux/modulos/fechamentoBimestre/actions';

const BtnAcoesFechamentoBimestre = props => {
  const dispatch = useDispatch();

  const {
    salvarFechamentoFinal,
    onClickVoltar,
    onClickCancelar,
    somenteConsulta,
    ehSintese,
  } = props;

  const emEdicao = useSelector(
    store => store.fechamentoBimestre.modoEdicaoFechamentoBimestre?.emEdicao
  );

  useEffect(() => {
    return () => {
      dispatch(setModoEdicaoFechamentoBimestre({ emEdicao: false }));
    };
  }, [dispatch]);

  return (
    <div className="col-md-12">
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end pb-4">
          <Button
            id="btn-volta-fechamento-bimestre"
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickVoltar}
          />
          <Button
            id="btn-cancelar-fechamento-bimestre"
            label="Cancelar"
            color={Colors.Roxo}
            border
            className="mr-2"
            onClick={onClickCancelar}
            disabled={!emEdicao || somenteConsulta}
            hidden={ehSintese}
          />
          <Button
            id="btn-salvar-fechamento-bimestre"
            label="Salvar"
            color={Colors.Roxo}
            border
            bold
            className="mr-2"
            onClick={salvarFechamentoFinal}
            disabled={!emEdicao || somenteConsulta}
            hidden={ehSintese}
          />
        </div>
      </div>
    </div>
  );
};

BtnAcoesFechamentoBimestre.defaultProps = {
  salvarFechamentoFinal: PropTypes.func,
  onClickVoltar: PropTypes.func,
  onClickCancelar: PropTypes.func,
  somenteConsulta: PropTypes.bool,
  ehSintese: PropTypes.bool,
};

BtnAcoesFechamentoBimestre.propTypes = {
  salvarFechamentoFinal: () => {},
  onClickVoltar: () => {},
  onClickCancelar: () => {},
  somenteConsulta: false,
  ehSintese: true,
};

export default BtnAcoesFechamentoBimestre;
