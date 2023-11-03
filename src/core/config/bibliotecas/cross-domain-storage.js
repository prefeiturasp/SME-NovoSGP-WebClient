import { obterUrlSondagem } from '~/servicos/variaveis';

import createHost from 'cross-domain-storage/host';

const newHost = () => {
  const origin = obterUrlSondagem;
  return createHost([
    {
      origin,
      allowedMethods: ['get'],
    },
  ]);
};

export default newHost();
