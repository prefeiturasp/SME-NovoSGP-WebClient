import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { RotasDto, situacaoPlanoAEE } from '~/dtos';
import { setTypePlanoAEECadastro } from '~/redux/modulos/planoAEE/actions';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import SecaoParecerPlanoCollapse from '../SecaoParecerPlanoCollapse/secaoParecerPlanoCollapse';
import SecaoPlanoCollapse from '../SecaoPlanoCollapse/secaoPlanoCollapse';
import SecaoReestruturacaoPlano from '../SecaoReestruturacaoPlano/secaoReestruturacaoPlano';
import AddResponsavelCadastroPlano from './addResponsavelCadastroPlano';

const { TabPane } = Tabs;

const MontarDadosTabs = props => {
  const { match } = props;
  const temId = match?.params?.id;

  const dispatch = useDispatch();

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  useEffect(() => {
    if (match.url === `${RotasDto.RELATORIO_AEE_PLANO}/novo`) {
      dispatch(setTypePlanoAEECadastro(true));
    } else {
      dispatch(setTypePlanoAEECadastro(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <SecaoPlanoCollapse match={match} />
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
          <SecaoReestruturacaoPlano match={match} />
        </TabPane>
      )}
      {temId && (
        <TabPane
          tab="Parecer"
          key="3"
          disabled={planoAEEDados?.situacao === situacaoPlanoAEE.Expirado}
        >
          <SecaoParecerPlanoCollapse match={match} />
        </TabPane>
      )}
    </ContainerTabsCard>
  ) : (
    ''
  );
};

MontarDadosTabs.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};

MontarDadosTabs.defaultProps = {
  match: {},
};

export default MontarDadosTabs;
