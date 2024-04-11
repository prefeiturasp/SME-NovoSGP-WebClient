import { SGP_SELECT_PARECER_CONCLUSIVO } from '@/@legacy/constantes/ids/select';
import { SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';

import Select from '@/components/lib/inputs/select';
import { ParecerConclusivoDto } from '@/core/dto/ParecerConclusivoDto';
import conselhoClasseService from '@/core/services/conselho-classe-service';

type SelectParecerConclusivoProps = {
  turmaId: number;
} & SelectProps;

export const SelectParecerConclusivo: React.FC<SelectParecerConclusivoProps> = ({
  turmaId,
  ...rest
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [exibirLoader, setExibirLoader] = useState<boolean>(false);

  const obterDados = useCallback(async () => {
    if (!turmaId) return;

    setExibirLoader(true);

    const resposta = await conselhoClasseService
      .obterPareceresConclusivosTurma(turmaId)
      .finally(() => setExibirLoader(false));

    if (resposta.sucesso && resposta?.dados?.length) {
      const lista = resposta.dados.map(
        (item: ParecerConclusivoDto): DefaultOptionType => ({
          ...item,
          value: item?.id,
          label: item?.nome,
        }),
      );

      setOptions(lista);
    } else {
      setOptions([]);
    }
  }, [turmaId]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <Select
      showSearch
      allowClear
      options={options}
      loading={exibirLoader}
      placeholder="Alterar/Limpar parecer conclusivo"
      id={SGP_SELECT_PARECER_CONCLUSIVO}
      {...rest}
      value={!exibirLoader ? rest.value : undefined}
    />
  );
};
