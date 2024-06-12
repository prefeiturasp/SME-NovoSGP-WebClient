import { PerfisGuidEnum } from '@/core/enum/perfis-guid-enum';
import { cloneDeep } from 'lodash';
import { OPCAO_TODOS } from '~/constantes';

const uuidPerfisValidosCadstroInformes = [
  PerfisGuidEnum.ATE,
  PerfisGuidEnum.ADE,
  PerfisGuidEnum.CP,
  PerfisGuidEnum.DIRETOR,
  PerfisGuidEnum.ADM_UE,
  PerfisGuidEnum.ABAE,
  PerfisGuidEnum.PAEE,
];

export const temPerfisValidosCadstroInformes = (listaPerfis, perfis) => {
  let perfilValido = false;

  if (listaPerfis?.length && perfis?.length) {
    if (perfis?.length === 1 && perfis[0] === OPCAO_TODOS) {
      perfilValido = true;
    } else {
      perfilValido = cloneDeep(listaPerfis).find(perfil => {
        const ehPerfilSelecionado = perfis.includes(String(perfil?.id));
        if (ehPerfilSelecionado) {
          const ehValido = uuidPerfisValidosCadstroInformes.includes(
            perfil?.guidPerfil
          );
          return !!ehValido;
        }
        return false;
      });
    }
  }

  return !!perfilValido;
};
