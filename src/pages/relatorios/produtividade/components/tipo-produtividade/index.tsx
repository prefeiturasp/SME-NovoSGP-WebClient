import {
  TipoRelatorioProdutividadeFrequenciaEnum,
  TipoRelatorioProdutividadeFrequenciaEnumDisplay,
} from '@/core/enum/tipo-relatorio-produtividade-frequencia-enum';
import { Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import Select from '@/components/lib/inputs/select';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useEffect } from 'react';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_SELECT_TIPO_REL_PRODUTIVIDADE } from '~/constantes/ids/select';

export const SelectTipoRelatorioFrequenciaProdutividade: React.FC = () => {
  const form = useFormInstance();
  const ue = useWatch('ue');

  useEffect(() => {
    form.setFieldValue('tipoRelatorioProdutividade', undefined);
  }, [ue, form]);

  const lista: DefaultOptionType[] = [
    {
      label:
        TipoRelatorioProdutividadeFrequenciaEnumDisplay[
          TipoRelatorioProdutividadeFrequenciaEnum.MediaPorUE
        ],
      value: TipoRelatorioProdutividadeFrequenciaEnum.MediaPorUE,
    },
    {
      label:
        TipoRelatorioProdutividadeFrequenciaEnumDisplay[
          TipoRelatorioProdutividadeFrequenciaEnum.MediaPorProfessor
        ],
      value: TipoRelatorioProdutividadeFrequenciaEnum.MediaPorProfessor,
    },
    {
      label:
        TipoRelatorioProdutividadeFrequenciaEnumDisplay[
          TipoRelatorioProdutividadeFrequenciaEnum.Analitico
        ],
      value: TipoRelatorioProdutividadeFrequenciaEnum.Analitico,
      disabled: ue?.value === OPCAO_TODOS,
    },
  ];

  return (
    <Form.Item
      label="Tipo de Relatório"
      rules={[{ required: true }]}
      name="tipoRelatorioProdutividade"
    >
      <Select
        options={lista}
        disabled={!ue?.value}
        placeholder="Tipo Relatório"
        id={SGP_SELECT_TIPO_REL_PRODUTIVIDADE}
      />
    </Form.Item>
  );
};
