import Select from '@/components/lib/inputs/select';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { TurmasPapDto } from '@/core/dto/TurmasPapDto';
import { useAppSelector } from '@/core/hooks/use-redux';
import relatorioPapService from '@/core/services/relatorio-pap-service';
import { SelectProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { SGP_SELECT_TURMA_PAP } from '~/constantes/ids/select';

export const SelectTurmasRelatorioPAP: React.FC<SelectProps> = (props) => {
  const usuario = useAppSelector((store) => store.usuario);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const [listaTurmas, setListaTurmas] = useState<TurmasPapDto[]>([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState<boolean>(false);

  const obterTurmasPAP = useCallback(async () => {
    setCarregandoTurmas(true);
    const resposta = await relatorioPapService.obterTurmasPapPorAnoLetivo(
      turmaSelecionada?.anoLetivo,
      turmaSelecionada?.unidadeEscolar || '',
    );

    if (resposta.sucesso && resposta?.dados?.length) {
      let lista = resposta.dados;

      lista = lista.map((item: TurmasPapDto) => ({
        ...item,
        value: item?.codigoTurma,
        label: item?.turmaNome,
      }));

      setListaTurmas(lista);
    } else {
      setListaTurmas([]);
    }
    setCarregandoTurmas(false);
  }, [turmaSelecionada]);

  useEffect(() => {
    if (turmaSelecionada?.turma) {
      obterTurmasPAP();
    } else {
      setListaTurmas([]);
    }
  }, [turmaSelecionada, obterTurmasPAP]);

  return (
    <Select
      showSearch
      options={listaTurmas}
      id={SGP_SELECT_TURMA_PAP}
      loading={carregandoTurmas}
      placeholder="Selecione uma Turma"
      {...props}
    />
  );
};
