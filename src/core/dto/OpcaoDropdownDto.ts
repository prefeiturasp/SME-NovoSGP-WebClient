import { DefaultOptionType } from 'antd/es/select';

export type OpcaoDropdownDto = {
  valor?: string;
  descricao?: string;
} & DefaultOptionType;
