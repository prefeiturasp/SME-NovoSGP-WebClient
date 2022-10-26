import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import {
  setDadosCollapseAtribuicaoResponsavel,
  setLimparDadosAtribuicaoResponsavel,
} from '~/redux/modulos/collapseAtribuicaoResponsavel/actions';
import SelectComponent from '~/componentes/select';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

const CollapseAtribuicaoResponsavelDados = props => {
  const {
    validarAntesAtribuirResponsavel,
    changeLocalizadorResponsavel,
    clickCancelar,
    clickRemoverResponsavel,
    codigoTurma,
  } = props;
  const dispatch = useDispatch();

  const dadosCollapseAtribuicaoResponsavel = useSelector(
    store =>
      store.collapseAtribuicaoResponsavel.dadosCollapseAtribuicaoResponsavel
  );

  const responsavelInicialEdicao = dadosCollapseAtribuicaoResponsavel?.codigoRF
    ? {
        codigoRF: dadosCollapseAtribuicaoResponsavel?.codigoRF,
        nomeServidor: dadosCollapseAtribuicaoResponsavel?.nomeServidor,
        nomeServidorFormatado: `${dadosCollapseAtribuicaoResponsavel.nomeServidor} - ${dadosCollapseAtribuicaoResponsavel.codigoRF}`,
      }
    : undefined;

  const listaRespInicialEdicao =
    responsavelInicialEdicao?.codigoRF && responsavelInicialEdicao?.nomeServidor
      ? [responsavelInicialEdicao]
      : [];

  const [
    funcionarioLocalizadorSelecionado,
    setFuncionarioLocalizadorSelecionado,
  ] = useState(responsavelInicialEdicao);

  const [responsaveisPAAI, setResponsaveisPAAI] = useState(
    listaRespInicialEdicao
  );

  const obterResponsaveisPAAI = useCallback(async () => {
    const resposta = await ServicoEncaminhamentoAEE.obterResponsaveveisEncaminhamentoPAAI(
      codigoTurma
    );

    const dados = resposta?.data?.items;
    if (dados?.length) {
      const listaResp = dados.map(item => {
        return {
          ...item,
          codigoRF: item.codigoRf,
          nomeServidorFormatado: `${item.nomeServidor} - ${item.codigoRf}`,
        };
      });
      if (listaResp?.length === 1) {
        setFuncionarioLocalizadorSelecionado(listaResp[0]);
      }
      setResponsaveisPAAI(listaResp);
    }
  }, [codigoTurma]);

  useEffect(() => {
    if (codigoTurma && !responsavelInicialEdicao?.codigoRF)
      obterResponsaveisPAAI();
  }, [codigoTurma, responsavelInicialEdicao, obterResponsaveisPAAI]);

  const onChange = rf => {
    const itemSelecionado = responsaveisPAAI?.find(r => r?.codigoRF === rf);

    if (itemSelecionado) {
      setFuncionarioLocalizadorSelecionado(itemSelecionado);
    } else {
      setFuncionarioLocalizadorSelecionado();
      dispatch(setLimparDadosAtribuicaoResponsavel());
      changeLocalizadorResponsavel(rf);
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

  const desabilitarBtnAtribuirCancelar =
    !!dadosCollapseAtribuicaoResponsavel?.codigoRF ||
    !funcionarioLocalizadorSelecionado?.codigoRF;

  return (
    <div className="row">
      <div className="col-md-12 mb-2">
        <SelectComponent
          placeholder="Pesquise por nome ou RF"
          label="PAAI responsável"
          valueOption="codigoRF"
          valueText="nomeServidorFormatado"
          lista={responsaveisPAAI}
          showSearch
          valueSelect={funcionarioLocalizadorSelecionado?.codigoRF}
          className
          onChange={onChange}
          allowClear={false}
          searchValue
          disabled={responsaveisPAAI?.length === 1}
        />
      </div>
      <div className="col-md-12 d-flex justify-content-end pb-4 mt-2">
        <Button
          id="btn-cancelar"
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="mr-3"
          onClick={onClickCancelar}
          disabled={desabilitarBtnAtribuirCancelar}
        />
        <Button
          id="btn-atribuir"
          label="Atribuir responsável"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickAtribuirResponsavel}
          disabled={desabilitarBtnAtribuirCancelar}
        />
        <Button
          id="btn-remover"
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
  codigoTurma: PropTypes.string,
  clickRemoverResponsavel: PropTypes.func,
};

CollapseAtribuicaoResponsavelDados.defaultProps = {
  validarAntesAtribuirResponsavel: null,
  changeLocalizadorResponsavel: () => {},
  clickCancelar: () => {},
  codigoTurma: '',
  clickRemoverResponsavel: null,
};

export default CollapseAtribuicaoResponsavelDados;
