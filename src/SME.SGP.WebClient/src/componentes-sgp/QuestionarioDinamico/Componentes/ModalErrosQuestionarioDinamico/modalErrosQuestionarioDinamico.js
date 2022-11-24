import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalMultiLinhas } from '~/componentes';
import { setExibirModalErrosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';

const ModalErrosQuestionarioDinamico = () => {
  const dispatch = useDispatch();

  const exibirModalErrosEncaminhamento = useSelector(
    store => store.questionarioDinamico?.exibirModalErrosQuestionarioDinamico
  );

  const nomesSecoesComCamposObrigatorios = useSelector(
    store => store.questionarioDinamico?.nomesSecoesComCamposObrigatorios
  );

  let mensagemErro = `Existem campos obrigatórios sem preenchimentos nas seguintes seções: `;

  const onCloseErros = () => {
    dispatch(setExibirModalErrosQuestionarioDinamico(false));
  };

  const montarModal = () => {
    if (nomesSecoesComCamposObrigatorios?.length) {
      nomesSecoesComCamposObrigatorios.forEach((secaoNome, index) => {
        mensagemErro += secaoNome;
        if (index + 1 < nomesSecoesComCamposObrigatorios.length) {
          mensagemErro += ' / ';
        }
      });
    }
    return (
      <ModalMultiLinhas
        type="error"
        titulo="Atenção"
        onClose={onCloseErros}
        conteudo={[mensagemErro]}
        key="erros-encaminhamento"
        visivel={exibirModalErrosEncaminhamento}
      />
    );
  };

  return exibirModalErrosEncaminhamento ? montarModal() : <></>;
};

export default ModalErrosQuestionarioDinamico;
