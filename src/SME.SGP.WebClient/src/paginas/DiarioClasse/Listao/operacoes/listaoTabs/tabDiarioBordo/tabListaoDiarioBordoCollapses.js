import { Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Base, PainelCollapse } from '~/componentes';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import {
  limparDadosObservacoesUsuario,
  setDadosObservacoesUsuario,
} from '~/redux/modulos/observacoesUsuario/actions';
import { confirmar, ServicoDiarioBordo } from '~/servicos';
import ListaoContext from '../../../listaoContext';
import {
  obterDiarioBordoListao,
  salvarEditarObservacao,
} from '../../../listaoFuncoes';
import ConteudoCollapse from './conteudoCollapse';

const PainelCollapseContainer = styled(PainelCollapse)`
  .ant-collapse-item {
    margin-bottom: 16px !important;
  }
  .ant-collapse-content {
    border: 1px solid #d9d9d9;
  }
`;

const TabListaoDiarioBordoCollapses = () => {
  const telaEmEdicao = useSelector(store => store.geral.telaEmEdicao);
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;

  const {
    setExibirLoaderGeral,
    periodo,
    componenteCurricularDiarioBordo,
    dadosDiarioBordo,
    setDadosDiarioBordo,
    setDadosIniciaisDiarioBordo,
    idDiarioBordoAtual,
    setIdDiarioBordoAtual,
  } = useContext(ListaoContext);

  const exibirDiarioBordoCollapses =
    componenteCurricularDiarioBordo && periodo && dadosDiarioBordo?.length;

  const dispatch = useDispatch();

  useEffect(() => {
    if (turma && periodo && componenteCurricularDiarioBordo) {
      obterDiarioBordoListao(
        turma,
        periodo,
        componenteCurricularDiarioBordo,
        setExibirLoaderGeral,
        setDadosDiarioBordo,
        setDadosIniciaisDiarioBordo
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo, componenteCurricularDiarioBordo]);

  const perguntarSalvarObservacao = async () => {
    if (telaEmEdicao && idDiarioBordoAtual) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas observações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        await salvarEditarObservacao(
          null,
          idDiarioBordoAtual,
          setExibirLoaderGeral
        );
      }
    }

    setIdDiarioBordoAtual();
    dispatch(limparDadosObservacoesUsuario());
    dispatch(setDadosObservacoesUsuario([]));
    dispatch(setTelaEmEdicao(false));
  };

  const onColapse = async aulaId => {
    await perguntarSalvarObservacao();

    const diario =
      dadosDiarioBordo &&
      dadosDiarioBordo.find(item => item?.aulaId === Number(aulaId));
    const idDiario = diario?.diarioBordoId;
    let observacoes = [];

    if (idDiario) {
      const dados = await ServicoDiarioBordo.obterDiarioBordoDetalhes(idDiario);
      if (dados?.data) {
        if (dados.data.observacoes.length) {
          observacoes = ServicoObservacoesUsuario.obterUsuarioPorObservacao(
            dados.data.observacoes,
            idDiario
          );
          dispatch(setDadosObservacoesUsuario(observacoes));
        }
      }
    }
  };

  const defaultActiveKeyDados = dadosDiarioBordo.map(dados => dados?.aulaId);

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24}>
        {!!exibirDiarioBordoCollapses && (
          <PainelCollapseContainer
            bordered={false}
            defaultActiveKey={defaultActiveKeyDados}
            onChange={onColapse}
          >
            {dadosDiarioBordo.map((dados, indexDiarioBordo) => {
              const { aulaId, titulo, pendente } = dados;
              const bordaCollapse = pendente
                ? Base.LaranjaStatus
                : Base.AzulBordaCollapse;
              return (
                <PainelCollapse.Painel
                  key={aulaId}
                  accordion
                  espacoPadrao
                  corBorda={bordaCollapse}
                  temBorda
                  header={titulo}
                  ehPendente={pendente}
                >
                  <ConteudoCollapse
                    dados={dados}
                    indexDiarioBordo={indexDiarioBordo}
                    key={aulaId}
                    turmaSelecionada={turmaSelecionada}
                  />
                </PainelCollapse.Painel>
              );
            })}
          </PainelCollapseContainer>
        )}
      </Col>
    </Row>
  );
};

export default TabListaoDiarioBordoCollapses;
