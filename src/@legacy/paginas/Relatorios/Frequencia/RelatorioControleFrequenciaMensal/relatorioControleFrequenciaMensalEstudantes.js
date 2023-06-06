import { SGP_TABLE_SELECIONAR_ESTUDANTES } from '@/@legacy/constantes/ids/table';
import React, { useEffect, useState } from 'react';
import { ListaPaginada } from '~/componentes';

const RelatorioControleFrequenciaMensalEstudantes = ({ form }) => {
  const anoLetivo = form.values?.anoLetivo;
  const modalidade = form.values?.modalidade;
  const dreCodigo = form.values?.dreCodigo;
  const ueCodigo = form.values?.ueCodigo;
  const turmaCodigo = form.values?.turmaCodigo;
  const semestre = form.values?.semestre;

  const [filtro, setFiltro] = useState();

  const colunas = [
    {
      title: 'Número',
      dataIndex: 'numeroChamada',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  const onSelecionarItems = items => {
    const codigos = [...items.map(item => String(item.codigo))];
    form.setFieldValue('codigosEstudantes', codigos);
  };

  useEffect(() => {
    setFiltro({
      anoLetivo,
      modalidade,
      dreCodigo,
      ueCodigo,
      turmaCodigo,
      semestre,
    });

    return () => {
      form?.setFieldValue('codigosEstudantes', []);
    };
  }, [anoLetivo, modalidade, dreCodigo, ueCodigo, turmaCodigo, semestre]);

  return (
    <ListaPaginada
      url="v1/boletim/alunos"
      id={SGP_TABLE_SELECIONAR_ESTUDANTES}
      colunaChave="codigo"
      colunas={colunas}
      filtro={filtro}
      filtroEhValido={!!filtro?.turmaCodigo}
      multiSelecao
      temPaginacao={false}
      selecionarItems={onSelecionarItems}
    />
  );
};

export default RelatorioControleFrequenciaMensalEstudantes;
