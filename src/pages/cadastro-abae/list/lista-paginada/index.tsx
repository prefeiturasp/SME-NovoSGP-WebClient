import { ListaPaginada } from '@/@legacy/componentes';
import { SGP_TABLE_CADASTRO_ABAE } from '@/@legacy/constantes/ids/table';
import { DreUeNomeSituacaoABAEDto } from '@/core/dto/DreUeNomeSituacaoABAEDto';
import { FiltroDreIdUeIdNomeSituacaoABAEDto } from '@/core/dto/FiltroDreIdUeIdNomeSituacaoABAEDto';
import { ROUTES } from '@/core/enum/routes';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OPCAO_TODOS } from '~/constantes';

const ListaPaginadaCadastroABAE: React.FC = () => {
  const navigate = useNavigate();

  const form = Form.useFormInstance();

  const dre = useWatch('dre', form);
  const ue = useWatch('ue', form);
  const nome = useWatch('nome', form);
  const situacao = useWatch('situacao', form);

  const [filtro, setFiltro] = useState<FiltroDreIdUeIdNomeSituacaoABAEDto>();

  const columns = useMemo(() => {
    const newColumns: ColumnsType<DreUeNomeSituacaoABAEDto> = [
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

    if (ue?.value === OPCAO_TODOS) {
      newColumns.unshift({
        title: 'Unidade Escolar (UE)',
        dataIndex: 'ue',
      });
    }

    if (dre?.value === OPCAO_TODOS) {
      newColumns.unshift({
        title: 'DRE',
        dataIndex: 'dre',
      });
    }

    return newColumns;
  }, [ue, dre]);

  useEffect(() => {
    if (form.isFieldsTouched() || (dre?.value && ue?.value)) {
      form
        .validateFields()
        .then((values) => {
          const filtro: FiltroDreIdUeIdNomeSituacaoABAEDto = {
            dreId: values?.dre?.id ?? null,
            ueId: values?.ue?.id ?? null,
            nome: values?.nome,
            situacao: values?.situacao,
          };
          setFiltro({ ...filtro });
        })
        .catch(() => {
          setFiltro(undefined);
        });
    } else {
      setFiltro(undefined);
    }
  }, [ue, dre, nome, situacao]);

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
      limparDados={!filtro}
      filtroEhValido={!!filtro}
      onClick={onClickEditar}
    />
  );
};

export default ListaPaginadaCadastroABAE;
