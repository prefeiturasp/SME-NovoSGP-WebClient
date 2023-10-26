import { Base } from '@/@legacy/componentes';
import { ThemeConfig } from 'antd';

export type ThemeConfigSME = {
  colors: {
    colorPrimaryDark: string;
  };
} & ThemeConfig;

export const SGPTheme: ThemeConfigSME = {
  colors: {
    colorPrimaryDark: Base.RoxoDark,
  },
  token: {
    colorPrimary: Base.Roxo,
    colorText: Base.CinzaMako,
    fontFamily: 'Roboto',
    borderRadius: 4,
    controlHeight: 38,
    colorTextPlaceholder: Base.CinzaDivisor,
  },
  components: {
    Select: {
      controlItemBgActive: Base.Roxo,
      controlItemBgHover: Base.Roxo,
    },
  },
};
