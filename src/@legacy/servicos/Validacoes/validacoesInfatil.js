import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

const obterModalidadeFiltroPrincipal = (modalidades, turmaSelecionada) => {
  const temSomenteUmaModalidade = modalidades && modalidades.length === 1;
  let modalidadeAtual = 0;

  if (temSomenteUmaModalidade) {
    modalidadeAtual = modalidades[0].valor;
  } else {
    modalidadeAtual = turmaSelecionada && turmaSelecionada.modalidade
                      ? turmaSelecionada.modalidade
                      : ModalidadeEnum.FUNDAMENTAL;
  }
  return modalidadeAtual;
};

const ehTurmaInfantil = (modalidades, turmaSelecionada) => {
  return (
    obterModalidadeFiltroPrincipal(modalidades, turmaSelecionada) === ModalidadeEnum.INFANTIL
  );
};

export { ehTurmaInfantil, obterModalidadeFiltroPrincipal };


