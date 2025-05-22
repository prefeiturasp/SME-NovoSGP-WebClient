// ServicoNota.test.js
import ServicoNota from './ServicoNotas';
import notasConceitos from '~/dtos/notasConceitos';

jest.mock('./api', () => ({
  get: jest.fn(),
}));

describe('ServicoNota', () => {
  describe('temQuantidadeMinimaAprovada', () => {
    const mockDadosBase = {
      mediaAprovacaoBimestre: 6,
      listaTiposConceitos: [
        { id: 1, aprovado: true },
        { id: 2, aprovado: false },
      ],
      alunos: [],
    };

    describe('Para notas numéricas', () => {
      it('deve retornar false quando exceder o percentual permitido', () => {
        const dados = {
          ...mockDadosBase,
          alunos: [
            {
              notasBimestre: [
                { notaConceito: 5 }, // abaixo
                { notaConceito: 7 }, // acima
              ],
            },
            {
              notasBimestre: [
                { notaConceito: 4 }, // abaixo
                { notaConceito: 5 }, // abaixo
              ],
            },
          ],
        };

        const resultado = ServicoNota.temQuantidadeMinimaAprovada(
          dados,
          50, // 50% permitido
          notasConceitos.Notas
        );

        expect(resultado).toBe(false); // 3/4 = 75% (excede)
      });

      it('deve retornar true quando estiver dentro do percentual', () => {
        const dados = {
          ...mockDadosBase,
          alunos: [
            { notasBimestre: [{ notaConceito: 6 }, { notaConceito: 7 }] },
            { notasBimestre: [{ notaConceito: 5 }, { notaConceito: 8 }] },
          ],
        };

        const resultado = ServicoNota.temQuantidadeMinimaAprovada(
          dados,
          50,
          notasConceitos.Notas
        );

        expect(resultado).toBe(true); // 1/4 = 25%
      });
    });

    describe('Para conceitos', () => {
      it('deve considerar códigos de conceito não aprovados', () => {
        const dados = {
          ...mockDadosBase,
          alunos: [
            { notasBimestre: [{ notaConceito: 2 }, { notaConceito: 1 }] },
            { notasBimestre: [{ notaConceito: 2 }] },
          ],
        };

        const resultado = ServicoNota.temQuantidadeMinimaAprovada(
          dados,
          50,
          notasConceitos.Conceitos
        );

        expect(resultado).toBe(false); // 3/3 = 100%
      });
    });

    describe('Casos especiais', () => {
      it('deve retornar true quando não houver alunos', () => {
        const dados = { ...mockDadosBase, alunos: [] };
        const resultado = ServicoNota.temQuantidadeMinimaAprovada(
          dados,
          0,
          notasConceitos.Notas
        );
        expect(resultado).toBe(true);
      });

      it('deve ignorar notas vazias', () => {
        const dados = {
          ...mockDadosBase,
          alunos: [
            {
              notasBimestre: [
                { notaConceito: null },
                { notaConceito: undefined },
              ],
            },
          ],
        };

        const resultado = ServicoNota.temQuantidadeMinimaAprovada(
          dados,
          0,
          notasConceitos.Notas
        );
        expect(resultado).toBe(true);
      });
    });
  });
});
