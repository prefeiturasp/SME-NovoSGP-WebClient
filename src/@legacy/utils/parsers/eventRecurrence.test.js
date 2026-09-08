import { parseScreenObject, parseDataObject } from './eventRecurrence';

const recurrenceTela = {
  dataInicio: '2024-01-01',
  dataTermino: '2024-02-01',
  diaNumero: 10,
  diasSemana: [{ valor: 1 }, { valor: 3 }],
  diaSemana: 5,
  tipoRecorrencia: { value: 2 },
  padraoRecorrencia: 1,
  quantidadeRecorrencia: 4,
};

describe('parseScreenObject', () => {
  it('mapeia campos da API para a tela', () => {
    expect(parseScreenObject(recurrenceTela)).toEqual({
      dataInicio: '2024-01-01',
      dataFim: '2024-02-01',
      diaDeOcorrencia: 10,
      diasDaSemana: [1, 3],
      padrao: 2,
      padraoRecorrenciaMensal: 1,
      repeteACada: 4,
    });
  });

  it('usa diaSemana quando a lista está vazia', () => {
    const resultado = parseScreenObject({
      ...recurrenceTela,
      diasSemana: [],
    });
    expect(resultado.diasDaSemana).toEqual([5]);
  });
});

describe('parseDataObject', () => {
  it('mapeia campos da tela para a API', () => {
    expect(
      parseDataObject({
        dataInicio: '2024-01-01',
        dataFim: '2024-02-01',
        diaDeOcorrencia: 10,
        diasSemana: [{ valor: 1 }],
        tipoRecorrencia: { value: 2 },
        padraoRecorrenciaMensal: 1,
        repeteACada: 4,
      })
    ).toEqual({
      dataInicio: '2024-01-01',
      dataTermino: '2024-02-01',
      diaNumero: 10,
      diasDaSemana: [1],
      padrao: 2,
      padraoRecorrencia: 1,
      quantidadeRecorrencia: 4,
    });
  });
});
