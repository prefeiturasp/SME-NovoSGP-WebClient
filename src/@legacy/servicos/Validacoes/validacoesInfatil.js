import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

const obterModalidadeFiltroPrincipal = (modalidades, turmaSelecionada) => {
  const temSomenteUmaModalidade = modalidades?.length === 1;
  let modalidadeAtual = 0;

  if (temSomenteUmaModalidade) {
    modalidadeAtual = modalidades[0].valor;
  } else {
    modalidadeAtual = turmaSelecionada?.modalidade
      ? Number(turmaSelecionada.modalidade)
      : ModalidadeEnum.FUNDAMENTAL;
  }
  return modalidadeAtual;
};

const ehTurmaInfantil = (modalidades, turmaSelecionada) =>
  obterModalidadeFiltroPrincipal(modalidades, turmaSelecionada) ===
  ModalidadeEnum.INFANTIL;

export { ehTurmaInfantil, obterModalidadeFiltroPrincipal };
