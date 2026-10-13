import {
  obterModalidadeFiltroPrincipal,
  ehTurmaInfantil,
} from './validacoesInfatil';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

describe('obterModalidadeFiltroPrincipal', () => {
  it('usa a única modalidade da lista', () => {
    expect(
      obterModalidadeFiltroPrincipal([{ valor: ModalidadeEnum.EJA }], {})
    ).toBe(ModalidadeEnum.EJA);
  });

  it('usa a modalidade da turma quando há mais de uma', () => {
    expect(
      obterModalidadeFiltroPrincipal(
        [{ valor: 1 }, { valor: 5 }],
        { modalidade: ModalidadeEnum.MEDIO }
      )
    ).toBe(ModalidadeEnum.MEDIO);
  });

  it('assume Fundamental quando não há turma', () => {
    expect(obterModalidadeFiltroPrincipal([{ valor: 1 }, { valor: 5 }])).toBe(
      ModalidadeEnum.FUNDAMENTAL
    );
  });
});

describe('ehTurmaInfantil', () => {
  it('retorna true para infantil', () => {
    expect(
      ehTurmaInfantil([{ valor: ModalidadeEnum.INFANTIL }], {})
    ).toBe(true);
  });

  it('retorna false para outras modalidades', () => {
    expect(ehTurmaInfantil([{ valor: ModalidadeEnum.MEDIO }], {})).toBe(false);
  });
});
