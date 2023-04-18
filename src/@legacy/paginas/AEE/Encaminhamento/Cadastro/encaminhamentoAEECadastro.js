import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import CollapseLocalizarEstudante from '~/componentes-sgp/CollapseLocalizarEstudante/collapseLocalizarEstudante';
import { RotasDto } from '~/dtos';
import { setLimparDadosAtribuicaoResponsavel } from '~/redux/modulos/collapseAtribuicaoResponsavel/actions';
import { setLimparDadosLocalizarEstudante } from '~/redux/modulos/collapseLocalizarEstudante/actions';
import {
  setDesabilitarCamposEncaminhamentoAEE,
  setLimparDadosEncaminhamento,
} from '~/redux/modulos/encaminhamentoAEE/actions';
import { setLimparDadosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';
import { setBreadcrumbManual, verificaSomenteConsulta } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import BotoesAcoesEncaminhamentoAEE from './Componentes/botoesAcoesEncaminhamentoAEE';
import LoaderEncaminhamento from './Componentes/LoaderEncaminhamento/loaderEncaminhamento';
import MontarDadosSecoes from './Componentes/MontarDadosSecoes/montarDadosSecoes';

const EncaminhamentoAEECadastro = () => {
  const dispatch = useDispatch();
  const paramsRoute = useParams();
  const location = useLocation();

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.RELATORIO_AEE_ENCAMINHAMENTO];

  const encaminhamentoId = paramsRoute?.id || 0;

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);
    const desabilitar =
      encaminhamentoId > 0
        ? soConsulta || !permissoesTela.podeAlterar
        : soConsulta || !permissoesTela.podeIncluir;
    dispatch(setDesabilitarCamposEncaminhamentoAEE(desabilitar));
  }, [encaminhamentoId, permissoesTela, dispatch]);

  const obterEncaminhamentoPorId = useCallback(async () => {
    ServicoEncaminhamentoAEE.obterEncaminhamentoPorId(encaminhamentoId);
  }, [encaminhamentoId]);

  useEffect(() => {
    if (encaminhamentoId) {
      obterEncaminhamentoPorId();
    }
  }, [encaminhamentoId, obterEncaminhamentoPorId, dispatch]);

  const limparDadosEncaminhamento = useCallback(() => {
    dispatch(setLimparDadosEncaminhamento());
    dispatch(setLimparDadosQuestionarioDinamico());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      limparDadosEncaminhamento();
      dispatch(setLimparDadosLocalizarEstudante());
      dispatch(setLimparDadosAtribuicaoResponsavel());
    };
  }, [dispatch, limparDadosEncaminhamento]);

  useEffect(() => {
    if (encaminhamentoId) {
      setBreadcrumbManual(
        location.pathname,
        'Editar',
        `${RotasDto.RELATORIO_AEE_ENCAMINHAMENTO}`
      );
    }
  }, [encaminhamentoId, location]);

  const validarSePermiteProximoPasso = params => {
    return ServicoEncaminhamentoAEE.podeCadastrarEncaminhamentoEstudante(
      params
    );
  };

  return (
    <LoaderEncaminhamento>
      <Cabecalho pagina="Encaminhamento AEE">
        <BotoesAcoesEncaminhamentoAEE />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            {encaminhamentoId ? (
              <></>
            ) : (
              <div className="col-md-12 mb-2">
                <CollapseLocalizarEstudante
                  changeDre={limparDadosEncaminhamento}
                  changeUe={limparDadosEncaminhamento}
                  changeTurma={limparDadosEncaminhamento}
                  changeLocalizadorEstudante={limparDadosEncaminhamento}
                  clickCancelar={limparDadosEncaminhamento}
                  validarSePermiteProximoPasso={validarSePermiteProximoPasso}
                />
              </div>
            )}
            <MontarDadosSecoes />
          </div>
        </div>
      </Card>
    </LoaderEncaminhamento>
  );
};

export default EncaminhamentoAEECadastro;
