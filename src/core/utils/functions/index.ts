const removerTudoQueNaoEhDigito = (value: any) => `${value}`.replace(/\D/g, '');

const maskTelefone = (value: string | number | undefined) =>
  `${value}`.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2');

const maskCEP = (value: string | number | undefined) =>
  `${value}`.replace(/^(\d{5})(\d{3})+?$/, '$1-$2');

export { maskTelefone, removerTudoQueNaoEhDigito, maskCEP };
