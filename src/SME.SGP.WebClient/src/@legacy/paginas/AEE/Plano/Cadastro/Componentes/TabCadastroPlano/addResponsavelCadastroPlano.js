import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import { erros, sucesso } from '~/servicos';
import LocalizadorFuncionario from '~/componentes-sgp/LocalizadorFuncionario';
import {
  setDadosAtribuicaoResponsavel,
  setPlanoAEEDados,
} from '~/redux/modulos/planoAEE/actions';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import {
  SGP_BUTTON_ATRIBUICAO_RESPONSAVEL,
  SGP_BUTTON_CANCELAR_ATRIBUICAO_RESPONSAVEL,
} from '~/constantes/ids/button';

const AddResponsavelCadastroPlano = () => {
  const paramsRota = useParams();

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
      if (!desabilitarCamposPlanoAEE) setResponsavelSelecionado(params);
    } else {
      dispatch(setDadosAtribuicaoResponsavel());
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
          desabilitado={desabilitarCamposPlanoAEE || !paramsRota?.id}
          onChange={onChangeLocalizador}
          codigoTurma={dadosCollapseLocalizarEstudante?.codigoTurma}
          limparCampos={limparCampos}
          url="v1/encaminhamento-aee/responsavel-plano/pesquisa"
          valorInicial={{
            codigoRF: responsavelSelecionado?.codigoRF,
            nomeServidor: responsavelSelecionado?.nomeServidor,
          }}
        />
      </div>
      <div className="col-12 d-flex justify-content-end pb-4 mt-2 pr-0">
        <Button
          id={SGP_BUTTON_CANCELAR_ATRIBUICAO_RESPONSAVEL}
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
          id={SGP_BUTTON_ATRIBUICAO_RESPONSAVEL}
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

export default AddResponsavelCadastroPlano;
