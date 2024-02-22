import { Base, ListaPaginada } from '@/@legacy/componentes';
import { SGP_TABLE_REGISTRO_COLETIVO } from '@/@legacy/constantes/ids/table';
import { URL_API_REGISTRO_COLETIVO } from '@/core/constants/urls-api';
import { dayjs } from '@/core/date/dayjs';
import { FiltroRegistroColetivoDto } from '@/core/dto/FiltroRegistroColetivoDto';
import { RegistroColetivoListagemDto } from '@/core/dto/RegistroColetivoListagemDto';
import { ROUTES } from '@/core/enum/routes';
import { Col, Form, Row, Tag } from 'antd';
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
  const tiposReuniaoId = useWatch('tiposReuniaoId', form);

  const [filtro, setFiltro] = useState<FiltroRegistroColetivoDto>();

  const columns = useMemo(() => {
    const newColumns: ColumnsType<RegistroColetivoListagemDto> = [
      {
        title: 'Data da reunião',
        dataIndex: 'dataReuniao',
        render: (dataReuniao: string) =>
          dataReuniao ? dayjs(dataReuniao).format('DD/MM/YYYY') : '',
      },
      {
        title: 'Tipo de reunião',
        dataIndex: 'tipoReuniaoDescricao',
      },
      {
        title: 'Criado por',
        dataIndex: 'criadoPor',
      },
    ];

    if (ue?.value === OPCAO_TODOS) {
      newColumns.unshift({
        title: 'Unidade Escolar (UE)',
        dataIndex: 'nomesUe',
        render: (nomesUe: string[]) => {
          if (!nomesUe?.length) return <></>;

          return (
            <Col>
              <Row gutter={[8, 8]}>
                {nomesUe.map((nomeUe, i) => (
                  <Tag style={{ backgroundColor: Base.Branco }} key={i}>
                    {nomeUe}
                  </Tag>
                ))}
              </Row>
            </Col>
          );
        },
      });
    }

    return newColumns;
  }, [ue]);

  useEffect(() => {
    const temValoresIniciais = anoLetivo && dre?.id && ue?.value;

    if (form.isFieldsTouched() || temValoresIniciais) {
      form
        .validateFields()
        .then((values) => {
          const filtro: FiltroRegistroColetivoDto = {
            dreId: values?.dre?.id,
            ueId: values?.ue?.id,
            tiposReuniaoId: values?.tiposReuniaoId,
          };

          if (values?.dataInicio) {
            filtro.dataReuniaoInicio = dayjs(values.dataInicio).format('YYYY-MM-DD');
          }

          if (values?.dataFim) {
            filtro.dataReuniaoFim = dayjs(values.dataFim).format('YYYY-MM-DD');
          }

          setFiltro({ ...filtro });
        })
        .catch(() => {
          setFiltro(undefined);
        });
    } else {
      setFiltro(undefined);
    }
  }, [form, anoLetivo, dre, ue, dataInicio, dataFim, tiposReuniaoId]);

  const onClickEditar = (row: RegistroColetivoListagemDto) =>
    navigate(`${ROUTES.NAAPA_REGISTRO_COLETIVO}/${row.id}`, {
      replace: true,
    });

  return (
    <ListaPaginada
      url={URL_API_REGISTRO_COLETIVO}
      id={SGP_TABLE_REGISTRO_COLETIVO}
      colunas={columns}
      filtro={filtro}
      limparDados={!filtro}
      filtroEhValido={!!filtro}
      onClick={onClickEditar}
    />
  );
};
