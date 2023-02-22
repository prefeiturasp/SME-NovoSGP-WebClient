import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardCollapse } from '~/componentes';
import { RotasDto, situacaoPlanoAEE } from '~/dtos';
import {
  setAtualizarDados,
  setDadosParecer,
  setExibirLoaderPlanoAEE,
} from '~/redux/modulos/planoAEE/actions';
import { erros, verificaSomenteConsulta } from '~/servicos';
import { Base } from '~/componentes/colors';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import SecaoParecerPAAI from '../SecaoParecerPAAI/secaoParecerPAAI';
import SecaoParecerResponsavel from '../SecaoParecerResponsavel/secaoParecerResponsavel';
import SecaoParecerCoordenacao from '../SecaoParecerCoordenacao/secaoParecerCoordenacao';
import { SGP_COLLAPSE_PARECER_PLANO_AEE } from '~/constantes/ids/collapse';

const SecaoParecerPlanoCollapse = ({ match }) => {
  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);
  const dadosParecer = useSelector(store => store.planoAEE.dadosParecer);
  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.RELATORIO_AEE_PLANO];
  const atualizarDados = useSelector(store => store.planoAEE.atualizarDados);

  const dispatch = useDispatch();

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  const obterParecer = useCallback(async () => {
    dispatch(setExibirLoaderPlanoAEE(true));
    const resultado = await ServicoPlanoAEE.obterParecer(match?.params?.id)
      .catch(e => erros(e))
      .finally(() => dispatch(setExibirLoaderPlanoAEE(false)));

    if (resultado?.data) {
      dispatch(setDadosParecer(resultado?.data));
    }
  }, [dispatch, match]);

  useEffect(() => {
    obterParecer();
  }, [obterParecer]);

  useEffect(() => {
    if (atualizarDados) {
      obterParecer();
    }
    dispatch(setAtualizarDados(false));
  }, [atualizarDados, dispatch, obterParecer]);

  return (
    <>
      <CardCollapse
        id={SGP_COLLAPSE_PARECER_PLANO_AEE}
        key="secao-parecer-plano-collapse-key"
        titulo="Parecer"
        show
        indice="secao-parecer-plano-collapse-indice"
        alt="secao-parecer-plano-alt"
      >
        {dadosParecer?.responsavelNome ? (
          <div className="col-md-12">
            <p
              style={{
                marginLeft: -15,
                width: '100%',
                display: 'flex',
              }}
            >
              PAAI responsável: {dadosParecer?.responsavelNome}
              <span
                style={{
                  color: Base.CinzaDesabilitado,
                  fontSize: '13px',
                  marginLeft: 9,
                }}
              >{` (${dadosParecer?.responsavelRF})`}</span>
            </p>
          </div>
        ) : (
          <></>
        )}
        <SecaoParecerCoordenacao
          desabilitar={!dadosParecer?.podeEditarParecerCoordenacao}
        />
        {dadosParecer?.podeAtribuirResponsavel ? (
          <SecaoParecerResponsavel />
        ) : (
          <></>
        )}

        {(dadosParecer?.podeEditarParecerPAAI ||
          planoAEEDados?.situacao === situacaoPlanoAEE.ParecerPAAI ||
          planoAEEDados?.situacao === situacaoPlanoAEE.Encerrado ||
          planoAEEDados?.situacao ===
            situacaoPlanoAEE.EncerradoAutomaticamente ||
          planoAEEDados?.situacao === situacaoPlanoAEE.Validado) && (
          <SecaoParecerPAAI />
        )}
      </CardCollapse>
    </>
  );
};

SecaoParecerPlanoCollapse.defaultProps = {
  match: {},
};

SecaoParecerPlanoCollapse.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};

export default SecaoParecerPlanoCollapse;
