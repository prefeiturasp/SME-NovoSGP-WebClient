import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shortid from 'shortid';
import { ModalConteudoHtml, SelectComponent } from '~/componentes';
import { ROUTES } from '@/core/enum/routes';
import EventosCadastroContext from './eventosCadastroContext';

const EventosModalCopiarEvento = () => {
  const {
    setEmEdicao,
    exibirModalCopiarEvento,
    exibirModalRetornoCopiarEvento,
    listaMensagensCopiarEvento,
    setExibirModalCopiarEvento,
    setListaCalendarioParaCopiar,
    listaCalendarioParaCopiarInicial,
    setExibirModalRetornoCopiarEvento,
    listaCalendarioEscolar,
    listaCalendarioParaCopiar,
  } = useContext(EventosCadastroContext);

  const paramsRota = useParams();
  const navigate = useNavigate();
  const tipoCalendarioId = paramsRota?.tipoCalendarioId;

  const onCloseCopiarConteudo = () => {
    setExibirModalCopiarEvento(false);
  };

  const onConfirmarCopiarEvento = () => {
    setEmEdicao(true);
    onCloseCopiarConteudo();
  };

  const onCancelarCopiarEvento = () => {
    setListaCalendarioParaCopiar(listaCalendarioParaCopiarInicial);
    onCloseCopiarConteudo();
  };

  const onChangeCopiarEvento = eventos => {
    setListaCalendarioParaCopiar(eventos);
  };

  const urlTelaListagemEventos = () => {
    if (tipoCalendarioId) {
      return `${ROUTES.EVENTOS}/${tipoCalendarioId}`;
    }
    return ROUTES.EVENTOS;
  };

  const onCloseRetornoCopiarEvento = () => {
    setExibirModalRetornoCopiarEvento(false);
    navigate(urlTelaListagemEventos());
  };

  return (
    <>
      <ModalConteudoHtml
        key="copiarEvento"
        visivel={exibirModalCopiarEvento}
        onConfirmacaoPrincipal={onConfirmarCopiarEvento}
        onConfirmacaoSecundaria={onCancelarCopiarEvento}
        onClose={onCloseCopiarConteudo}
        labelBotaoPrincipal="Selecionar"
        labelBotaoSecundario="Cancelar"
        titulo="Copiar evento"
        closable={false}
        fecharAoClicarFora={false}
        fecharAoClicarEsc={false}
      >
        <SelectComponent
          id="copiar-evento-select"
          lista={listaCalendarioEscolar}
          valueOption="id"
          valueText="descricaoTipoCalendario"
          onChange={onChangeCopiarEvento}
          valueSelect={listaCalendarioParaCopiar}
          multiple
          placeholder="Selecione 1 ou mais tipos de calendários"
        />
      </ModalConteudoHtml>

      <ModalConteudoHtml
        key="retornoCopiarEvento"
        visivel={exibirModalRetornoCopiarEvento}
        onConfirmacaoSecundaria={onCloseRetornoCopiarEvento}
        onClose={onCloseRetornoCopiarEvento}
        labelBotaoSecundario="Ok"
        titulo="Cadastro de evento"
        closable={false}
        fecharAoClicarFora={false}
        fecharAoClicarEsc={false}
        esconderBotaoPrincipal
      >
        {listaMensagensCopiarEvento.map(item => (
          <p key={shortid.generate()}>
            {item.sucesso ? (
              <strong>
                <i className="fas fa-check text-success mr-2" />
                {item.mensagem}
              </strong>
            ) : (
              <strong className="text-danger">
                <i className="fas fa-times mr-3" />
                {item.mensagem}
              </strong>
            )}
          </p>
        ))}
      </ModalConteudoHtml>
    </>
  );
};

export default EventosModalCopiarEvento;
