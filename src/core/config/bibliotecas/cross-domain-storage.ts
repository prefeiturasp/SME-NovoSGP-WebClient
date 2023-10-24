import { obterUrlSondagem } from '~/servicos/variaveis';

const createHost = require('cross-domain-storage/host');

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
