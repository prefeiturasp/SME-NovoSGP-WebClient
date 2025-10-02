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
  '#3949AB', // Índigo escuro
];

const hslParaHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const gerarCoresDinamicas = quantidade => {
  if (quantidade <= PALETA_BASE.length) {
    return PALETA_BASE.slice(0, quantidade);
  }

  const coresDinamicas = [...PALETA_BASE];
  const quantidadeExtra = quantidade - PALETA_BASE.length;

  for (let i = 0; i < quantidadeExtra; i++) {
    const matiz = Math.floor((360 * i) / quantidadeExtra);
    const saturacao = 70;
    const luminosidade = 60;

    coresDinamicas.push(hslParaHex(matiz, saturacao, luminosidade));
  }

  return coresDinamicas;
};
