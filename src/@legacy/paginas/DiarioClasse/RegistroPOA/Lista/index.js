import { useCallback, useEffect, useState } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderSecao } from '~/redux/modulos/loader/actions';

// Servicos
import { ROUTES } from '@/core/enum/routes';
import RegistroPOAServico from '~/servicos/Paginas/DiarioClasse/RegistroPOA';
import { confirmar, erro, sucesso } from '~/servicos/alertas';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

// Componentes SGP
import { Cabecalho } from '~/componentes-sgp';

// Componentes
import { useNavigate } from 'react-router-dom';
import { ButtonGroup, Card, ListaPaginada, Loader } from '~/componentes';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import Filtro from './componentes/Filtro';

function RegistroPOALista() {
  const navigate = useNavigate();

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [filtroValido, setFiltroValido] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const dispatch = useDispatch();
  const { loaderSecao } = useSelector(store => store.loader);
  const usuarioLogado = useSelector(store => store.usuario);
  const permissoesTela = usuarioLogado.permissoes;
  const anoLetivo =
    usuarioLogado.turmaSelecionada.anoLetivo || window.moment().format('YYYY');
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );
  const { turmaSelecionada } = usuarioLogado;

  const renderizarBimestres = valor => {
    const bimestres = [
      {
        valor: '1',
        desc: '1º Bimestre',
      },
      {
        valor: '2',
        desc: '2º Bimestre',
      },
      {
        valor: '3',
        desc: '3º Bimestre',
      },
      {
        valor: '4',
        desc: '4º Bimestre',
      },
    ];
    return bimestres.find(bimestre => bimestre.valor === valor.toString()).desc;
  };

  const colunas = [
    {
      title: 'Bimestre',
      dataIndex: 'bimestre',
      width: '20%',
      render: valor => {
        return renderizarBimestres(valor);
      },
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
  ];

  const onClickVoltar = () => navigate('/');

  const onClickBotaoPrincipal = () =>
    navigate(`/diario-classe/registro-poa/novo`);

  const onClickEditar = item =>
    navigate(`/diario-classe/registro-poa/editar/${item.id}`);

  const onSelecionarItems = lista => setItensSelecionados(lista);

  const onClickExcluir = async () => {
    if (itensSelecionados && itensSelecionados.length > 0) {
      const listaNomeExcluir = itensSelecionados.map(item => item.titulo);
      const confirmado = await confirmar(
        'Excluir registro',
        listaNomeExcluir,
        `Deseja realmente excluir ${
          itensSelecionados.length > 1 ? 'estes itens' : 'este item'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        dispatch(setLoaderSecao(true));
        const excluir = await Promise.all(
          itensSelecionados.map(x =>
            RegistroPOAServico.deletarRegistroPOA(x.id)
          )
        );
        if (excluir) {
          const mensagemSucesso = `${
            itensSelecionados.length > 1
              ? 'Registros excluídos'
              : 'Registro excluído'
          } com sucesso.`;
          sucesso(mensagemSucesso);
          setFiltro({
            ...filtro,
            atualizar: !filtro.atualizar || true,
          });
          dispatch(setLoaderSecao(false));
          setItensSelecionados([]);
        }
      }
    }
  };

  useEffect(() => {
    const permissoes = permissoesTela[ROUTES.REGISTRO_POA];
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setSomenteConsulta(
      verificaSomenteConsulta(permissoes, naoSetarSomenteConsultaNoStore)
    );
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  useEffect(() => {
    setFiltroValido(
      () => !!filtro && !!filtro.dreId && !!filtro.ueId && !!filtro.codigoRf
    );
  }, [filtro]);

  const onChangeFiltro = useCallback(
    valoresFiltro => {
      const paramsConsulta = {};
      if (valoresFiltro.bimestre) {
        paramsConsulta.bimestre = valoresFiltro.bimestre;
      }
      if (valoresFiltro.professorRf) {
        paramsConsulta.codigoRf = valoresFiltro.professorRf;
      }
      if (valoresFiltro.dreId) {
        paramsConsulta.dreId = valoresFiltro.dreId;
      }
      if (valoresFiltro.titulo) {
        paramsConsulta.titulo = valoresFiltro.titulo;
      }
      if (valoresFiltro.ueId) {
        paramsConsulta.ueId = valoresFiltro.ueId;
      }
      if (anoLetivo) {
        paramsConsulta.anoLetivo = anoLetivo;
      }
      setFiltro(paramsConsulta);
    },
    [anoLetivo]
  );

  return (
    <>
      <AlertaModalidadeInfantil />
      <Loader loading={loaderSecao}>
        <Cabecalho pagina="Registro do professor orientador de área">
          <ButtonGroup
            somenteConsulta={somenteConsulta}
            permissoesTela={permissoesTela[ROUTES.REGISTRO_POA]}
            temItemSelecionado={
              itensSelecionados && itensSelecionados.length >= 1
            }
            onClickExcluir={onClickExcluir}
            onClickVoltar={onClickVoltar}
            onClickBotaoPrincipal={onClickBotaoPrincipal}
            idBotaoPrincipal={SGP_BUTTON_NOVO}
            labelBotaoPrincipal="Novo"
            desabilitarBotaoPrincipal={
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
              (!!filtro.dreId === false && !!filtro.ueId === false)
            }
          />
        </Cabecalho>
        <Card>
          {!ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
            <div className="col-md-12">
              <Filtro onFiltrar={onChangeFiltro} />
              <ListaPaginada
                id="lista-atribuicoes-cj"
                url="v1/atribuicao/poa/listar"
                idLinha="id"
                colunaChave="id"
                colunas={colunas}
                onClick={onClickEditar}
                multiSelecao
                filtro={filtro}
                selecionarItems={onSelecionarItems}
                filtroEhValido={filtroValido}
                onErro={err => erro(JSON.stringify(err))}
              />
            </div>
          ) : (
            <></>
          )}
        </Card>
      </Loader>
    </>
  );
}

export default RegistroPOALista;
