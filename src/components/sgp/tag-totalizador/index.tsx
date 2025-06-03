import { Tag } from 'antd';
import { Base } from '~/componentes';
import React from 'react';

type TagDescricaoProps = {
  descricao?: string;
};
export const TagDescricao: React.FC<TagDescricaoProps> = ({ descricao = '' }) => {
  if (!descricao) return <></>;

  return (
    <Tag
      style={{
        backgroundColor: Base.Roxo,
        color: Base.Branco,
        padding: '0px 5px',
        fontWeight: 700,
        border: `solid 0.5px ${Base.Roxo}`,
      }}
    >
      {descricao}
    </Tag>
  );
};
