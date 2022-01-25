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
    esconderLabel,
    esconderCaixaExterna,
    verificaProprietario,
    permissoes,
    mostrarListaNotificacao,
    obterUsuariosNotificadosDiarioBordo,
    usarLocalizadorFuncionario,
    parametrosLocalizadorFuncionario,
    desabilitarBotaoNotificar,
    diarioBordoId,
    dreId,
    ueId,
  } = props;

  const { podeIncluir, podeAlterar, podeExcluir } = permissoes;

  return (
    <div className="col-sm-12 mb-2 mt-4">
      {!esconderLabel && <Label text="Observações" />}
      <ContainerObservacoesUsuario esconderCaixaExterna={esconderCaixaExterna}>
        <div style={{ margin: `${esconderCaixaExterna ? 0 : 15}px` }}>
          <CampoObservacao
            desabilitarBotaoNotificar={desabilitarBotaoNotificar}
            salvarObservacao={salvarObservacao}
            esconderCaixaExterna={esconderCaixaExterna}
            podeIncluir={podeIncluir}
            obterUsuariosNotificadosDiarioBordo={
              obterUsuariosNotificadosDiarioBordo
            }
            usarLocalizadorFuncionario={usarLocalizadorFuncionario}
            parametrosLocalizadorFuncionario={parametrosLocalizadorFuncionario}
            diarioBordoId={diarioBordoId}
            dreId={dreId}
            ueId={ueId}
          />
          <ObservacoesUsuarioMontarDados
            onClickSalvarEdicao={editarObservacao}
            onClickExcluir={excluirObservacao}
            verificaProprietario={verificaProprietario}
            podeAlterar={podeAlterar}
            podeExcluir={podeExcluir}
            mostrarListaNotificacao={mostrarListaNotificacao}
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
  esconderLabel: PropTypes.bool,
  esconderCaixaExterna: PropTypes.bool,
  verificaProprietario: PropTypes.bool,
  permissoes: PropTypes.oneOfType([PropTypes.object]),
  mostrarListaNotificacao: PropTypes.bool,
  obterUsuariosNotificadosDiarioBordo: PropTypes.bool,
  usarLocalizadorFuncionario: PropTypes.bool,
  parametrosLocalizadorFuncionario: PropTypes.oneOfType([PropTypes.object]),
  desabilitarBotaoNotificar: PropTypes.bool,
  diarioBordoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dreId: PropTypes.string,
  ueId: PropTypes.string,
};

ObservacoesUsuario.defaultProps = {
  editarObservacao: () => {},
  salvarObservacao: () => {},
  excluirObservacao: () => {},
  esconderLabel: false,
  esconderCaixaExterna: false,
  verificaProprietario: false,
  permissoes: { podeAlterar: true, podeIncluir: true, podeExcluir: true },
  mostrarListaNotificacao: false,
  obterUsuariosNotificadosDiarioBordo: true,
  usarLocalizadorFuncionario: false,
  parametrosLocalizadorFuncionario: {},
  desabilitarBotaoNotificar: false,
  diarioBordoId: '',
  dreId: '',
  ueId: '',
};

export default ObservacoesUsuario;
