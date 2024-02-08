import { ListaPaginada } from '@/@legacy/componentes';
import { SGP_TABLE_REGISTRO_COLETIVO } from '@/@legacy/constantes/ids/table';
import { URL_API_REGISTRO_COLETIVO } from '@/core/constants/urls-api';
import { dayjs } from '@/core/date/dayjs';
import { ROUTES } from '@/core/enum/routes';
import { Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OPCAO_TODOS } from '~/constantes';

export const ListaPaginadaRegistroColetivo: React.FC = () => {
  const navigate = useNavigate();

  const form = Form.useFormInstance();

  const anoLetivo = useWatch('anoLetivo', form);
  const dre = useWatch('dre', form);
  const ue = useWatch('ue', form);
  const dataInicio = useWatch('dataInicio', form);
  const dataFim = useWatch('dataFim', form);
  const tipoReuniao = useWatch('tipoReuniao', form);

  const [filtro, setFiltro] = useState<any>();

  const columns = useMemo(() => {
    const newColumns: ColumnsType<any> = [
      {
        title: 'Data da reunião',
        dataIndex: 'dataReuniao',
      },
      {
        title: 'Tipo de reunião',
        dataIndex: 'tipoReuniao',
      },
      {
        title: 'Criado por',
        dataIndex: 'criadoPor',
      },
    ];

    if (ue?.value === OPCAO_TODOS) {
      newColumns.unshift({
        title: 'Unidade Escolar (UE)',
        dataIndex: 'ue',
      });
    }

    return newColumns;
  }, [ue]);

  useEffect(() => {
    const temValoresIniciais = anoLetivo && dre?.id && ue?.value;

    if (form.isFieldsTouched() || temValoresIniciais) {
      form.validateFields().then((values) => {
        const filtro: any = {
          anoLetivo: values?.anoLetivo?.value,
          dreId: values?.dre?.id,
          ueId: values?.ue?.id,
          tipoReuniao: values?.tipoReuniao,
        };

        if (values?.dataInicio) {
          filtro.dataInicio = dayjs(values.dataInicio).format('YYYY-MM-DD');
        }

        if (values?.dataFim) {
          filtro.dataFim = dayjs(values.dataFim).format('YYYY-MM-DD');
        }

        setFiltro({ ...filtro });
      });
    }
  }, [form, anoLetivo, dre, ue, dataInicio, dataFim, tipoReuniao]);

  const onClickEditar = (row: any) =>
    navigate(`${ROUTES.NAAPA_REGISTRO_COLETIVO}/${row.id}`, {
      replace: true,
    });

  return (
    <ListaPaginada
      url={URL_API_REGISTRO_COLETIVO}
      id={SGP_TABLE_REGISTRO_COLETIVO}
      colunas={columns}
      filtro={filtro}
      filtroEhValido={!!filtro?.ueId}
      onClick={onClickEditar}
    />
  );
};
