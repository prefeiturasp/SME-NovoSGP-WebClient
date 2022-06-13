import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors, Label } from '~/componentes';
import LocalizadorFuncionario from '~/componentes-sgp/LocalizadorFuncionario';
import { RotasDto } from '~/dtos';
import {
  setDadosAtribuicaoResponsavel,
  setParecerEmEdicao,
} from '~/redux/modulos/planoAEE/actions';
import { erros, history, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const SecaoParecerResponsavel = () => {
  const [limparCampos, setLimparCampos] = useState(false);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState();

  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);
  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);
  const dadosAtribuicaoResponsavel = useSelector(
    store => store.planoAEE.dadosAtribuicaoResponsavel
  );

  const dispatch = useDispatch();

  const onChangeLocalizador = funcionario => {
    setLimparCampos(false);
    if (funcionario?.codigoRF && funcionario?.nomeServidor) {
      const params = {
        codigoRF: funcionario?.codigoRF,
        nomeServidor: funcionario?.nomeServidor,
      };
      dispatch(setDadosAtribuicaoResponsavel(params));
      setResponsavelSelecionado(params);
      if (
        !dadosAtribuicaoResponsavel?.codigoRF &&
        !dadosParecer?.responsavelRF
      ) {
        dispatch(setParecerEmEdicao(true));
      }
    } else {
      dispatch(setDadosAtribuicaoResponsavel());
      setResponsavelSelecionado();
      dispatch(setParecerEmEdicao(true));
    }
  };

  const onClickAtribuirResponsavel = async () => {
    const resposta = await ServicoPlanoAEE.atribuirResponsavel().catch(e =>
      erros(e)
    );

    if (resposta?.data) {
      history.push(RotasDto.RELATORIO_AEE_PLANO);
      sucesso('Atribuição do responsável realizada com sucesso');
    }
  };

  const onClickCancelar = () => {
    dispatch(setDadosAtribuicaoResponsavel({}));
    dispatch(setParecerEmEdicao(false));
    setLimparCampos(true);
  };

  useEffect(() => {
    if (!dadosAtribuicaoResponsavel?.codigoRF) {
      setLimparCampos(true);
    }
  }, [dadosAtribuicaoResponsavel]);

  useEffect(() => {
    if (!dadosParecer?.codigoRF) {
      setResponsavelSelecionado({
        codigoRF: dadosParecer?.responsavelRF,
        nomeServidor: dadosParecer?.responsavelNome,
      });
    }
  }, [dadosParecer]);

  return (
    <>
      <Label text="PAAI responsável" className="mb-3" />
      <div className="row">
        <LocalizadorFuncionario
          id="funcionario"
          onChange={onChangeLocalizador}
          codigoTurma={planoAEEDados?.turma?.codigo}
          limparCampos={limparCampos}
          url="v1/encaminhamento-aee/responsavel/pesquisa"
          valorInicial={{
            codigoRF: responsavelSelecionado?.codigoRF,
            nome: responsavelSelecionado?.nomeServidor,
          }}
          desabilitado={!dadosParecer?.podeAtribuirResponsavel}
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
            !responsavelSelecionado?.codigoRF ||
            !dadosParecer?.podeAtribuirResponsavel
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
            !responsavelSelecionado?.codigoRF ||
            !dadosParecer?.podeAtribuirResponsavel
          }
        />
      </div>
    </>
  );
};

export default SecaoParecerResponsavel;
