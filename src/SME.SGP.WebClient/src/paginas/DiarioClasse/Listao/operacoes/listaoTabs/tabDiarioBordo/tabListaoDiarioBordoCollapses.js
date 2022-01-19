import { Col, Row } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Base, PainelCollapse } from '~/componentes';
import {
  limparDadosObservacoesUsuario,
  setDadosObservacoesUsuario,
} from '~/redux/modulos/observacoesUsuario/actions';
import { erros, ServicoDiarioBordo } from '~/servicos';
import ListaoContext from '../../../listaoContext';
import { obterDiarioBordoListao } from '../../../listaoFuncoes';
import ConteudoCollapse from './conteudoCollapse';

const TabListaoDiarioBordoCollapses = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma, id: turmaId } = turmaSelecionada;

  const {
    setExibirLoaderGeral,
    periodo,
    componenteCurricularDiarioBordo,
    dadosDiarioBordo,
    setDadosDiarioBordo,
    setDadosIniciaisDiarioBordo,
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
  }, [periodo, componenteCurricularDiarioBordo]);

  const obterUsuarioPorObservacao = (dadosObservacoes, diarioBordoId) => {
    const promises = dadosObservacoes.map(async observacao => {
      const retorno = await ServicoDiarioBordo.obterNofiticarUsuarios({
        turmaId,
        observacaoId: observacao.id,
        diarioBordoId,
      }).catch(e => erros(e));

      if (retorno?.data) {
        return {
          ...observacao,
          usuariosNotificacao: retorno.data,
          listagemDiario: true,
        };
      }
      return observacao;
    });
    return Promise.all(promises);
  };

  const onColapse = async aulaId => {
    dispatch(limparDadosObservacoesUsuario());
    const diario =
      dadosDiarioBordo &&
      dadosDiarioBordo.find(item => item?.aulaId === Number(aulaId));
    const idDiario = diario?.diarioBordoId;
    let observacoes = [];

    if (idDiario) {
      const dados = await ServicoDiarioBordo.obterDiarioBordoDetalhes(idDiario);
      if (dados?.data) {
        if (dados.data.observacoes.length) {
          observacoes = await obterUsuarioPorObservacao(
            dados.data.observacoes,
            idDiario
          );
          dispatch(setDadosObservacoesUsuario(observacoes));
        }
      }
    }
  };

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24}>
        {!!exibirDiarioBordoCollapses && (
          <PainelCollapse accordion onChange={onColapse}>
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
                    turmaId={turmaId}
                  />
                </PainelCollapse.Painel>
              );
            })}
          </PainelCollapse>
        )}
      </Col>
    </Row>
  );
};

export default TabListaoDiarioBordoCollapses;
