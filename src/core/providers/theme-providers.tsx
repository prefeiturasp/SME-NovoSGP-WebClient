import { ThemeProvider } from 'styled-components';
import { theme } from 'antd';
import React from 'react';
import { SGPTheme } from '../config/theme';

export default ({ children }: React.PropsWithChildren) => {
  const { token } = theme.useToken();
  return <ThemeProvider theme={{ antd: token, colors: SGPTheme.colors }}>{children}</ThemeProvider>;
};
