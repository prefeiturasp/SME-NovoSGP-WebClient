import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { RotasDto, situacaoPlanoAEE } from '~/dtos';
import { setTypePlanoAEECadastro } from '~/redux/modulos/planoAEE/actions';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import SecaoParecerPlanoCollapse from '../SecaoParecerPlanoCollapse/secaoParecerPlanoCollapse';
import SecaoPlanoCollapse from '../SecaoPlanoCollapse/secaoPlanoCollapse';
import SecaoReestruturacaoPlano from '../SecaoReestruturacaoPlano/secaoReestruturacaoPlano';
import AddResponsavelCadastroPlano from './addResponsavelCadastroPlano';

const { TabPane } = Tabs;

const MontarDadosTabs = () => {
  const location = useLocation();
  const paramsRoute = useParams();

  const temId = !!paramsRoute?.id;

  const dispatch = useDispatch();

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  useEffect(() => {
    if (location.pathname === `${RotasDto.RELATORIO_AEE_PLANO}/novo`) {
      dispatch(setTypePlanoAEECadastro(true));
    } else {
      dispatch(setTypePlanoAEECadastro(false));
    }
  }, [planoAEEDados]);

  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  // Seção pode voltar no futuro!
  const exibirTabReestruturacao = false;

  const cliqueTab = async key => {
    ServicoPlanoAEE.cliqueTabPlanoAEE(key, temId);
  };
  return dadosCollapseLocalizarEstudante?.codigoAluno &&
    planoAEEDados?.questionarioId ? (
    <ContainerTabsCard type="card" width="20%" onTabClick={cliqueTab}>
      <TabPane tab="Cadastro do Plano" key="1">
        <AddResponsavelCadastroPlano />
        <SecaoPlanoCollapse />
      </TabPane>
      {temId && exibirTabReestruturacao && (
        <TabPane
          tab="Reestruturação"
          key="2"
          disabled={
            planoAEEDados?.situacao !== situacaoPlanoAEE.Expirado &&
            planoAEEDados?.situacao !== situacaoPlanoAEE.Encerrado &&
            planoAEEDados?.situacao !==
              situacaoPlanoAEE.EncerradoAutomaticamente
          }
        >
          <SecaoReestruturacaoPlano />
        </TabPane>
      )}
      {temId && (
        <TabPane
          tab="Parecer"
          key="3"
          disabled={planoAEEDados?.situacao === situacaoPlanoAEE.Expirado}
        >
          <SecaoParecerPlanoCollapse />
        </TabPane>
      )}
    </ContainerTabsCard>
  ) : (
    <></>
  );
};

export default MontarDadosTabs;
