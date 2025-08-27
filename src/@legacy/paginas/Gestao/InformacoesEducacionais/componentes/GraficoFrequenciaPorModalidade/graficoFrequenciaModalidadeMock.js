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










import moment from 'moment';

export const gerarMockMensalNovo = () => {
  // Aqui vou gerar só alguns meses pra exemplo (fev e mar de 2024 como no JSON que você trouxe)
  // Você pode expandir se precisar.
  return [
    {
      modalidade: "Ensino Fundamental",
      ano: 2024,
      mes: 2,
      totalAulas: 25451559,
      totalAusencias: 3792003,
      percentualFrequencia: 87.21
    },
    {
      modalidade: "Educação Infantil",
      ano: 2024,
      mes: 2,
      totalAulas: 3745451,
      totalAusencias: 999561,
      percentualFrequencia: 71.78
    },
    {
      modalidade: "Educação de Jovens e Adultos",
      ano: 2024,
      mes: 2,
      totalAulas: 807515,
      totalAusencias: 317153,
      percentualFrequencia: 67.48
    },
    {
      modalidade: "Ensino Médio",
      ano: 2024,
      mes: 2,
      totalAulas: 223243,
      totalAusencias: 42077,
      percentualFrequencia: 83.34
    },
    {
      modalidade: "Infantil - Creche",
      ano: 2024,
      mes: 2,
      totalAulas: 1152,
      totalAusencias: 219,
      percentualFrequencia: 80.32
    },
       {
      modalidade: "Infantil - Pré-escola",
      ano: 2024,
      mes: 2,
      totalAulas: 1152,
      totalAusencias: 219,
      percentualFrequencia: 80.32
    },
    {
      modalidade: "Educação Infantil",
      ano: 2024,
      mes: 3,
      totalAulas: 3942767,
      totalAusencias: 1076090,
      percentualFrequencia: 71.55
    },
    {
      modalidade: "Ensino Fundamental",
      ano: 2024,
      mes: 3,
      totalAulas: 26184523,
      totalAusencias: 3256789,
      percentualFrequencia: 87.56
    },
    {
      modalidade: "Educação de Jovens e Adultos",
      ano: 2024,
      mes: 3,
      totalAulas: 845231,
      totalAusencias: 298765,
      percentualFrequencia: 64.67
    },
    {
      modalidade: "Ensino Médio",
      ano: 2024,
      mes: 3,
      totalAulas: 245678,
      totalAusencias: 38765,
      percentualFrequencia: 84.22
    },
    {
      modalidade: "Infantil - Creche",
      ano: 2024,
      mes: 2,
      totalAulas: 1152,
      totalAusencias: 219,
      percentualFrequencia: 80.32
    },
       {
      modalidade: "Infantil - Pré-escola",
      ano: 2024,
      mes: 2,
      totalAulas: 1152,
      totalAusencias: 219,
      percentualFrequencia: 80.32
    },
   
  ];
};

export const gerarMockAnualNovo = () => {
  return [
    {
      modalidade: "Educação Infantil",
      totalAulas: 47699276,
      totalAusencias: 12683195,
      totalCompensacoes: 23,
      percentualFrequencia: 72.03,
      totalAlunos: 280745
    },
    {
      modalidade: "Educação de Jovens e Adultos",
      totalAulas: 10345328,
      totalAusencias: 3963992,
      totalCompensacoes: 817131,
      percentualFrequencia: 68.96,
      totalAlunos: 22619
    },
    {
      modalidade: "Ensino Fundamental",
      totalAulas: 335787809,
      totalAusencias: 49818113,
      totalCompensacoes: 10751461,
      percentualFrequencia: 84.46,
      totalAlunos: 486981
    },
    {
      modalidade: "Ensino Médio",
      totalAulas: 3114598,
      totalAusencias: 576181,
      totalCompensacoes: 90271,
      percentualFrequencia: 83.11,
      totalAlunos: 2828
    },
    {
      modalidade: "CELP",
      totalAulas: 26821,
      totalAusencias: 7952,
      totalCompensacoes: 90,
      percentualFrequencia: 70.31,
      totalAlunos: 971
    }
  ];
};


/*    'Fundamental': 92,
    'Médio': 89,
    'CIEJA': 85,
    'Infantil - Creche': 90,
    'Infantil - Pré-escola': 88,*/ 