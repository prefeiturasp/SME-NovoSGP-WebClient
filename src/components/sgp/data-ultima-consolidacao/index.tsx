import { Tag } from 'antd';
import dayjs from 'dayjs';
import { Base } from '~/componentes';

type TagDataUltimaConsolidacaoProps = {
  data: string;
  titulo?: string;
};
export const TagDataUltimaConsolidacao: React.FC<TagDataUltimaConsolidacaoProps> = ({
  data,
  titulo = 'Data da última atualização:',
}) => {
  if (!data) return <></>;

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
      {`${titulo} ${dayjs(data).format('DD/MM/YYYY - HH:mm')}`}
    </Tag>
  );
};
