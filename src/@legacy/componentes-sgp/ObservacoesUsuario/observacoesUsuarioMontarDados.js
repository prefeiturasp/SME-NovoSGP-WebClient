import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import Auditoria from '~/componentes/auditoria';
import LinhaObservacaoProprietario from './linhaObservacaoProprietario';
import ListaNotificacoes from './listaNotificacoes/listaNotificacoes';
import { ContainerCampoObservacao } from './observacoesUsuario.css';

const ObservacoesUsuarioMontarDados = props => {
  const {
    onClickSalvarEdicao,
    onClickExcluir,
    verificaProprietario,
    esconderCaixaExterna,
    podeAlterar,
    podeExcluir,
    mostrarListaNotificacao,
    mudarObservacaoListagem,
  } = props;

  const dadosObservacoes = useSelector(
    store => store.observacoesUsuario.dadosObservacoes
  );

  const auditoria = observacao => {
    return (
      <div className="row mt-1">
        <Auditoria
          alteradoEm={observacao.auditoria.alteradoEm}
          alteradoPor={observacao.auditoria.alteradoPor}
          alteradoRf={observacao.auditoria.alteradoRF}
          criadoEm={observacao.auditoria.criadoEm}
          criadoPor={observacao.auditoria.criadoPor}
          criadoRf={observacao.auditoria.criadoRF}
          ignorarMarginTop
        />
      </div>
    );
  };

  const montaLinhaObservacao = obs => {
    return (
      <div className="mb-5 position-relative" key={shortid.generate()}>
        <ContainerCampoObservacao
          style={{ cursor: 'not-allowed' }}
          className="col-md-12"
          readOnly
          autoSize={{ minRows: 3 }}
          value={obs.observacao}
        />
        {obs.auditoria ? <>{auditoria(obs)}</> : ''}
        {mostrarListaNotificacao ? (
          <ListaNotificacoes obs={obs} somenteLeitura />
        ) : (
          <></>
        )}
      </div>
    );
  };

  const montarValores = (obs, index) => {
    if (obs && (verificaProprietario ? obs.proprietario : true)) {
      return (
        <div className="mb-5 position-relative" key={shortid.generate()}>
          <LinhaObservacaoProprietario
            dados={obs}
            onClickSalvarEdicao={onClickSalvarEdicao}
            onClickExcluir={onClickExcluir}
            index={index}
            podeAlterar={podeAlterar}
            podeExcluir={podeExcluir}
            proprietario={obs.proprietario}
            mudarObservacaoListagem={mudarObservacaoListagem}
          >
            {obs.auditoria ? auditoria(obs) : ''}
            {mostrarListaNotificacao ? <ListaNotificacoes obs={obs} /> : <></>}
          </LinhaObservacaoProprietario>
        </div>
      );
    }
    return montaLinhaObservacao(obs);
  };

  return (
    <div className={`col-sm-12 p-0${esconderCaixaExterna ? '' : ' mb-2 mt-4'}`}>
      {dadosObservacoes && dadosObservacoes.length
        ? dadosObservacoes.map((obs, index) => {
            return montarValores(obs, index);
          })
        : ''}
    </div>
  );
};

ObservacoesUsuarioMontarDados.propTypes = {
  onClickSalvarEdicao: PropTypes.func,
  onClickExcluir: PropTypes.func,
  verificaProprietario: PropTypes.bool,
  esconderCaixaExterna: PropTypes.bool,
  podeAlterar: PropTypes.bool,
  podeExcluir: PropTypes.bool,
  mostrarListaNotificacao: PropTypes.bool,
  mudarObservacaoListagem: PropTypes.func,
};

ObservacoesUsuarioMontarDados.defaultProps = {
  onClickSalvarEdicao: () => {},
  onClickExcluir: () => {},
  mudarObservacaoListagem: () => {},
  verificaProprietario: false,
  esconderCaixaExterna: false,
  podeAlterar: true,
  podeExcluir: true,
  mostrarListaNotificacao: false,
};

export default ObservacoesUsuarioMontarDados;
