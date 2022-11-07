import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors, Loader, SelectComponent } from '~/componentes';
import { RotasDto } from '~/dtos';
import {
  limparDadosParecer,
  setDadosAtribuicaoResponsavel,
  setParecerEmEdicao,
  setPlanoAEELimparDados,
} from '~/redux/modulos/planoAEE/actions';
import { erros, history, sucesso } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';

const SecaoParecerResponsavel = () => {
  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);
  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);
  const codigoTurma = planoAEEDados?.turma?.codigo;

  const dadosAtribuicaoResponsavel = useSelector(
    store => store.planoAEE.dadosAtribuicaoResponsavel
  );

  const responsavelInicialEdicao = dadosParecer?.responsavelRF
    ? {
        codigoRF: dadosParecer?.responsavelRF,
        nomeServidor: dadosParecer?.responsavelNome,
        nomeServidorFormatado: `${dadosParecer.responsavelNome} - ${dadosParecer.responsavelRF}`,
      }
    : undefined;

  const listaRespInicialEdicao =
    responsavelInicialEdicao?.codigoRF && responsavelInicialEdicao?.nomeServidor
      ? [responsavelInicialEdicao]
      : [];

  const [responsavelSelecionado, setResponsavelSelecionado] = useState(
    responsavelInicialEdicao
  );
  const [responsaveisPAAI, setResponsaveisPAAI] = useState(
    listaRespInicialEdicao
  );
  const [exibirLoader, setExibirLoader] = useState(false);
  const [emEdicao, setEmEdicao] = useState(false);

  const dispatch = useDispatch();

  const onChange = rf => {
    const funcionario = responsaveisPAAI?.find(r => r?.codigoRF === rf);

    if (funcionario?.codigoRF && funcionario?.nomeServidor) {
      const params = {
        codigoRF: funcionario?.codigoRF,
        nomeServidor: funcionario?.nomeServidor,
      };
      dispatch(setDadosAtribuicaoResponsavel(params));
      setResponsavelSelecionado(funcionario);
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
    setEmEdicao(true);
  };

  const onClickAtribuirResponsavel = async () => {
    const resposta = await ServicoPlanoAEE.atribuirResponsavel(
      responsavelSelecionado?.codigoRF
    ).catch(e => erros(e));

    if (resposta?.data) {
      history.push(RotasDto.RELATORIO_AEE_PLANO);
      sucesso('Atribuição do responsável realizada com sucesso');
    }
  };

  const onClickCancelar = () => {
    setResponsavelSelecionado(responsavelInicialEdicao);
    dispatch(setDadosAtribuicaoResponsavel({}));
    dispatch(setParecerEmEdicao(false));
    setEmEdicao(false);
  };

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
        setResponsavelSelecionado(listaResp[0]);
      }
      setResponsaveisPAAI(listaResp);
    }
  }, [codigoTurma]);

  useEffect(() => {
    if (codigoTurma && !responsavelInicialEdicao?.codigoRF)
      obterResponsaveisPAAI();
  }, [codigoTurma, responsavelInicialEdicao, obterResponsaveisPAAI]);

  const onClickRemover = async () => {
    setExibirLoader(true);
    const retorno = await ServicoPlanoAEE.removerReponsavelPAAI(
      planoAEEDados?.id
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.status === 200) {
      sucesso('Remoção do responsável realizada com sucesso');
      dispatch(limparDadosParecer());
      dispatch(setParecerEmEdicao(false));
      dispatch(setPlanoAEELimparDados());
      history.push(RotasDto.RELATORIO_AEE_PLANO);
    }
  };

  const desabilitarBtnRemover =
    !dadosParecer?.responsavelRF ||
    (dadosParecer?.responsavelRF &&
      dadosParecer?.responsavelRF !== responsavelSelecionado?.codigoRF);

  const desabilitarAtribuir =
    !!dadosParecer?.responsavelRF || !responsavelSelecionado?.codigoRF;

  return (
    <Loader loading={exibirLoader}>
      <div className="row">
        <div className="col-md-12">
          <SelectComponent
            placeholder="Pesquise por nome ou RF"
            label="PAAI responsável"
            valueOption="codigoRF"
            valueText="nomeServidorFormatado"
            lista={responsaveisPAAI}
            showSearch
            valueSelect={responsavelSelecionado?.codigoRF}
            onChange={onChange}
            allowClear={false}
            searchValue
            disabled={
              responsaveisPAAI?.length === 1 ||
              !dadosParecer?.podeAtribuirResponsavel
            }
          />
        </div>
      </div>
      <div className="col-12 d-flex justify-content-end pb-4 mt-2 pr-0">
        <Button
          id="btn-cancelar"
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="mr-3"
          onClick={onClickCancelar}
          disabled={!emEdicao}
        />
        <Button
          id="btn-atribuir"
          label="Atribuir responsável"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickAtribuirResponsavel}
          disabled={desabilitarAtribuir}
        />
        <Button
          id="btn-remover"
          label="Remover responsável"
          color={Colors.Roxo}
          border
          bold
          className="ml-3"
          onClick={onClickRemover}
          disabled={desabilitarBtnRemover}
        />
      </div>
    </Loader>
  );
};

export default SecaoParecerResponsavel;
