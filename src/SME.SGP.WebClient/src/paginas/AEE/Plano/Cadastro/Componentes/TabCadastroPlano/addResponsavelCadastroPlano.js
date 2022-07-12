import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import { erros, sucesso } from '~/servicos';

import LocalizadorFuncionario from '~/componentes-sgp/LocalizadorFuncionario';
import {
  setDadosAtribuicaoResponsavel,
  setPlanoAEEDados,
} from '~/redux/modulos/planoAEE/actions';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const AddResponsavelCadastroPlano = props => {
  const { dasativaCampoRf } = props;

  const [limparCampos, setLimparCampos] = useState(false);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState();
  const [responsavelAlterado, setResponsavelAlterado] = useState(false);

  const dispatch = useDispatch();

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  const typePlanoAEECadastro = useSelector(
    store => store.planoAEE.typePlanoAEECadastro
  );

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  useEffect(() => {
    if (planoAEEDados?.responsavel) {
      setResponsavelSelecionado({
        codigoRF: planoAEEDados?.responsavel?.responsavelRF,
        nomeServidor: planoAEEDados?.responsavel?.responsavelNome,
      });
    }
  }, [planoAEEDados]);

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const onChangeLocalizador = (funcionario, isOnChangeManual) => {
    setLimparCampos(false);
    if (funcionario?.codigoRF && funcionario?.nomeServidor) {
      const params = {
        codigoRF: funcionario?.codigoRF,
        nomeServidor: funcionario?.nomeServidor,
      };
      dispatch(setDadosAtribuicaoResponsavel(params));
      if (!desabilitarCamposPlanoAEE)
        dispatch(setQuestionarioDinamicoEmEdicao(true));
      setResponsavelSelecionado(params);
    } else {
      dispatch(setDadosAtribuicaoResponsavel());
      dispatch(setQuestionarioDinamicoEmEdicao(false));
      setResponsavelSelecionado();
    }

    if (!desabilitarCamposPlanoAEE) setResponsavelAlterado(!!isOnChangeManual);
  };

  const onClickAtribuirResponsavel = async () => {
    const resposta = await ServicoPlanoAEE.atribuirResponsavelPlano().catch(e =>
      erros(e)
    );
    if (resposta?.data) {
      sucesso('Atribuição do responsável realizada com sucesso');
      planoAEEDados.responsavel = {
        ...planoAEEDados.responsavel,
        responsavelRF: responsavelSelecionado?.codigoRF,
        responsavelNome: responsavelSelecionado?.nomeServidor,
      };
      dispatch(setPlanoAEEDados(planoAEEDados));
      setResponsavelAlterado(false);
    }
  };

  const onClickCancelar = () => {
    setLimparCampos(true);
    dispatch(setDadosAtribuicaoResponsavel({}));
    setResponsavelAlterado(false);
    setTimeout(() => {
      if (planoAEEDados?.responsavel) {
        setResponsavelSelecionado({
          codigoRF: planoAEEDados?.responsavel?.responsavelRF,
          nomeServidor: planoAEEDados?.responsavel?.responsavelNome,
        });
      }
    }, 500);
  };

  return (
    <>
      <p>Atribuir responsável:</p>
      <div className="row mb-4">
        <LocalizadorFuncionario
          desabilitado={desabilitarCamposPlanoAEE}
          id="funcionarioResponsavel"
          dasativaCampoRf={!!dasativaCampoRf}
          onChange={onChangeLocalizador}
          codigoTurma={dadosCollapseLocalizarEstudante?.codigoTurma}
          limparCampos={limparCampos}
          url="v1/encaminhamento-aee/responsavel-plano/pesquisa"
          valorInicial={{
            codigoRF: responsavelSelecionado?.codigoRF,
            nome: responsavelSelecionado?.nomeServidor,
          }}
        />
      </div>
      <div className="col-12 d-flex justify-content-end pb-4 mt-2 pr-0">
        <Button
          id="btn-cancelar"
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="mr-3"
          onClick={onClickCancelar}
          disabled={
            desabilitarCamposPlanoAEE ||
            !responsavelAlterado ||
            typePlanoAEECadastro
          }
        />
        <Button
          id="btn-atribuir"
          label="Atribuir responsável"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickAtribuirResponsavel}
          disabled={
            desabilitarCamposPlanoAEE ||
            !responsavelAlterado ||
            (responsavelAlterado && !responsavelSelecionado?.codigoRF) ||
            !responsavelSelecionado?.codigoRF ||
            typePlanoAEECadastro
          }
        />
      </div>
    </>
  );
};

AddResponsavelCadastroPlano.propTypes = {
  dasativaCampoRf: PropTypes.bool,
};

AddResponsavelCadastroPlano.defaultProps = {
  dasativaCampoRf: false,
};

export default AddResponsavelCadastroPlano;
