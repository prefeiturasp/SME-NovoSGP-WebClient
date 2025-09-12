// imagemEstudanteObjectCard.js
import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Loader from '~/componentes/loader';
import { SGP_BUTTON_ALTERAR_IMAGEM } from '~/constantes/ids/button';
import { erros } from '~/servicos';
import ServicoImagemEstudante from '~/servicos/Componentes/ServicoImagemEstudante';
import ModalTrocarImagem from './modalTrocarImagem';
import { ContainerAvatar } from './styles';

// ✅ Exportar para teste
export const mapearDados = resposta => {
  const dadosMapeados = {
    uid: resposta?.codigo,
    fileBase64: resposta?.download?.item1,
    type: resposta?.download?.item2,
    name: resposta?.download?.item3,
  };
  dadosMapeados.url = `data:${dadosMapeados.type};base64,${dadosMapeados.fileBase64}`;
  return dadosMapeados;
};

const ImagemEstudanteObjectCard = ({ codigoEOL, permiteAlterarImagem }) => {
  const [dadosImagem, setDadosImagem] = useState();
  const [exibirModal, setExibirModal] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterFoto = async () => {
    setExibirLoader(true);
    const resposta = await ServicoImagemEstudante.obterImagemEstudante(
      codigoEOL
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data) {
      setDadosImagem(mapearDados(resposta.data));
    } else {
      setDadosImagem();
    }
  };

  useEffect(() => {
    if (codigoEOL) obterFoto();
  }, [codigoEOL]);

  const onClickAlterarImagem = () => {
    if (codigoEOL && !exibirLoader && permiteAlterarImagem) {
      setExibirModal(true);
    }
  };

  const fecharModal = trocouImagem => {
    if (trocouImagem) {
      setDadosImagem();
      obterFoto();
    }
    setExibirModal(!exibirModal);
  };

  return (
    <>
      <ModalTrocarImagem
        exibirModal={exibirModal}
        onCloseModal={fecharModal}
        codigoEOL={codigoEOL}
        dadosImagem={dadosImagem}
      />
      <ContainerAvatar
        className="mr-3"
        onClick={onClickAlterarImagem}
        data-testid="SGP_BUTTON_ALTERAR_IMAGEM"
        cursor={permiteAlterarImagem ? 'pointer' : 'initial'}
      >
        <Loader loading={exibirLoader} tip="">
          <Avatar alt="avatar">
            {dadosImagem?.url ? (
              <img
                src={dadosImagem.url}
                alt={dadosImagem.name || 'Imagem estudante'}
              />
            ) : (
              <i className="far fa-user" />
            )}
          </Avatar>
          {codigoEOL && permiteAlterarImagem && (
            <div className="desc-alterar-imagem">Alterar imagem</div>
          )}
        </Loader>
      </ContainerAvatar>
    </>
  );
};

ImagemEstudanteObjectCard.propTypes = {
  codigoEOL: PropTypes.string,
  permiteAlterarImagem: PropTypes.bool,
};

ImagemEstudanteObjectCard.defaultProps = {
  codigoEOL: '',
  permiteAlterarImagem: true,
};

export default ImagemEstudanteObjectCard;
