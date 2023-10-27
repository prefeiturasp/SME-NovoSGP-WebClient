import { ListaPaginada } from '@/@legacy/componentes';
import { SGP_TABLE_CADASTRO_ABAE } from '@/@legacy/constantes/ids/table';
import { DreUeNomeSituacaoABAEDto } from '@/core/dto/DreUeNomeSituacaoABAEDto';
import { FiltroDreIdUeIdNomeSituacaoABAEDto } from '@/core/dto/FiltroDreIdUeIdNomeSituacaoABAEDto';
import { ROUTES } from '@/core/enum/routes';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListaPaginadaCadastroABAE: React.FC = () => {
  const navigate = useNavigate();

  const form = Form.useFormInstance();

  const ue = useWatch('ue', form);
  const nome = useWatch('nome', form);
  const situacao = useWatch('situacao', form);

  const [filtro, setFiltro] = useState<FiltroDreIdUeIdNomeSituacaoABAEDto>();

  const columns: ColumnsType<DreUeNomeSituacaoABAEDto> = [
    {
      title: 'DRE',
      dataIndex: 'dre',
    },
    {
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ue',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      render: (situacao: boolean) => (situacao ? 'Ativo' : 'Inativo'),
    },
  ];

  useEffect(() => {
    if (form.isFieldsTouched()) {
      form.validateFields().then((values) => {
        const filtro: FiltroDreIdUeIdNomeSituacaoABAEDto = {
          ueId: values?.ue?.id,
          nome: '',
          situacao: values?.situacao,
        };

        setFiltro({ ...filtro });
      });
    }
  }, [ue, nome, situacao]);

  const onClickEditar = (row: DreUeNomeSituacaoABAEDto) =>
    navigate(`${ROUTES.CADASTRO_ABAE}/${row.id}`, {
      replace: true,
    });

  return (
    <ListaPaginada
      url="v1/abae"
      id={SGP_TABLE_CADASTRO_ABAE}
      colunas={columns}
      filtro={filtro}
      filtroEhValido={!!filtro?.ueId}
      onClick={onClickEditar}
    />
  );
};

export default ListaPaginadaCadastroABAE;
