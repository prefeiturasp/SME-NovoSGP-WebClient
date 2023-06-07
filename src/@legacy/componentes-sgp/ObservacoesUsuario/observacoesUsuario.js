import PropTypes from 'prop-types';
import React from 'react';
import { Label } from '~/componentes';
import CampoObservacao from './campoObservacao';
import { ContainerObservacoesUsuario } from './observacoesUsuario.css';
import ObservacoesUsuarioMontarDados from './observacoesUsuarioMontarDados';

const ObservacoesUsuario = props => {
  const {
    salvarObservacao,
    editarObservacao,
    excluirObservacao,
    obterUsuariosNotificar,
    carregarListaUsuariosNotificar,
    esconderLabel,
    esconderCaixaExterna,
    verificaProprietario,
    permissoes,
    mostrarBotaoNotificar,
    mostrarListaNotificacao,
    usarLocalizadorFuncionario,
    parametrosLocalizadorFuncionario,
    desabilitarBotaoNotificar,
    mudarObservacao,
    mudarObservacaoListagem,
    dreId,
    ueId,
  } = props;

  const { podeIncluir, podeAlterar, podeExcluir } = permissoes;

  return (
    <div className={`col-sm-12${esconderCaixaExterna ? '' : ' mb-2 mt-4'}`}>
      {!esconderLabel && <Label text="Observações" />}
      <ContainerObservacoesUsuario esconderCaixaExterna={esconderCaixaExterna}>
        <div style={{ margin: `${esconderCaixaExterna ? 0 : 15}px` }}>
          <CampoObservacao
            desabilitarBotaoNotificar={desabilitarBotaoNotificar}
            obterUsuariosNotificar={obterUsuariosNotificar}
            carregarListaUsuariosNotificar={carregarListaUsuariosNotificar}
            salvarObservacao={salvarObservacao}
            esconderCaixaExterna={esconderCaixaExterna}
            mostrarBotaoNotificar={mostrarBotaoNotificar}
            podeIncluir={podeIncluir}
            usarLocalizadorFuncionario={usarLocalizadorFuncionario}
            parametrosLocalizadorFuncionario={parametrosLocalizadorFuncionario}
            mudarObservacao={mudarObservacao}
            dreId={dreId}
            ueId={ueId}
          />
          <ObservacoesUsuarioMontarDados
            onClickSalvarEdicao={editarObservacao}
            onClickExcluir={excluirObservacao}
            verificaProprietario={verificaProprietario}
            esconderCaixaExterna={esconderCaixaExterna}
            podeAlterar={podeAlterar}
            podeExcluir={podeExcluir}
            mostrarListaNotificacao={mostrarListaNotificacao}
            mudarObservacaoListagem={mudarObservacaoListagem}
          />
        </div>
      </ContainerObservacoesUsuario>
    </div>
  );
};

ObservacoesUsuario.propTypes = {
  editarObservacao: PropTypes.func,
  salvarObservacao: PropTypes.func,
  excluirObservacao: PropTypes.func,
  obterUsuariosNotificar: PropTypes.func,
  carregarListaUsuariosNotificar: PropTypes.bool,
  mudarObservacao: PropTypes.func,
  mudarObservacaoListagem: PropTypes.func,
  esconderLabel: PropTypes.bool,
  esconderCaixaExterna: PropTypes.bool,
  verificaProprietario: PropTypes.bool,
  permissoes: PropTypes.oneOfType([PropTypes.object]),
  esconderBotaoNotificar: PropTypes.bool,
  mostrarListaNotificacao: PropTypes.bool,
  usarLocalizadorFuncionario: PropTypes.bool,
  parametrosLocalizadorFuncionario: PropTypes.oneOfType([PropTypes.object]),
  desabilitarBotaoNotificar: PropTypes.bool,
  dreId: PropTypes.string,
  ueId: PropTypes.string,
};

ObservacoesUsuario.defaultProps = {
  editarObservacao: () => {},
  salvarObservacao: () => {},
  excluirObservacao: () => {},
  obterUsuariosNotificar: () => {},
  mudarObservacao: () => {},
  mudarObservacaoListagem: () => {},
  carregarListaUsuariosNotificar: false,
  esconderLabel: false,
  esconderCaixaExterna: false,
  verificaProprietario: false,
  permissoes: { podeAlterar: true, podeIncluir: true, podeExcluir: true },
  mostrarBotaoNotificar: true,
  mostrarListaNotificacao: false,
  usarLocalizadorFuncionario: false,
  parametrosLocalizadorFuncionario: {},
  desabilitarBotaoNotificar: false,
  dreId: '',
  ueId: '',
};

export default ObservacoesUsuario;
