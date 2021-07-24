import { Tooltip } from 'antd';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import Loader from '~/componentes/loader';
import { confirmar, erros } from '~/servicos/alertas';
import ServicoMuralGoogleSalaAula from '~/servicos/Paginas/MuralGoogleSalaAula/ServicoMuralGoogleSalaAula';
import { ContainerCampoObservacao } from '../ObservacoesUsuario/observacoesUsuario.css';
import { ContainerBotoes } from '../RegistroIndividual/registrosAnteriores/registrosAnterioresConteudo/item/item.css';

const CampoMensagem = props => {
  const { item, podeAlterar } = props;

  const [modoEdicao, setModoEdicao] = useState(false);
  const [mensagemEditada, setMensagemEditada] = useState(item.mensagem);
  const [exibirLoader, setExibirLoader] = useState(false);

  const onClickEditar = () => {
    setModoEdicao(true);
  };

  const onClickSalvar = async () => {
    setExibirLoader(true);
    const resultado = await ServicoMuralGoogleSalaAula.editarMensagem(
      item.id,
      mensagemEditada
    )
      .catch(e => erros(e))
      .finally(setExibirLoader(false));

    if (resultado?.status === 200) {
      item.mensagem = mensagemEditada;
      setModoEdicao(false);
    }
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        setModoEdicao(false);
        setMensagemEditada(item.mensagem);
      }
    }
  };

  const onChangeObs = ({ target: { value } }) => {
    setMensagemEditada(value);
  };

  const btnSalvarCancelar = () => {
    return (
      <div className="d-flex">
        <Button
          id="btn-cancelar"
          label="Cancelar"
          color={Colors.Roxo}
          border
          bold
          className="mr-3"
          onClick={onClickCancelar}
          height="30px"
        />
        <Button
          id="btn-salvar"
          label="Salvar"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickSalvar}
          height="30px"
        />
      </div>
    );
  };

  const btnEditar = () => {
    return (
      <Tooltip title={podeAlterar ? 'Editar' : ''}>
        <span>
          <Button
            id="btn-editar"
            icon="edit"
            iconType="far"
            color={Colors.Azul}
            border
            className="btn-acao"
            onClick={onClickEditar}
            height="30px"
            width="30px"
            disabled={!podeAlterar}
          />
        </span>
      </Tooltip>
    );
  };

  const dadosCabecalho = () => {
    return (
      <>
        <div>
          {`Data/Hora da publicação: ${
            item?.dataPublicacao
              ? moment(item.dataPublicacao).format('DD/MM/YYYY HH:mm')
              : ''
          }`}
        </div>
        <div>{item?.email}</div>
      </>
    );
  };

  return (
    <Loader loading={exibirLoader}>
      <div className="row">
        <div className="col-md-12 mb-2">
          {modoEdicao ? (
            <>
              {dadosCabecalho()}
              <ContainerCampoObservacao
                id="editando-mensagem"
                autoSize={{ minRows: 3 }}
                value={mensagemEditada}
                onChange={onChangeObs}
              />
            </>
          ) : (
            <>
              {dadosCabecalho()}
              <ContainerCampoObservacao
                id="editando-somente-leitura"
                style={{ cursor: 'not-allowed' }}
                className="col-md-12"
                readOnly
                autoSize={{ minRows: 3 }}
                value={item?.mensagem}
              />
            </>
          )}
        </div>
        <ContainerBotoes className="col-md-12 d-flex justify-content-end">
          {modoEdicao ? btnSalvarCancelar() : btnEditar()}
        </ContainerBotoes>
      </div>
    </Loader>
  );
};

CampoMensagem.propTypes = {
  item: PropTypes.oneOfType(PropTypes.object),
  podeAlterar: PropTypes.bool,
};

CampoMensagem.defaultProps = {
  item: {},
  podeAlterar: true,
};

export default CampoMensagem;
