import { SGP_TABLE_INFORMES } from '@/@legacy/constantes/ids/table';
import { validaAntesDoSubmit } from '@/@legacy/utils';
import { useEffect, useState } from 'react';
import { ListaPaginada } from '~/componentes';

const ListaInformesPaginado = ({ form }) => {
  const anoLetivo = form.values?.anoLetivo;
  const dreCodigo = form.values?.dreCodigo;
  const ueCodigo = form.values?.ueCodigo;
  const perfis = form.values?.perfis;
  const titulo = form.values?.titulo;
  const dataInicio = form.values?.dataInicio;
  const dataFim = form.values?.dataFim;

  const [filtro, setFiltro] = useState();

  const colunas = [
    {
      title: 'DRE',
      dataIndex: 'dre',
    },
    {
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ue',
    },
    {
      title: 'Data de envio',
      dataIndex: 'dataEnvio',
    },
    {
      title: 'Perfil',
      dataIndex: 'perfil',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
    {
      title: 'Enviado por',
      dataIndex: 'enviadoPor',
    },
  ];

  useEffect(() => {
    if (!Object.keys(form?.touched)?.length) return;

    if ((dataInicio && !dataFim) || (!dataInicio && dataFim)) return;

    validaAntesDoSubmit(form, form?.initialValues, () => {
      const params = {
        anoLetivo,
        dreCodigo,
        ueCodigo,
      };
      if (perfis?.length) {
        params.perfis = perfis?.length ? perfis : [];
      }
      if (titulo) {
        params.titulo = titulo;
      }
      if (titulo) {
        params.titulo = titulo;
      }
      if (dataInicio && dataFim) {
        params.dataInicio = dataInicio;
        params.dataFim = dataFim;
      }
      setFiltro({ ...params });
    });
  }, [anoLetivo, dreCodigo, ueCodigo, perfis, titulo, dataInicio, dataFim]);

  return (
    <ListaPaginada
      url="v1/informes"
      id={SGP_TABLE_INFORMES}
      colunas={colunas}
      filtro={filtro}
      filtroEhValido={!!filtro?.ueCodigo}
    />
  );
};

export default ListaInformesPaginado;
