import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { BimestreEnum, BimestreEnumDisplay } from '@/core/enum/bimestre-tab-enum';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { Row, Tabs } from 'antd';
import React from 'react';
import ModalErrosQuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/Componentes/ModalErrosQuestionarioDinamico/modalErrosQuestionarioDinamico';
import { ContainerTabsCard } from '~/componentes/tabs/style';
import {
  setBimestreSelecionado,
  setDadosSecoesMapeamentoEstudantes,
  setMapeamentoEstudanteId,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { FormDinamicoMapeamentoEstudantesSecoes } from '../form-dinamico-secoes';

const { TabPane } = Tabs;

export const BimestresMapeamentoEstudantes: React.FC = () => {
  const dispatch = useAppDispatch();

  const usuario = useAppSelector((store) => store.usuario);

  const bimestreSelecionado = useAppSelector(
    (store) => store.mapeamentoEstudantes.bimestreSelecionado as BimestreEnum,
  );

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;
  const modalidade = turmaSelecionada?.modalidade;
  const naoEhEjaOuCelp =
    Number(modalidade) !== ModalidadeEnum.EJA && Number(modalidade) !== ModalidadeEnum.CELP;

  const permiteOnChangeBimestre = async () => {
    const continuar = await mapeamentoEstudantesService.salvar();

    return !!continuar;
  };

  const onChangeTab = async (bimestre: string) => {
    const permiteAlterarBimestre = await permiteOnChangeBimestre();

    if (permiteAlterarBimestre) {
      dispatch(setDadosSecoesMapeamentoEstudantes(undefined));
      dispatch(setMapeamentoEstudanteId(undefined));
      dispatch(setLimparDadosQuestionarioDinamico());
      dispatch(setListaSecoesEmEdicao([]));

      dispatch(setBimestreSelecionado(bimestre));
    }
  };

  const montarDados = (bimestreComparacao: BimestreEnum, children: React.ReactNode) => {
    if (bimestreComparacao === bimestreSelecionado) return children;

    return <></>;
  };

  return (
    <>
      <ModalErrosQuestionarioDinamico
        mensagem={`Existem campos obrigatórios no ${BimestreEnumDisplay[bimestreSelecionado]}`}
      />
      <ContainerTabsCard
        type="card"
        onChange={onChangeTab}
        destroyInactiveTabPane
        activeKey={bimestreSelecionado}
      >
        <TabPane tab={BimestreEnumDisplay[BimestreEnum.BIMESTRE_1]} key={BimestreEnum.BIMESTRE_1}>
          {montarDados(BimestreEnum.BIMESTRE_1, <FormDinamicoMapeamentoEstudantesSecoes />)}
        </TabPane>

        <TabPane tab={BimestreEnumDisplay[BimestreEnum.BIMESTRE_2]} key={BimestreEnum.BIMESTRE_2}>
          {montarDados(BimestreEnum.BIMESTRE_2, <FormDinamicoMapeamentoEstudantesSecoes />)}
        </TabPane>

        {naoEhEjaOuCelp ? (
          <TabPane tab={BimestreEnumDisplay[BimestreEnum.BIMESTRE_3]} key={BimestreEnum.BIMESTRE_3}>
            {montarDados(BimestreEnum.BIMESTRE_3, <FormDinamicoMapeamentoEstudantesSecoes />)}
          </TabPane>
        ) : (
          <></>
        )}

        {naoEhEjaOuCelp ? (
          <TabPane tab={BimestreEnumDisplay[BimestreEnum.BIMESTRE_4]} key={BimestreEnum.BIMESTRE_4}>
            {montarDados(BimestreEnum.BIMESTRE_4, <FormDinamicoMapeamentoEstudantesSecoes />)}
          </TabPane>
        ) : (
          <></>
        )}
      </ContainerTabsCard>
      {!bimestreSelecionado ? <Row justify="center">Selecione um bimestre</Row> : <></>}
    </>
  );
};
