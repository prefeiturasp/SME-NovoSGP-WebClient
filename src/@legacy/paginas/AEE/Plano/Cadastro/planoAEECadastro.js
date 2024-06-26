import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Cabecalho } from '~/componentes-sgp';
import CollapseLocalizarEstudante from '~/componentes-sgp/CollapseLocalizarEstudante/collapseLocalizarEstudante';
import Card from '~/componentes/card';
import { ROUTES } from '@/core/enum/routes';
import { setLimparDadosLocalizarEstudante } from '~/redux/modulos/collapseLocalizarEstudante/actions';
import { setPlanoAEELimparDados } from '~/redux/modulos/planoAEE/actions';
import { setLimparDadosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';
import { setBreadcrumbManual } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import AlertaCadastradoEmOutraUE from './Componentes/AlertaCadastradoEmOutraUE';
import BotaoVerSituacaoEncaminhamentoAEE from './Componentes/BotaoVerSituacaoEncaminhamentoAEE/botaoVerSituacaoEncaminhamentoAEE';
import LoaderPlano from './Componentes/LoaderPlano/loaderPlano';
import MarcadorSituacaoPlanoAEE from './Componentes/MarcadorSituacaoPlanoAEE/marcadorSituacaoPlanoAEE';
import ModalDevolverPlanoAEE from './Componentes/ModalDevolverPlanoAEE/modalDevolverPlanoAEE';
import ObjectCardEstudantePlanoAEE from './Componentes/ObjectCardEstudantePlanoAEE/objectCardEstudantePlanoAEE';
import ObservacoesPlanoAEE from './Componentes/ObservacoesPlanoAEE/observacoesPlanoAEE';
import SituacaoEncaminhamentoAEE from './Componentes/SituacaoEncaminhamentoAEE/situacaoEncaminhamentoAEE';
import TabCadastroPlano from './Componentes/TabCadastroPlano/tabCadastroPlano';
import BotoesAcoesPlanoAEE from './Componentes/botoesAcoesPlanoAEE';

const PlanoAEECadastro = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const paramsRoute = useParams();
  const match = location.match;

  const planoId = paramsRoute?.id;

  const exibirModalDevolverPlanoAEE = useSelector(
    store => store.planoAEE.exibirModalDevolverPlanoAEE
  );

  const limparDadosPlano = useCallback(() => {
    dispatch(setLimparDadosQuestionarioDinamico());
    dispatch(setPlanoAEELimparDados());
  }, [dispatch]);

  const validarSePermiteProximoPasso = async codigoEstudante => {
    return ServicoPlanoAEE.existePlanoAEEEstudante(codigoEstudante);
  };

  useEffect(() => {
    if (planoId) {
      setBreadcrumbManual(
        location.pathname,
        'Editar',
        `${ROUTES.RELATORIO_AEE_PLANO}`
      );
    }
  }, [location, planoId]);

  useEffect(() => {
    return () => {
      limparDadosPlano();
      dispatch(setLimparDadosLocalizarEstudante());
    };
  }, [dispatch, limparDadosPlano]);

  return (
    <LoaderPlano>
      <AlertaCadastradoEmOutraUE />
      <Cabecalho pagina="Plano AEE">
        <div className="d-flex justify-content-end">
          <BotoesAcoesPlanoAEE />
        </div>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 mb-2 d-flex justify-content-end">
              <MarcadorSituacaoPlanoAEE />
            </div>
            {planoId ? (
              <></>
            ) : (
              <div className="col-md-12 mb-2">
                <CollapseLocalizarEstudante
                  changeDre={limparDadosPlano}
                  changeUe={limparDadosPlano}
                  changeTurma={limparDadosPlano}
                  changeLocalizadorEstudante={limparDadosPlano}
                  clickCancelar={limparDadosPlano}
                  validarSePermiteProximoPasso={validarSePermiteProximoPasso}
                />
              </div>
            )}
            <div className="col-md-12 mb-2">
              <ObjectCardEstudantePlanoAEE />
            </div>
            <div className="col-md-12 mt-2 mb-2">
              <SituacaoEncaminhamentoAEE />
            </div>
            <div className="col-md-4 mb-4">
              <BotaoVerSituacaoEncaminhamentoAEE />
            </div>
            <div className="col-md-12 mt-2 mb-2">
              <TabCadastroPlano />
            </div>
            <div className="col-sm-12">
              <ObservacoesPlanoAEE />
            </div>
          </div>
        </div>
        {exibirModalDevolverPlanoAEE && <ModalDevolverPlanoAEE match={match} />}
      </Card>
    </LoaderPlano>
  );
};

export default PlanoAEECadastro;
