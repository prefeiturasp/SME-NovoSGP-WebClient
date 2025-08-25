const NOMES_MODALIDADES = [
  'Fundamental',
  'Médio',
  'CIEJA',
  'Infantil - Creche',
  'Infantil - Pré-escola',
];

export const gerarMockMensal = () => {
  const agora = moment();
  const ano = agora.year();
  const mesAtual = agora.month(); // 0-11
  const baseValores = {
    'Fundamental': 92,
    'Médio': 89,
    'CIEJA': 85,
    'Infantil - Creche': 90,
    'Infantil - Pré-escola': 88,
  };
  const dadosLongos = [];
  for (let m = 0; m <= mesAtual; m += 1) {
    const nomeMes = moment(`${ano}-${m + 1}-01`).format('MMMM'); // nome do mês capitalizado pela locale
    NOMES_MODALIDADES.forEach(mod => {
      const variacao = (Math.sin((m + 1) * 1.3 + mod.length) * 1.2) + (mod.length % 3) * 0.4;
      const valor = Math.min(100, Math.max(75, baseValores[mod] + variacao));
      dadosLongos.push({
        mes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1),
        modalidade: mod,
        valor: Number(valor.toFixed(1)),
      });
    });
  }
  return dadosLongos;
};

export const gerarMockAnual = (dadosMensais) => {
  const agrupado = {};
  dadosMensais.forEach(r => {
    agrupado[r.modalidade] = agrupado[r.modalidade] || { soma: 0, qtd: 0 };
    agrupado[r.modalidade].soma += r.valor;
    agrupado[r.modalidade].qtd += 1;
  });
  return Object.keys(agrupado).map(mod => ({
    modalidade: mod,
    valor: Number((agrupado[mod].soma / agrupado[mod].qtd).toFixed(1)),
  }));
};
