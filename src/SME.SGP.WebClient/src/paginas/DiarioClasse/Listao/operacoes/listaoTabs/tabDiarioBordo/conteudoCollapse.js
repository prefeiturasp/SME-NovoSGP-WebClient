import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Auditoria, JoditEditor } from '~/componentes';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import ListaoContext from '../../../listaoContext';
import MarcadorInseridoCJ from './componentes/MarcadorInseridoCJ/marcadorInseridoCJ';
import ObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/observacoesUsuario';
import { confirmar, erros, ServicoDiarioBordo, sucesso } from '~/servicos';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';

const ConteudoCollapse = props => {
  const dispatch = useDispatch();

  const {
    dadosDiarioBordo,
    setDadosDiarioBordo,
    somenteConsultaListao,
    periodoAbertoListao,
    setExibirLoaderGeral,
  } = useContext(ListaoContext);

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const { dados, indexDiarioBordo, turmaId } = props;
  const { auditoria, pendente, diarioBordoId } = dados;

  const listaUsuarios = useSelector(
    store => store.observacoesUsuario.listaUsuariosNotificacao
  );

  const setarDiarioAlterado = () => {
    dadosDiarioBordo[indexDiarioBordo].alterado = true;
    dispatch(setTelaEmEdicao(true));
    setDadosDiarioBordo(dadosDiarioBordo);
  };

  const onChangePlanejamento = valor => {
    dados.planejamento = valor;
    setarDiarioAlterado();
  };

  const onChangeReflexoesReplanejamento = valor => {
    dados.reflexoesReplanejamento = valor;
    setarDiarioAlterado();
  };

  const mudarObservacao = () => {
    dispatch(setTelaEmEdicao(true));
  };

  const salvarEditarObservacao = async (valor, IdDiarioBordo) => {
    const params = {
      observacao: valor.observacao,
      usuariosIdNotificacao: [],
      id: valor.id,
    };
    let observacaoId = valor.id;

    setExibirLoaderGeral(true);
    const resultado = await ServicoDiarioBordo.salvarEditarObservacao(
      IdDiarioBordo,
      params
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoaderGeral(false));

    if (resultado?.status === 200) {
      sucesso(`Observação ${valor.id ? 'alterada' : 'inserida'} com sucesso`);
      if (!observacaoId) {
        observacaoId = resultado.data.id;
      }

      ServicoObservacoesUsuario.atualizarSalvarEditarDadosObservacao(
        valor,
        resultado.data
      );

      return resultado;
    }
  };

  const excluirObservacao = async obs => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?'
    );

    if (confirmado) {
      setExibirLoaderGeral(true);
      const resultado = await ServicoDiarioBordo.excluirObservacao(obs)
        .catch(e => erros(e))
        .finally(() => setExibirLoaderGeral(false));

      if (resultado?.status === 200) {
        sucesso('Registro excluído com sucesso');
        ServicoDiarioBordo.atualizarExcluirDadosObservacao(obs, resultado.data);
      }
    }
  };

  return (
    <>
      <Row gutter={[24, 24]}>
        {dados?.inseridoCJ && <MarcadorInseridoCJ />}
        <Col sm={24}>
          <JoditEditor
            id="editor-planejamento"
            name="planejamento"
            label="Planejamento"
            value={dados?.planejamento}
            onChange={valor => {
              if (!desabilitarCampos) {
                onChangePlanejamento(valor);
              }
            }}
            readonly={desabilitarCampos}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col sm={24}>
          <JoditEditor
            valideClipboardHTML={false}
            id="editor-reflexoesReplanejamento"
            name="reflexoesReplanejamento"
            label="Reflexões e replanejamentos"
            value={dados?.reflexoesReplanejamento}
            onChange={valor => {
              if (!desabilitarCampos) {
                onChangeReflexoesReplanejamento(valor);
              }
            }}
            readonly={desabilitarCampos}
          />
        </Col>
      </Row>
      {auditoria?.criadoPor ? (
        <Row gutter={[24, 24]}>
          <Auditoria
            ignorarMarginTop
            criadoPor={auditoria?.criadoPor}
            criadoEm={auditoria?.criadoEm}
            alteradoPor={auditoria?.alteradoPor}
            alteradoEm={auditoria?.alteradoEm}
            alteradoRf={auditoria?.alteradoRF}
            criadoRf={auditoria?.criadoRF}
          />
        </Row>
      ) : (
        <></>
      )}
      <Row gutter={[24, 24]} style={{ marginTop: 12, marginBottom: -8 }}>
        <ObservacoesUsuario
          esconderLabel={pendente}
          esconderCaixaExterna={pendente}
          desabilitarBotaoNotificar={pendente}
          mostrarListaNotificacao={!pendente}
          salvarObservacao={obs => salvarEditarObservacao(obs, diarioBordoId)}
          editarObservacao={obs => salvarEditarObservacao(obs, diarioBordoId)}
          excluirObservacao={obs => excluirObservacao(obs)}
          mudarObservacao={mudarObservacao}
          diarioBordoId={diarioBordoId}
        />
      </Row>
    </>
  );
};

ConteudoCollapse.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.any]),
  indexDiarioBordo: PropTypes.number,
  turmaId: PropTypes.number,
};

ConteudoCollapse.defaultProps = {
  dados: null,
  indexDiarioBordo: null,
  turmaId: null,
};

export default ConteudoCollapse;
