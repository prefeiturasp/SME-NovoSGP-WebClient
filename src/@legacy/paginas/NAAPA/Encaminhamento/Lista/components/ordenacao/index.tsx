import {
  OrdenacaoListEncaminhamentoNAAPAEnum,
  OrdenacaoListEncaminhamentoNAAPAEnumDisplay,
} from '@/core/enum/ordenacao-list-encaminhamento-naapa-enum';
import { TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
import { Label } from '~/componentes';

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: OrdenacaoListEncaminhamentoNAAPAEnumDisplay[OrdenacaoListEncaminhamentoNAAPAEnum.UE],
    key: OrdenacaoListEncaminhamentoNAAPAEnum.UE,
    value: '0-1',
    checkable: false,
    children: [
      {
        title: 'Crescente',
        value: OrdenacaoListEncaminhamentoNAAPAEnum.UE,
        key: OrdenacaoListEncaminhamentoNAAPAEnum.UE,
        label: OrdenacaoListEncaminhamentoNAAPAEnumDisplay[OrdenacaoListEncaminhamentoNAAPAEnum.UE],
      },
      {
        title: 'Decrescente',
        label:
          OrdenacaoListEncaminhamentoNAAPAEnumDisplay[OrdenacaoListEncaminhamentoNAAPAEnum.UEDesc],
        value: OrdenacaoListEncaminhamentoNAAPAEnum.UEDesc,
        key: OrdenacaoListEncaminhamentoNAAPAEnum.UEDesc,
      },
    ],
  },
  {
    title:
      OrdenacaoListEncaminhamentoNAAPAEnumDisplay[OrdenacaoListEncaminhamentoNAAPAEnum.Estudante],
    key: OrdenacaoListEncaminhamentoNAAPAEnum.Estudante,
    value: '0-2',
    checkable: false,
    children: [
      {
        title: 'Crescente',
        value: OrdenacaoListEncaminhamentoNAAPAEnum.Estudante,
        key: OrdenacaoListEncaminhamentoNAAPAEnum.Estudante,
        label:
          OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
            OrdenacaoListEncaminhamentoNAAPAEnum.Estudante
          ],
      },
      {
        title: 'Decrescente',
        label:
          OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
            OrdenacaoListEncaminhamentoNAAPAEnum.EstudanteDesc
          ],
        value: OrdenacaoListEncaminhamentoNAAPAEnum.EstudanteDesc,
        key: OrdenacaoListEncaminhamentoNAAPAEnum.EstudanteDesc,
      },
    ],
  },
  {
    title:
      OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
        OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa
      ],
    key: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa,
    value: '0-3',
    checkable: false,
    children: [
      {
        title: 'Crescente',
        value: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa,
        key: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa,
        label:
          OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
            OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa
          ],
      },
      {
        title: 'Decrescente',
        label:
          OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
            OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc
          ],
        value: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc,
        key: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc,
      },
    ],
  },
];

type BotaoOrdenacaoListaEncaminhamentoNAAPAProps = {
  setOrdenacoesSelecionadas: any;
  ordenacoesSelecionadas: any[];
  opcoesParaRemover?: OrdenacaoListEncaminhamentoNAAPAEnum[];
};
export const BotaoOrdenacaoListaEncaminhamentoNAAPA: React.FC<
  BotaoOrdenacaoListaEncaminhamentoNAAPAProps
> = ({ setOrdenacoesSelecionadas, ordenacoesSelecionadas, opcoesParaRemover }) => {
  const [treeDataList, setTreeDataList] = useState<any[]>([]);

  const mapNewList = (valorComparacao: OrdenacaoListEncaminhamentoNAAPAEnum) =>
    ordenacoesSelecionadas.filter((item: any) => item?.value !== valorComparacao);

  const onSelect = (newValue: OrdenacaoListEncaminhamentoNAAPAEnum, newValueObject: any) => {
    if (ordenacoesSelecionadas?.length) {
      let newList = ordenacoesSelecionadas;

      switch (newValue) {
        case OrdenacaoListEncaminhamentoNAAPAEnum.UE:
          newList = mapNewList(OrdenacaoListEncaminhamentoNAAPAEnum.UEDesc);
          break;
        case OrdenacaoListEncaminhamentoNAAPAEnum.UEDesc:
          newList = mapNewList(OrdenacaoListEncaminhamentoNAAPAEnum.UE);
          break;
        case OrdenacaoListEncaminhamentoNAAPAEnum.Estudante:
          newList = mapNewList(OrdenacaoListEncaminhamentoNAAPAEnum.EstudanteDesc);
          break;
        case OrdenacaoListEncaminhamentoNAAPAEnum.EstudanteDesc:
          newList = mapNewList(OrdenacaoListEncaminhamentoNAAPAEnum.Estudante);
          break;
        case OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa:
          newList = mapNewList(OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc);
          break;
        case OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc:
          newList = mapNewList(OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixa);
          break;

        default:
          break;
      }
      newList.push(newValueObject);
      setOrdenacoesSelecionadas(newList);
    }
  };

  useEffect(() => {
    if (opcoesParaRemover?.length) {
      setTreeDataList(treeData.filter((item) => !opcoesParaRemover.includes(item?.key)));
    } else {
      setTreeDataList(treeData);
    }
  }, [opcoesParaRemover]);

  return (
    <>
      <Label text="Ordenar" />
      <TreeSelect
        allowClear
        labelInValue
        treeCheckable
        treeData={treeDataList}
        value={ordenacoesSelecionadas}
        onChange={setOrdenacoesSelecionadas}
        onSelect={onSelect}
        showCheckedStrategy={SHOW_PARENT}
        treeNodeLabelProp="label"
        placeholder="Selecione uma opção"
        style={{
          width: '100%',
        }}
      />
    </>
  );
};
