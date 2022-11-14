import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import {
  setDadosCollapseAtribuicaoResponsavel,
  setLimparDadosAtribuicaoResponsavel,
} from '~/redux/modulos/collapseAtribuicaoResponsavel/actions';
import SelectComponent from '~/componentes/select';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import {
  SGP_BUTTON_ATRIBUICAO_RESPONSAVEL,
  SGP_BUTTON_CANCELAR_ATRIBUICAO_RESPONSAVEL,
  SGP_BUTTON_REMOVER_RESPONSAVEL,
} from '~/constantes/ids/button';
import { SGP_SELECT_PAAIS_DRE } from '~/constantes/ids/select';

const CollapseAtribuicaoResponsavelDados = props => {
  const {
    validarAntesAtribuirResponsavel,
    changeLocalizadorResponsavel,
    clickCancelar,
    clickRemoverResponsavel,
  } = props;
  const dispatch = useDispatch();

  const dadosCollapseAtribuicaoResponsavel = useSelector(
    store =>
      store.collapseAtribuicaoResponsavel.dadosCollapseAtribuicaoResponsavel
  );

  const dadosEncaminhamento = useSelector(
    store => store.encaminhamentoAEE.dadosEncaminhamento
  );
  const [
    funcionarioLocalizadorSelecionado,
    setFuncionarioLocalizadorSelecionado,
  ] = useState();

  const [responsaveisPAAI, setResponsaveisPAAI] = useState([]);

  const obterResponsaveisPAAI = async () => {
    const resposta = await ServicoEncaminhamentoAEE.obterResponsavelEncaminhamentoPAAI(
      dadosEncaminhamento.turma.codigoUE
    );
    const newRes = { ...resposta };

    for (let el = 0; el < resposta.data.length; el++) {
      const newNomeServidor = `${newRes.data[el].nomeServidor} - ${newRes.data[el].codigoRF}`;

      newRes.data[el].nomeServidor = newNomeServidor;
    }

    if (newRes.data.length === 1) {
      setFuncionarioLocalizadorSelecionado(newRes.data[0]);
    }

    setResponsaveisPAAI(newRes.data);
  };

  useEffect(() => {
    obterResponsaveisPAAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeLocalizador = (codigoResponsavelRF, obj) => {
    const { title } = obj.props;
    if (codigoResponsavelRF && title) {
      setFuncionarioLocalizadorSelecionado({
        codigoRF: codigoResponsavelRF,
        nomeServidor: title,
      });
    } else {
      setFuncionarioLocalizadorSelecionado();
      dispatch(setLimparDadosAtribuicaoResponsavel());
      changeLocalizadorResponsavel(codigoResponsavelRF);
    }
  };

  const onClickAtribuirResponsavel = async () => {
    const params = {
      codigoRF: funcionarioLocalizadorSelecionado.codigoRF,
      nomeServidor: funcionarioLocalizadorSelecionado.nomeServidor,
    };
    let continuar = true;
    if (validarAntesAtribuirResponsavel) {
      continuar = await validarAntesAtribuirResponsavel(params);
    }

    if (continuar) {
      dispatch(setDadosCollapseAtribuicaoResponsavel(params));
    }
  };

  const onClickCancelar = () => {
    setFuncionarioLocalizadorSelecionado();
    dispatch(setLimparDadosAtribuicaoResponsavel());
    clickCancelar();
  };

  const onClickRemover = () => {
    if (clickRemoverResponsavel) {
      clickRemoverResponsavel(funcionarioLocalizadorSelecionado);
    }
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-2">
        <SelectComponent
          id={SGP_SELECT_PAAIS_DRE}
          label="PAAIS DRE"
          valueOption="codigoRF"
          valueText="nomeServidor"
          lista={responsaveisPAAI}
          showSearch
          valueSelect={funcionarioLocalizadorSelecionado?.codigoRF}
          className
          onChange={onChangeLocalizador}
          allowClear={false}
          searchValue
        />
      </div>
      <div className="col-md-12 d-flex justify-content-end pb-4 mt-2">
        <Button
          id={SGP_BUTTON_CANCELAR_ATRIBUICAO_RESPONSAVEL}
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="mr-3"
          onClick={onClickCancelar}
          disabled={
            !!dadosCollapseAtribuicaoResponsavel?.codigoRF ||
            !funcionarioLocalizadorSelecionado?.codigoRF
          }
        />
        <Button
          id={SGP_BUTTON_ATRIBUICAO_RESPONSAVEL}
          label="Atribuir responsável"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickAtribuirResponsavel}
          disabled={
            !!dadosCollapseAtribuicaoResponsavel?.codigoRF ||
            !funcionarioLocalizadorSelecionado?.codigoRF
          }
        />
        <Button
          id={SGP_BUTTON_REMOVER_RESPONSAVEL}
          label="Remover responsável"
          color={Colors.Roxo}
          border
          bold
          className="ml-3"
          onClick={onClickRemover}
          disabled={!dadosCollapseAtribuicaoResponsavel?.codigoRF}
        />
      </div>
    </div>
  );
};

CollapseAtribuicaoResponsavelDados.propTypes = {
  validarAntesAtribuirResponsavel: PropTypes.func,
  changeLocalizadorResponsavel: PropTypes.func,
  clickCancelar: PropTypes.func,
  clickRemoverResponsavel: PropTypes.func,
};

CollapseAtribuicaoResponsavelDados.defaultProps = {
  validarAntesAtribuirResponsavel: null,
  changeLocalizadorResponsavel: () => {},
  clickCancelar: () => {},
  clickRemoverResponsavel: null,
};

export default CollapseAtribuicaoResponsavelDados;
