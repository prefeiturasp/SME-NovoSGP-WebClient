import { Base } from '@/@legacy/componentes';
import { ThemeConfig } from 'antd';
import { Colors } from '../styles/colors';

export type ThemeConfigCustomColors = {
  colors: {
    colorPrimaryDark: string;
  };
};

export type ThemeConfigCustomButton = {
  components: {
    Button?: {
      defaultHoverColor: string;
    };
  };
};

export type ThemeConfigSME = ThemeConfigCustomColors & ThemeConfig & ThemeConfigCustomButton;

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
    colorError: Colors.ERROR,
  },
  components: {
    Button: {
      defaultHoverColor: Colors.BLUE,
    },
    Form: {
      paddingXS: 2,
    },
    Select: {
      controlItemBgActive: Base.Roxo,
      controlItemBgHover: Base.Roxo,
    },
    Modal: {
      zIndexPopupBase: 9999,
    },
  },
};
