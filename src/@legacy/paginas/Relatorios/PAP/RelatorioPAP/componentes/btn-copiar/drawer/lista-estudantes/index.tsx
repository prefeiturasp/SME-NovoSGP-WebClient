import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import { useAppSelector } from '@/core/hooks/use-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { DataTable, Loader } from '~/componentes';
import { SGP_TABLE_ESTUDANTES_PAP } from '~/constantes/ids/table';
import { erros } from '~/servicos';
import ServicoRelatorioPAP from '~/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';

interface ListaEstudantesPAP {
  turmaPAP?: string;
  setEstudantesSelecionadosCopiar: any;
  estudantesSelecionadosCopiar: AlunoDadosBasicosDto[];
}
export const ListaEstudantesPAP: React.FC<ListaEstudantesPAP> = ({
  turmaPAP,
  setEstudantesSelecionadosCopiar,
  estudantesSelecionadosCopiar,
}) => {
  const periodoSelecionadoPAP = useAppSelector(
    (store) => store.relatorioPAP?.periodoSelecionadoPAP as any,
  );

  const estudanteSelecionadoRelatorioPAP = useAppSelector(
    (store) => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP as any,
  );

  const [dataSource, setDataSource] = useState<AlunoDadosBasicosDto[]>();
  const [carregandoEstudantes, setCarregandoEstudantes] = useState<boolean>(false);

  const colunas = [
    {
      title: 'Nº da chamada',
      dataIndex: 'numeroChamada',
      width: 50,
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Código EOL',
      dataIndex: 'codigoEOL',
    },
  ];

  const onSelectRow = (_: any, record: AlunoDadosBasicosDto[]) =>
    setEstudantesSelecionadosCopiar(record);

  const obterListaAlunos = useCallback(async () => {
    setCarregandoEstudantes(true);

    const retorno = await ServicoRelatorioPAP.obterListaAlunos(
      turmaPAP,
      periodoSelecionadoPAP?.periodoRelatorioPAPId,
    ).catch((e) => erros(e));

    if (retorno?.data?.length) {
      const lista: AlunoDadosBasicosDto[] = retorno.data.filter(
        (estudante: AlunoDadosBasicosDto) =>
          !estudante?.desabilitado &&
          estudante?.codigoEOL !== estudanteSelecionadoRelatorioPAP?.codigoEOL,
      );
      setDataSource(lista);
    } else {
      setDataSource([]);
    }

    setCarregandoEstudantes(false);
  }, [turmaPAP, periodoSelecionadoPAP, estudanteSelecionadoRelatorioPAP]);

  useEffect(() => {
    setDataSource([]);

    if (turmaPAP) {
      obterListaAlunos();
    }
  }, [turmaPAP, obterListaAlunos]);

  return (
    <Loader loading={carregandoEstudantes}>
      <DataTable
        idLinha="codigoEOL"
        id={SGP_TABLE_ESTUDANTES_PAP}
        selectedRowKeys={estudantesSelecionadosCopiar.map(
          (item: AlunoDadosBasicosDto) => item?.codigoEOL,
        )}
        onSelectRow={onSelectRow}
        columns={colunas}
        dataSource={dataSource}
        selectMultipleRows
        pagination={false}
      />
    </Loader>
  );
};
