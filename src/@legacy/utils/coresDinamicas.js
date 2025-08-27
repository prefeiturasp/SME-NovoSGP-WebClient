/**
 * Utilitário para geração de cores dinâmicas em formato hexadecimal
 * para uso em gráficos com quantidade variável de categorias.
 */

// Paleta base de 20 cores para usar antes de gerar cores dinamicamente
const PALETA_BASE = [
  '#1976D2', // Azul
  '#512DA8', // Roxo
  '#00897B', // Verde-água
  '#FB8C00', // Laranja
  '#C2185B', // Rosa
  '#0097A7', // Ciano
  '#7B1FA2', // Roxo escuro
  '#388E3C', // Verde
  '#FFA000', // Âmbar
  '#D32F2F', // Vermelho
  '#303F9F', // Índigo
  '#689F38', // Verde-limão
  '#E64A19', // Vermelho-alaranjado
  '#5D4037', // Marrom
  '#455A64', // Azul-cinza
  '#009688', // Verde-teal
  '#F57C00', // Laranja escuro
  '#795548', // Marrom
  '#607D8B', // Azul-acinzentado
  '#3949AB'  // Índigo escuro
];

/**
 * Converte HSL para hexadecimal
 * @param {number} h - Matiz (0-360)
 * @param {number} s - Saturação (0-100)
 * @param {number} l - Luminosidade (0-100)
 * @returns {string} Valor hexadecimal
 */
const hslParaHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Gera uma lista de cores hexadecimais com base na quantidade necessária
 * @param {number} quantidade - Quantidade de cores necessárias
 * @returns {string[]} Array de cores hexadecimais
 */
export const gerarCoresDinamicas = (quantidade) => {
  // Se a quantidade for menor ou igual à paleta base, usar apenas as cores da paleta
  if (quantidade <= PALETA_BASE.length) {
    return PALETA_BASE.slice(0, quantidade);
  }
  
  // Caso precise de mais cores que a paleta base, gerar cores adicionais com HSL
  const coresDinamicas = [...PALETA_BASE]; // Começa com a paleta base
  const quantidadeExtra = quantidade - PALETA_BASE.length;
  
  // Gerar cores adicionais distribuídas pelo espectro HSL
  for (let i = 0; i < quantidadeExtra; i++) {
    // Calcula a matiz distribuída uniformemente no espectro (0-360)
    const matiz = Math.floor((360 * i) / quantidadeExtra);
    // Usa saturação e luminosidade fixas para manter consistência visual
    const saturacao = 70; // 70% de saturação
    const luminosidade = 60; // 60% de luminosidade
    
    coresDinamicas.push(hslParaHex(matiz, saturacao, luminosidade));
  }
  
  return coresDinamicas;
};
