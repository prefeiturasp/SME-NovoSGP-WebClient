import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContainerTabsCard } from '~/componentes/tabs/style';
import {
  setTabAtualComponenteCurricular,
  setExibirLoaderPlanoAnual,
  setListaComponentesCheck,
} from '~/redux/modulos/anual/actions';
import ServicoPlanoAnual from '~/servicos/Paginas/ServicoPlanoAnual';
import DescricaoPlanejamento from '../DescricaoPlanejamento/descricaoPlanejamento';
import ListaObjetivos from '../ListaObjetivos/listaObjetivos';
import {
  ContainerTabsComponentesCorriculares,
  AvisoComponenteCurricular,
  DescricaoNomeTabComponenteCurricular,
} from './tabsComponentesCorriculares.css';

const TabsComponentesCorriculares = props => {
  const dispatch = useDispatch();
  const listaComponentesCheck = useSelector(
    store => store.planoAnual.listaComponentesCheck
  );

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const { dadosBimestre } = props;

  const listaComponentesCurricularesPlanejamento = useSelector(
    store => store.planoAnual.listaComponentesCurricularesPlanejamento
  );

  const tabAtualComponenteCurricular = useSelector(
    store =>
      store.planoAnual.tabAtualComponenteCurricular[dadosBimestre.bimestre]
  );

  const componenteCurricular = useSelector(
    store => store.planoAnual.componenteCurricular
  );

  const clicouNoBimestre = useSelector(
    store => store.planoAnual.clicouNoBimestre[dadosBimestre.bimestre]
  );

  const montarDados = () => {
    return (
      <div className="col-md-12">
        {componenteCurricular.possuiObjetivos ? (
          <ListaObjetivos
            dadosBimestre={dadosBimestre}
            tabAtualComponenteCurricular={tabAtualComponenteCurricular}
          />
        ) : (
          ''
        )}
        <DescricaoPlanejamento
          dadosBimestre={dadosBimestre}
          tabAtualComponenteCurricular={tabAtualComponenteCurricular}
        />
      </div>
    );
  };

  const onChangeTab = useCallback(
    codigoComponente => {
      const componente = listaComponentesCurricularesPlanejamento.find(
        item =>
          String(item.codigoComponenteCurricular) === String(codigoComponente)
      );

      dispatch(
        setTabAtualComponenteCurricular({
          bimestre: dadosBimestre.bimestre,
          componente,
        })
      );
      if (modalidadesFiltroPrincipal.length) {
        ServicoPlanoAnual.carregarDadosPlanoAnualPorComponenteCurricular(
          turmaSelecionada.id,
          codigoComponente,
          dadosBimestre.id,
          dadosBimestre.bimestre
        );
      }
    },

    [
      dispatch,
      dadosBimestre,
      listaComponentesCurricularesPlanejamento,
      turmaSelecionada,
    ]
  );

  useEffect(() => {
    async function verificarComponentesComObjetivos() {
      try {
        const mudouTurma = listaComponentesCheck.find(
          item => item.turmaSelecionada !== turmaSelecionada.id
        );
        if (mudouTurma) {
          dispatch(setListaComponentesCheck([]));
        }
        if (
          listaComponentesCurricularesPlanejamento.length &&
          modalidadesFiltroPrincipal.length
        ) {
          dispatch(setExibirLoaderPlanoAnual(true));
          listaComponentesCurricularesPlanejamento.map(async item => {
            if (
              !listaComponentesCheck?.filter(
                f =>
                  String(f.componenteId) ===
                    String(item.codigoComponenteCurricular) &&
                  Number(f.bimestreId) === Number(dadosBimestre.id)
              ).length
            ) {
              const { componentes } =
                await ServicoPlanoAnual.verificarDadosPlanoPorComponenteCurricular(
                  turmaSelecionada.id,
                  item.codigoComponenteCurricular,
                  dadosBimestre.id
                );
              if (
                componentes[0]?.objetivosAprendizagemId?.length ||
                componentes[0]?.descricao
              ) {
                const tempComponentesComObjetivos = listaComponentesCheck;
                const novoItem = {
                  componenteId: item.codigoComponenteCurricular,
                  bimestreId: dadosBimestre.id,
                  turmaSelecionada: turmaSelecionada.id,
                };
                tempComponentesComObjetivos.push(novoItem);
                dispatch(setListaComponentesCheck(tempComponentesComObjetivos));
              }
            }
          });
          dispatch(setExibirLoaderPlanoAnual(false));
        }
      } catch (error) {
        console.log(error);
      }
    }
    verificarComponentesComObjetivos();
  }, [
    listaComponentesCurricularesPlanejamento,
    dadosBimestre,
    dispatch,
    turmaSelecionada.id,
    listaComponentesCheck,
  ]);

  // Quando tiver somente uma tab(componente curricular) já selecionar!
  useEffect(() => {
    if (
      clicouNoBimestre &&
      listaComponentesCurricularesPlanejamento.length === 1
    ) {
      onChangeTab(
        listaComponentesCurricularesPlanejamento[0].codigoComponenteCurricular
      );
    }
  }, [onChangeTab, clicouNoBimestre, listaComponentesCurricularesPlanejamento]);

  const obterDescricaoNomeTabComponenteCurricular = (
    nome,
    codigoComponenteCurricular
  ) => {
    if (listaComponentesCheck?.length) {
      if (
        listaComponentesCheck.filter(
          item =>
            String(item.componenteId) === String(codigoComponenteCurricular) &&
            Number(item.bimestreId) === Number(dadosBimestre.id)
        ).length
      ) {
        return (
          <DescricaoNomeTabComponenteCurricular
            title={nome}
            tabSelecionada={
              String(
                tabAtualComponenteCurricular?.codigoComponenteCurricular
              ) === String(codigoComponenteCurricular)
            }
          >
            <span className="desc-nome">{nome}</span>
            <i className="fas fa-check-circle ml-2" />
          </DescricaoNomeTabComponenteCurricular>
        );
      }
    }
    return <span title={nome}>{nome}</span>;
  };

  return (
    <>
      {listaComponentesCurricularesPlanejamento?.length ? (
        <ContainerTabsComponentesCorriculares widthAntTabsNav="100%">
          {!tabAtualComponenteCurricular?.codigoComponenteCurricular &&
            componenteCurricular?.regencia && (
              <AvisoComponenteCurricular>
                <span>
                  Selecione um componente curricular abaixo para visualizar o
                  planejamento
                </span>
              </AvisoComponenteCurricular>
            )}

          <ContainerTabsCard
            type="card"
            onChange={onChangeTab}
            activeKey={String(
              tabAtualComponenteCurricular?.codigoComponenteCurricular
            )}
            items={listaComponentesCurricularesPlanejamento.map(item => {
              return {
                label: obterDescricaoNomeTabComponenteCurricular(
                  item.nome,
                  item.codigoComponenteCurricular
                ),
                key: String(item.codigoComponenteCurricular),
                children:
                  String(
                    tabAtualComponenteCurricular?.codigoComponenteCurricular
                  ) === String(item.codigoComponenteCurricular)
                    ? montarDados()
                    : '',
              };
            })}
          />
        </ContainerTabsComponentesCorriculares>
      ) : (
        ''
      )}
    </>
  );
};

TabsComponentesCorriculares.propTypes = {
  dadosBimestre: PropTypes.oneOfType([PropTypes.object]),
};

TabsComponentesCorriculares.defaultProps = {
  dadosBimestre: '',
};

export default TabsComponentesCorriculares;
