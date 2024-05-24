import { PerfisGuidEnum } from '@/core/enum/perfis-guid-enum';
import { cloneDeep } from 'lodash';

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

  return !!perfilValido;
};
