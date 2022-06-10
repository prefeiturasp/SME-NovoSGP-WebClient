import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContainerTabsCard } from '~/componentes/tabs/tabs.css';
import { situacaoPlanoAEE } from '~/dtos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import SecaoParecerPlanoCollapse from '../SecaoParecerPlanoCollapse/secaoParecerPlanoCollapse';
import SecaoPlanoCollapse from '../SecaoPlanoCollapse/secaoPlanoCollapse';
import SecaoReestruturacaoPlano from '../SecaoReestruturacaoPlano/secaoReestruturacaoPlano';
import LocalizadorFuncionario from '~/componentes-sgp/LocalizadorFuncionario';
import { setDadosAtribuicaoResponsavel } from '~/redux/modulos/planoAEE/actions';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';

const { TabPane } = Tabs;

const MontarDadosTabs = props => {
  const [limparCampos, setLimparCampos] = useState(false);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState();

  const { match } = props;
  const temId = match?.params?.id;

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

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

  // Seção pode voltar no futuro!
  const exibirTabReestruturacao = false;

  const cliqueTab = async key => {
    ServicoPlanoAEE.cliqueTabPlanoAEE(key, temId);
  };

  const dispatch = useDispatch();

  const onChangeLocalizador = funcionario => {
    setLimparCampos(false);
    if (funcionario?.codigoRF && funcionario?.nomeServidor) {
      const params = {
        codigoRF: funcionario?.codigoRF,
        nomeServidor: funcionario?.nomeServidor,
      };
      dispatch(setDadosAtribuicaoResponsavel(params));
      dispatch(setQuestionarioDinamicoEmEdicao(true));
      setResponsavelSelecionado(params);
    } else {
      dispatch(setDadosAtribuicaoResponsavel());
      dispatch(setQuestionarioDinamicoEmEdicao(false));
      setResponsavelSelecionado();
    }
  };

  return dadosCollapseLocalizarEstudante?.codigoAluno ? (
    <ContainerTabsCard type="card" width="20%" onTabClick={cliqueTab}>
      <TabPane tab="Cadastro do Plano" key="1">
        <p>Atribuir responsável:</p>
        <div className="row mb-4">
          <LocalizadorFuncionario
            id="funcionarioResponsavel"
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
              situacaoPlanoAEE.EncerradoAutomaticamento
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
