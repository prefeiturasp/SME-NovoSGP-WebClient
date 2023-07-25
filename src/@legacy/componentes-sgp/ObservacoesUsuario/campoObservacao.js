import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '~/componentes';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import {
  SGP_BUTTON_ABRIR_MODAL_NOTIFICAR_USUARIOS,
  SGP_BUTTON_CANCELAR_OBSERVACAO,
  SGP_BUTTON_SALVAR_OBSERVACAO,
} from '~/constantes/ids/button';
import { SGP_TEXT_AREA_OBSERVACAO } from '~/constantes/ids/text-area';
import { ModalNotificarUsuarios } from '~/paginas/DiarioClasse/DiarioBordo/componentes';
import {
  setNovaObservacao,
  setListaUsuariosNotificacao,
} from '~/redux/modulos/observacoesUsuario/actions';
import { confirmar } from '~/servicos/alertas';
import { ContainerCampoObservacao } from './observacoesUsuario.css';

const CampoObservacao = props => {
  const {
    salvarObservacao,
    esconderCaixaExterna,
    obterUsuariosNotificar,
    carregarListaUsuariosNotificar,
    mostrarBotaoNotificar,
    podeIncluir,
    usarLocalizadorFuncionario,
    parametrosLocalizadorFuncionario,
    desabilitarBotaoNotificar,
    dreId,
    ueId,
    mudarObservacao,
  } = props;
  const [modalVisivel, setModalVisivel] = useState(false);

  const dispatch = useDispatch();

  const observacaoEmEdicao = useSelector(
    store => store.observacoesUsuario.observacaoEmEdicao
  );

  const novaObservacao = useSelector(
    store => store.observacoesUsuario.novaObservacao
  );

  const listaUsuarios = useSelector(
    store => store.observacoesUsuario.listaUsuariosNotificacao
  );

  const onChangeNovaObservacao = ({ target: { value } }) => {
    mudarObservacao(value);
    dispatch(setNovaObservacao(value));
  };

  const onClickCancelarNovo = async () => {
    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );

    if (confirmou) {
      dispatch(setNovaObservacao(''));
    }
  };

  const obterListaUsuariosNotificar = async () => {
    if (obterUsuariosNotificar) {
      const retornoUsuarios = await obterUsuariosNotificar();

      if (retornoUsuarios?.status === 200) {
        dispatch(setListaUsuariosNotificacao(retornoUsuarios.data));
      }
    } else {
      dispatch(setListaUsuariosNotificacao([]));
    }
  };

  const onClickSalvar = async () => {
    const retorno = await salvarObservacao({ observacao: novaObservacao });

    if (retorno?.status === 200) {
      dispatch(setNovaObservacao(''));
      obterListaUsuariosNotificar();
    }
  };

  useEffect(() => {
    if (
      !listaUsuarios?.length &&
      obterListaUsuariosNotificar &&
      carregarListaUsuariosNotificar
    ) {
      obterListaUsuariosNotificar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaUsuarios, carregarListaUsuariosNotificar]);

  return (
    <>
      <div className={`col-md-12 pb-2 ${esconderCaixaExterna && 'p-0'}`}>
        <Label text="Escreva uma observação" />
        <ContainerCampoObservacao
          id={SGP_TEXT_AREA_OBSERVACAO}
          autoSize={{ minRows: 4 }}
          value={novaObservacao}
          onChange={onChangeNovaObservacao}
          disabled={!!observacaoEmEdicao || !podeIncluir}
        />
      </div>
      <div
        className="row pb-4 d-flex justify-content-between"
        style={{ margin: `${esconderCaixaExterna ? 0 : 15}px` }}
      >
        {mostrarBotaoNotificar && (
          <div className="d-flex justify-content-center p-0">
            <Button
              height="30px"
              id={SGP_BUTTON_ABRIR_MODAL_NOTIFICAR_USUARIOS}
              label={`Notificar usuários (${listaUsuarios?.length})`}
              icon="bell"
              color={Colors.Azul}
              border
              onClick={() => setModalVisivel(true)}
              disabled={
                !!observacaoEmEdicao ||
                !podeIncluir ||
                desabilitarBotaoNotificar
              }
            />
          </div>
        )}

        <div
          className={`d-flex justify-content-end p-0 ${
            mostrarBotaoNotificar ? '' : 'w-100'
          }`}
        >
          <Button
            id={SGP_BUTTON_CANCELAR_OBSERVACAO}
            label="Cancelar"
            color={Colors.Roxo}
            border
            bold
            className="mr-3"
            onClick={onClickCancelarNovo}
            height="30px"
            disabled={!novaObservacao || !podeIncluir}
          />

          <Button
            id={SGP_BUTTON_SALVAR_OBSERVACAO}
            label="Salvar"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickSalvar}
            height="30px"
            disabled={!novaObservacao || !podeIncluir}
          />
        </div>
      </div>
      {modalVisivel && (
        <ModalNotificarUsuarios
          modalVisivel={modalVisivel}
          setModalVisivel={setModalVisivel}
          listaUsuarios={listaUsuarios}
          somenteConsulta={!podeIncluir}
          desabilitado={!novaObservacao || !podeIncluir}
          usarLocalizadorFuncionario={usarLocalizadorFuncionario}
          parametrosLocalizadorFuncionario={parametrosLocalizadorFuncionario}
          dreId={dreId}
          ueId={ueId}
        />
      )}
    </>
  );
};

CampoObservacao.propTypes = {
  salvarObservacao: PropTypes.func,
  obterUsuariosNotificar: PropTypes.func,
  carregarListaUsuariosNotificar: PropTypes.bool,
  esconderCaixaExterna: PropTypes.bool,
  mostrarBotaoNotificar: PropTypes.bool,
  podeIncluir: PropTypes.bool,
  usarLocalizadorFuncionario: PropTypes.bool,
  parametrosLocalizadorFuncionario: PropTypes.oneOfType([PropTypes.object]),
  desabilitarBotaoNotificar: PropTypes.bool,
  mudarObservacao: PropTypes.func,
  dreId: PropTypes.string,
  ueId: PropTypes.string,
};

CampoObservacao.defaultProps = {
  salvarObservacao: () => {},
  obterUsuariosNotificar: () => {},
  carregarListaUsuariosNotificar: false,
  esconderCaixaExterna: false,
  mostrarBotaoNotificar: true,
  podeIncluir: true,
  usarLocalizadorFuncionario: false,
  parametrosLocalizadorFuncionario: {},
  desabilitarBotaoNotificar: false,
  mudarObservacao: () => {},
  dreId: '',
  ueId: '',
};

export default CampoObservacao;
