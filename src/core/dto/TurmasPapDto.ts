import { DefaultOptionType } from 'antd/es/select';

export interface TurmasPapDto extends DefaultOptionType {
  codigoTurma: number;
  turmaNome: string;
}
