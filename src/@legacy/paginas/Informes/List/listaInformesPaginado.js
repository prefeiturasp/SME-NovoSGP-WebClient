import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_TABLE_INFORMES } from '@/@legacy/constantes/ids/table';
import { validaAntesDoSubmit } from '@/@legacy/utils';
import { useCallback, useEffect, useState } from 'react';
import { ListaPaginada } from '~/componentes';
import { Badge } from '../../DiarioClasse/CompensacaoAusencia/styles';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';

let debounceFlag;

const ListaInformesPaginado = ({ form }) => {
  const navigate = useNavigate();

  const anoLetivo = form.values?.anoLetivo;
  const dreCodigo = form.values?.dreCodigo;
  const ueCodigo = form.values?.ueCodigo;
  const perfis = form.values?.perfis;
  const titulo = form.values?.titulo;
  const dataInicio = form.values?.dataInicio;
  const dataFim = form.values?.dataFim;

  const listaUes = form.values?.listaUes;
  const listaDres = form.values?.listaDres;
  const listaPerfis = form?.values?.listaPerfis;

  const [filtro, setFiltro] = useState();
  const [filtroEhValido, setFiltroEhValido] = useState(false);

  const montarBadgePorLinhar = dados => {
    if (!dados?.length) return <></>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
        {dados.map(item => {
          return (
            <Badge
              key={item?.id}
              role="button"
              alt={item.nome}
              className="badge badge-pill border text-dark bg-white font-weight-light px-2 py-1 mr-2"
            >
              {item.nome}
            </Badge>
          );
        })}
      </div>
    );
  };

  const colunas = [
    {
      title: 'DRE',
      dataIndex: 'dreNome',
    },
    {
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ueNome',
    },
    {
      title: 'Data de envio',
      dataIndex: 'dataEnvio',
    },
    {
      title: 'Perfil',
      dataIndex: 'perfis',
      onCell: () => {
        return {
          style: {
            minWidth: '400px',
          },
        };
      },
      render: montarBadgePorLinhar,
    },
    {
      title: 'Modalidade',
      dataIndex: 'modalidades',
      onCell: () => {
        return {
          style: {
            minWidth: '400px',
          },
        };
      },
      render: montarBadgePorLinhar,
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

  const validarFiltro = useCallback(() => {
    let dreId = '';
    let ueId = '';

    if (dreCodigo && dreCodigo !== OPCAO_TODOS) {
      const dreSelecionada = listaDres.find(
        item => String(item.codigo) === String(dreCodigo)
      );
      dreId = dreSelecionada?.id;
    }

    if (
      dreCodigo &&
      dreCodigo !== OPCAO_TODOS &&
      ueCodigo &&
      ueCodigo !== OPCAO_TODOS
    ) {
      const ueSelecionada = listaUes.find(
        item => String(item.codigo) === String(ueCodigo)
      );
      ueId = ueSelecionada?.id;
    }

    const params = {
      anoLetivo,
      dreId,
      ueId,
      perfis: [],
    };

    if (perfis?.length) {
      const todosPerfisSelecionado = perfis.find(
        perfilId => String(perfilId) === OPCAO_TODOS
      );
      if (todosPerfisSelecionado) {
        params.perfis = [];
      } else {
        params.perfis = perfis?.length ? perfis : [];
      }
    }

    if (titulo) {
      params.titulo = titulo;
    }

    if (dataInicio && dataFim) {
      params.dataEnvioInicio = dataInicio?.format('YYYY-MM-DD');
      params.dataEnvioFim = dataFim?.format('YYYY-MM-DD');
    }
    setFiltro({ ...params });
    setFiltroEhValido(true);
  }, [
    anoLetivo,
    dreCodigo,
    ueCodigo,
    perfis,
    titulo,
    dataInicio,
    dataFim,
    listaUes,
    listaDres,
    listaPerfis,
  ]);

  useEffect(() => {
    if (debounceFlag) clearTimeout(debounceFlag);

    if (!Object.keys(form?.touched)?.length) return;

    const datasInvalidas = (dataInicio && !dataFim) || (!dataInicio && dataFim);
    if (datasInvalidas) return;

    if (dreCodigo && ueCodigo) {
      debounceFlag = setTimeout(() => {
        validaAntesDoSubmit(form, form?.initialValues, validarFiltro);
      }, 100);
    }
  }, [
    anoLetivo,
    dreCodigo,
    ueCodigo,
    perfis,
    titulo,
    dataInicio,
    dataFim,
    listaUes,
    listaDres,
    listaPerfis,
  ]);

  return (
    <ListaPaginada
      url="v1/informes"
      id={SGP_TABLE_INFORMES}
      colunas={colunas}
      filtro={filtro}
      filtroEhValido={filtroEhValido}
      onClick={linha => {
        navigate(`${ROUTES.INFORMES}/${linha?.id}`);
      }}
    />
  );
};

export default ListaInformesPaginado;
