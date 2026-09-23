import {
  removerTudoQueNaoEhDigito,
  removerNumeros,
  maskTelefone,
  maskCEP,
  formatarData,
  formatarDataHora,
  onChangeMultiSelectLabelInValueOpcaoTodos,
  desabilitarAnosPassadosFuturos,
} from './index';
import { OPCAO_TODOS } from '~/constantes';
import { dayjs } from '@/core/date/dayjs';

describe('funções de máscara', () => {
  it('removerTudoQueNaoEhDigito', () => {
    expect(removerTudoQueNaoEhDigito('a1b2c3')).toBe('123');
  });

  it('removerNumeros', () => {
    expect(removerNumeros('abc123')).toBe('abc');
  });

  it('maskTelefone formata e retorna vazio sem dígitos', () => {
    expect(maskTelefone('11987654321')).toBe('(11) 98765-4321');
    expect(maskTelefone('')).toBe('');
  });

  it('maskCEP formata 8 dígitos', () => {
    expect(maskCEP('01310100')).toBe('01310-100');
  });
});

describe('formatação de data', () => {
  it('formatarData retorna vazio sem data', () => {
    expect(formatarData(undefined)).toBe('');
  });

  it('formatarData formata ISO', () => {
    expect(formatarData('2024-06-15')).toBe('15/06/2024');
  });

  it('formatarDataHora formata data e hora', () => {
    expect(formatarDataHora('2024-06-15T14:30:00')).toContain('15/06/2024');
  });
});

describe('onChangeMultiSelectLabelInValueOpcaoTodos', () => {
  const todos = { value: OPCAO_TODOS, label: 'Todos' };

  it('remove opção todos quando ela já estava selecionada', () => {
    const resultado = onChangeMultiSelectLabelInValueOpcaoTodos(
      [{ value: 'a' }],
      [todos]
    );
    expect(resultado).toEqual([{ value: 'a' }]);
  });

  it('mantém só a opção todos quando ela é selecionada agora', () => {
    const resultado = onChangeMultiSelectLabelInValueOpcaoTodos(
      [todos, { value: 'a' }],
      [{ value: 'a' }]
    );
    expect(resultado).toEqual([todos]);
  });
});

describe('desabilitarAnosPassadosFuturos', () => {
  it('retorna false sem data', () => {
    expect(desabilitarAnosPassadosFuturos()).toBe(false);
  });

  it('desabilita data de outro ano letivo', () => {
    expect(desabilitarAnosPassadosFuturos(dayjs('2020-01-15'), 2024)).toBe(true);
    expect(desabilitarAnosPassadosFuturos(dayjs('2024-06-15'), 2024)).toBe(false);
  });
});
