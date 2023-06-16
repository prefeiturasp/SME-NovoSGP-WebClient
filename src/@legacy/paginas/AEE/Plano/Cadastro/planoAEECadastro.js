import React, { useCallback, useEffect,useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import CollapseLocalizarEstudante from '~/componentes-sgp/CollapseLocalizarEstudante/collapseLocalizarEstudante';
import Card from '~/componentes/card';
import { RotasDto } from '~/dtos';
import { setLimparDadosLocalizarEstudante } from '~/redux/modulos/collapseLocalizarEstudante/actions';
import { setPlanoAEELimparDados } from '~/redux/modulos/planoAEE/actions';
import { setLimparDadosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';
import { setBreadcrumbManual } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import BotaoVerSituacaoEncaminhamentoAEE from './Componentes/BotaoVerSituacaoEncaminhamentoAEE/botaoVerSituacaoEncaminhamentoAEE';
import BotoesAcoesPlanoAEE from './Componentes/botoesAcoesPlanoAEE';
import LoaderPlano from './Componentes/LoaderPlano/loaderPlano';
import MarcadorSituacaoPlanoAEE from './Componentes/MarcadorSituacaoPlanoAEE/marcadorSituacaoPlanoAEE';
import ModalDevolverPlanoAEE from './Componentes/ModalDevolverPlanoAEE/modalDevolverPlanoAEE';
import ObjectCardEstudantePlanoAEE from './Componentes/ObjectCardEstudantePlanoAEE/objectCardEstudantePlanoAEE';
import ObservacoesPlanoAEE from './Componentes/ObservacoesPlanoAEE/observacoesPlanoAEE';
import SituacaoEncaminhamentoAEE from './Componentes/SituacaoEncaminhamentoAEE/situacaoEncaminhamentoAEE';
import TabCadastroPlano from './Componentes/TabCadastroPlano/tabCadastroPlano';
import Row from '~/componentes/row';
import Alert from '~/componentes/alert';
import { Grid } from '~/componentes';
import { Container } from './planoAEECadastro.css';
import { SGP_ALERT_PLANO_AEE_EM_OUTRA_UE } from '~/constantes/ids/alert/index';


const PlanoAEECadastro = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const paramsRoute = useParams();

  const planoId = paramsRoute?.id;
  const [cadastradoEmOutraUE, setCadastradoEmOutraUE] = useState(false);
  const criadoEmOutraUe = useSelector(store => store?.planoAEE?.criadoEmOutraUe);
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
        `${RotasDto.RELATORIO_AEE_PLANO}`
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
        {criadoEmOutraUe ? (<Row className="mb-0 pb-0">
          <Grid cols={12} className="mb-0 pb-0">
            <Container>
              <Alert
                alerta={{
                  tipo: 'warning',
                  id: SGP_ALERT_PLANO_AEE_EM_OUTRA_UE,
                  mensagem:
                    'Você tem apenas permissão de consulta nesta tela. Este plano está cadastrado em outra UE.',
                  estiloTitulo: { fontSize: '18px' },
                }}
                className="mb-2"
              />
            </Container>
          </Grid>
        </Row>):<></>} 
      <Cabecalho pagina="Plano AEE">
        <div className="d-flex justify-content-end">
          <BotoesAcoesPlanoAEE criadoEmOutraUe={criadoEmOutraUe} />
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
