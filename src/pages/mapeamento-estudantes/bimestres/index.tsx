import Select from '@/components/lib/inputs/select';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { BimestreEnum, BimestreEnumDisplay } from '@/core/enum/bimestre-tab-enum';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import {
  setBimestreSelecionado,
  setDadosSecoesMapeamentoEstudantes,
  setEstudantesMapeamentoEstudantes,
  setMapeamentoEstudanteId,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';

export const BimestresMapeamentoEstudantes: React.FC = () => {
  const dispatch = useAppDispatch();

  const usuario = useAppSelector((store) => store.usuario);

  const bimestreSelecionado = useAppSelector(
    (store) => store.mapeamentoEstudantes.bimestreSelecionado as BimestreEnum,
  );

  const [listaBimestres, setListaBimestres] = useState<DefaultOptionType[]>([]);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const permiteOnChangeBimestre = async () => {
    const continuar = await mapeamentoEstudantesService.salvar();

    return !!continuar;
  };

  const limparDados = useCallback(() => {
    dispatch(setDadosSecoesMapeamentoEstudantes(undefined));
    dispatch(setMapeamentoEstudanteId(undefined));
    dispatch(setLimparDadosQuestionarioDinamico());
    dispatch(setEstudantesMapeamentoEstudantes([]));
    dispatch(setListaSecoesEmEdicao([]));
  }, [dispatch]);

  const onChange = async (bimestre: string) => {
    const permiteAlterarBimestre = await permiteOnChangeBimestre();

    if (permiteAlterarBimestre) {
      limparDados();
      dispatch(setBimestreSelecionado(bimestre));
    }
  };

  useEffect(() => {
    const newList: DefaultOptionType[] = [
      {
        label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_1],
        value: BimestreEnum.BIMESTRE_1,
      },
      {
        label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_2],
        value: BimestreEnum.BIMESTRE_2,
      },
    ];
    const modalidade = turmaSelecionada?.modalidade;
    const naoEhEjaOuCelp =
      Number(modalidade) !== ModalidadeEnum.EJA && Number(modalidade) !== ModalidadeEnum.CELP;
    if (naoEhEjaOuCelp) {
      newList.push(
        {
          label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_3],
          value: BimestreEnum.BIMESTRE_3,
        },
        {
          label: BimestreEnumDisplay[BimestreEnum.BIMESTRE_4],
          value: BimestreEnum.BIMESTRE_4,
        },
      );
    }

    setListaBimestres(newList);
  }, [turmaSelecionada]);

  return (
    <Select
      options={listaBimestres}
      onChange={onChange}
      placeholder="Selecione um bimestre"
      value={bimestreSelecionado}
    />
  );
};
