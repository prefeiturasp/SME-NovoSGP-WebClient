import alertas from './reducers';
import { alertaConfirmar, alertaFechar } from './actions';

describe('reducer de alertas - confirmação', () => {
  const resolve = jest.fn();

  it('abre a confirmação com a ordem padrão dos botões quando inverterBotoes não é informado', () => {
    const estado = alertas(
      undefined,
      alertaConfirmar('Atenção', '', 'Deseja continuar?', resolve)
    );

    expect(estado.confirmacao.visivel).toBe(true);
    expect(estado.confirmacao.inverterBotoes).toBeFalsy();
    expect(estado.confirmacao.textoOk).toBe('Sim');
    expect(estado.confirmacao.textoCancelar).toBe('Não');
  });

  it('guarda inverterBotoes quando informado', () => {
    const estado = alertas(
      undefined,
      alertaConfirmar(
        'Atenção',
        '',
        'Deseja continuar?',
        resolve,
        undefined,
        undefined,
        undefined,
        true
      )
    );

    expect(estado.confirmacao.inverterBotoes).toBe(true);
  });

  it('não mantém inverterBotoes para a próxima confirmação depois de fechar', () => {
    const aberto = alertas(
      undefined,
      alertaConfirmar(
        'Atenção',
        '',
        'Deseja continuar?',
        resolve,
        undefined,
        undefined,
        undefined,
        true
      )
    );
    const fechado = alertas(aberto, alertaFechar());
    const reaberto = alertas(
      fechado,
      alertaConfirmar('Atenção', '', 'Outra pergunta?', resolve)
    );

    expect(fechado.confirmacao.visivel).toBe(false);
    expect(fechado.confirmacao.inverterBotoes).toBeFalsy();
    expect(reaberto.confirmacao.inverterBotoes).toBeFalsy();
  });
});
