import tipoAula from './tipoAula';
import periodo from './periodo';
import tipoPermissao from './tipoPermissao';
import notificacaoStatus from './notificacaoStatus';
import tipoQuestao from './tipoQuestao';
import situacaoAEE from './situacaoAEE';
import situacaoNAAPA from './situacaoNAAPA';
import notasConceitos from './notasConceitos';
import tipoNota from './tipoNota';
import eventoLetivo from './eventoLetivo';

describe('dtos enumerados', () => {
  it('expõe valores esperados', () => {
    expect(tipoAula.Normal).toBe(1);
    expect(periodo.Anual).toBe(1);
    expect(tipoPermissao.podeConsultar).toBe('podeConsultar');
    expect(notificacaoStatus.Pendente).toBe(1);
    expect(tipoQuestao.Frase).toBe(1);
    expect(situacaoAEE.Rascunho).toBe(1);
    expect(situacaoNAAPA.Encerrado).toBe(4);
    expect(notasConceitos.Notas).toBe(1);
    expect(tipoNota.conceito).toBe('2');
    expect(eventoLetivo.Sim).toBe(1);
  });
});
