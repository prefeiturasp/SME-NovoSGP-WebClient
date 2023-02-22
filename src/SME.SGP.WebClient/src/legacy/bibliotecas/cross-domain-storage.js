import createHost from 'cross-domain-storage/host';
import { obterUrlSondagem } from '~/servicos/variaveis';

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
