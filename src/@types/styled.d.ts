import { ThemeConfigSME } from '@/core/config/theme';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeConfigSME {}
}
