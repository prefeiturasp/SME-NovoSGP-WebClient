export default function nivelParaCor(nivel) {
  if (!nivel) return '#ccc';
  const texto = String(nivel)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  const cores = {
    alto: '#2ECC71',
    alta: '#2ECC71',
    medio: '#F1C40F',
    media: '#F1C40F',
    baixa: '#E74C3C',
    baixo: '#E74C3C',
  };
  for (const chave in cores) {
    if (texto.includes(chave)) return cores[chave];
  }
  return '#ccc';
}
