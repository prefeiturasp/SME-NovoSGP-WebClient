import {
  validaSeObjetoEhNuloOuVazio,
  objetoEstaTodoPreenchido,
  valorNuloOuVazio,
  stringNulaOuEmBranco,
  ordenarPor,
  ordenarDescPor,
  removerNumeros,
  maskTelefone,
  maskNota,
  maskSomenteTexto,
  ordenarListaMaiorParaMenor,
  clonarObjeto,
  removerArrayAninhados,
  permiteInserirFormato,
  obterTodosMeses,
  onchangeMultiSelect,
  primeiroMaisculo,
  editorTemValor,
  removerTagsHtml,
  arredondarNota,
  verificarDataFimMaiorInicio,
  formatarFrequencia,
} from './gerais';
import { OPCAO_TODOS } from '~/constantes/constantes';

describe('validaSeObjetoEhNuloOuVazio', () => {
  it('retorna true quando todos os valores são nulos ou vazios', () => {
    expect(validaSeObjetoEhNuloOuVazio({ a: null, b: '' })).toBe(true);
  });

  it('retorna false quando algum valor está preenchido', () => {
    expect(validaSeObjetoEhNuloOuVazio({ a: 'x', b: '' })).toBe(false);
  });
});

describe('objetoEstaTodoPreenchido', () => {
  it('retorna true quando todos os valores estão preenchidos', () => {
    expect(objetoEstaTodoPreenchido({ a: '1', b: '2' })).toBe(true);
  });

  it('retorna false quando algum valor é nulo', () => {
    expect(objetoEstaTodoPreenchido({ a: '1', b: null })).toBe(false);
  });
});

describe('valorNuloOuVazio', () => {
  it('reconhece null, undefined e string vazia', () => {
    expect(valorNuloOuVazio(null)).toBe(true);
    expect(valorNuloOuVazio(undefined)).toBe(true);
    expect(valorNuloOuVazio('')).toBe(true);
    expect(valorNuloOuVazio('abc')).toBe(false);
  });
});

describe('stringNulaOuEmBranco', () => {
  it('retorna true para nulo, undefined ou só espaços', () => {
    expect(stringNulaOuEmBranco(null)).toBe(true);
    expect(stringNulaOuEmBranco('   ')).toBe(true);
    expect(stringNulaOuEmBranco('ok')).toBe(false);
  });
});

describe('ordenarPor / ordenarDescPor', () => {
  const lista = [{ nome: 'C' }, { nome: 'A' }, { nome: 'B' }];

  it('ordena crescente pela propriedade', () => {
    expect(ordenarPor([...lista], 'nome').map(i => i.nome)).toEqual([
      'A',
      'B',
      'C',
    ]);
  });

  it('ordena decrescente pela propriedade', () => {
    expect(ordenarDescPor([...lista], 'nome').map(i => i.nome)).toEqual([
      'C',
      'B',
      'A',
    ]);
  });
});

describe('máscaras e limpeza', () => {
  it('removerNumeros remove dígitos', () => {
    expect(removerNumeros('abc123def')).toBe('abcdef');
  });

  it('maskTelefone formata DDD e número', () => {
    expect(maskTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('maskNota troca ponto por vírgula', () => {
    expect(maskNota('7.5')).toBe('7,5');
  });

  it('maskSomenteTexto remove números e símbolos', () => {
    expect(maskSomenteTexto('João123!')).toBe('João');
  });
});

describe('clonarObjeto e arrays', () => {
  it('clonarObjeto gera cópia independente', () => {
    const original = { a: 1 };
    const clone = clonarObjeto(original);
    clone.a = 2;
    expect(original.a).toBe(1);
  });

  it('removerArrayAninhados achata arrays', () => {
    expect(removerArrayAninhados([1, [2, [3]], 4])).toEqual([1, 2, 3, 4]);
  });

  it('ordenarListaMaiorParaMenor ordena numericamente', () => {
    const lista = [{ qtd: 1 }, { qtd: 10 }, { qtd: 5 }];
    expect(ordenarListaMaiorParaMenor(lista, 'qtd').map(i => i.qtd)).toEqual([
      10, 5, 1,
    ]);
  });
});

describe('permiteInserirFormato', () => {
  it('retorna true quando não há restrição', () => {
    expect(permiteInserirFormato({ name: 'a.pdf' }, '')).toBe(true);
  });

  it('aceita extensão permitida', () => {
    expect(permiteInserirFormato({ name: 'arquivo.PDF' }, '.pdf,.jpg')).toBe(
      true
    );
  });

  it('rejeita extensão não permitida', () => {
    expect(permiteInserirFormato({ name: 'arquivo.exe' }, '.pdf')).toBe(false);
  });
});

describe('obterTodosMeses', () => {
  it('retorna 12 meses', () => {
    const meses = obterTodosMeses();
    expect(meses).toHaveLength(12);
    expect(meses[0]).toEqual({ numeroMes: '1', nome: 'Janeiro' });
    expect(meses[11]).toEqual({ numeroMes: '12', nome: 'Dezembro' });
  });
});

describe('onchangeMultiSelect', () => {
  it('remove opção todos quando ela já estava selecionada', () => {
    const setar = jest.fn();
    onchangeMultiSelect(['a'], [OPCAO_TODOS], setar);
    expect(setar).toHaveBeenCalledWith(['a']);
  });

  it('mantém só a opção todos quando ela é selecionada agora', () => {
    const setar = jest.fn();
    onchangeMultiSelect([OPCAO_TODOS, 'a'], ['a'], setar);
    expect(setar).toHaveBeenCalledWith([OPCAO_TODOS]);
  });
});

describe('primeiroMaisculo / tags / frequência', () => {
  it('capitaliza palavras', () => {
    expect(primeiroMaisculo('JOAO DA SILVA')).toBe('Joao Da Silva');
  });

  it('removerTagsHtml remove marcação', () => {
    expect(removerTagsHtml('<p>olá</p>')).toBe('olá');
  });

  it('formatarFrequencia adiciona percentual', () => {
    expect(formatarFrequencia(75)).toBe('75%');
    expect(formatarFrequencia('')).toBe('');
  });
});

describe('editorTemValor', () => {
  it('reconhece texto, vídeo e imagem', () => {
    expect(editorTemValor('<p>conteúdo</p>')).toBe(true);
    expect(editorTemValor('<video src="a"></video>')).toBe(true);
    expect(editorTemValor('<img src="a" />')).toBe(true);
    expect(editorTemValor('<p>   </p>')).toBe(false);
  });
});

describe('arredondarNota', () => {
  it('respeita máximo e mínimo', () => {
    expect(arredondarNota('11', { minima: 0, maxima: 10, incremento: 0.5 })).toBe(
      10
    );
    expect(arredondarNota('-1', { minima: 0, maxima: 10, incremento: 0.5 })).toBe(
      0
    );
  });

  it('arredonda decimal diferente do incremento', () => {
    expect(arredondarNota('7,3', { minima: 0, maxima: 10, incremento: 0.5 })).toBe(
      7.5
    );
    expect(arredondarNota('7,8', { minima: 0, maxima: 10, incremento: 0.5 })).toBe(
      8
    );
  });
});

describe('verificarDataFimMaiorInicio', () => {
  it('retorna true quando alguma data falta', () => {
    expect(verificarDataFimMaiorInicio(null, '01-01-2024')).toBe(true);
  });

  it('valida intervalo de datas', () => {
    expect(verificarDataFimMaiorInicio('01-01-2024', '01-02-2024')).toBe(true);
    expect(verificarDataFimMaiorInicio('01-03-2024', '01-02-2024')).toBe(false);
  });
});
