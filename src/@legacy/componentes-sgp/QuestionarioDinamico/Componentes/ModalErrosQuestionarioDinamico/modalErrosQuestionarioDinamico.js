import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalMultiLinhas } from '~/componentes';
import { setExibirModalErrosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';

const ModalErrosQuestionarioDinamico = ({ mensagem = '' }) => {
  const dispatch = useDispatch();

  const exibirModalErrosEncaminhamento = useSelector(
    store => store.questionarioDinamico?.exibirModalErrosQuestionarioDinamico
  );

  const nomesSecoesComCamposObrigatorios = useSelector(
    store => store.questionarioDinamico?.nomesSecoesComCamposObrigatorios
  );

  let mensagemErro =
    mensagem ||
    `Existem campos obrigatórios ou inválidos sem preenchimentos nas seguintes seções: `;

  const onCloseErros = () => {
    dispatch(setExibirModalErrosQuestionarioDinamico(false));
  };

  const montarModal = () => {
    if (!mensagem && nomesSecoesComCamposObrigatorios?.length) {
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
