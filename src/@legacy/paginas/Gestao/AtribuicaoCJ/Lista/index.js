import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';

import { ROUTES } from '@/core/enum/routes';
import AtribuicaoCJServico from '~/servicos/Paginas/AtribuicaoCJ';
import { erros } from '~/servicos/alertas';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import { ButtonGroup, Card, DataTable, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Filtro from './componentes/Filtro';

import { useNavigate } from 'react-router-dom';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { PilulaEstilo } from './styles';

function AtribuicaoCJLista() {
  const navigate = useNavigate();

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [itens, setItens] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const permissoesTela = useSelector(store => store.usuario.permissoes);

  const colunas = [
    {
      title: 'Modalidade',
      dataIndex: 'modalidade',
      key: 'modalidade',
    },
    {
      title: 'Turma',
      dataIndex: 'turma',
      key: 'turma',
    },
    {
      title: 'Componente curricular',
      dataIndex: 'disciplinas',
      key: 'disciplinas',
      width: '80%',
      render: linha => {
        return linha.map(item => (
          <PilulaEstilo key={shortid.generate()}>{item}</PilulaEstilo>
        ));
      },
    },
  ];

  const onClickVoltar = () => navigate('/');

  const onClickBotaoPrincipal = () =>
    navigate(
      `/gestao/atribuicao-cjs/novo?dreId=${filtro.DreId}${
        filtro.UeId ? `&ueId=${filtro.UeId}` : ''
      }&historico=${filtro.Historico}`
    );

  const onSelecionarItems = items => {
    setItensSelecionados(items);
  };

  const onClickEditar = item => {
    navigate(
      `/gestao/atribuicao-cjs/editar?modalidadeId=${item.modalidadeId}&turmaId=` +
        `${item.turmaId}&dreId=${filtro.DreId}&ueId=${filtro.UeId}&anoLetivo=${filtro.AnoLetivo}&historico=${filtro.Historico}&usuarioRF=${filtro?.UsuarioRF}&professorNome=${filtro?.professorNome}`
    );
  };

  const onChangeFiltro = valoresFiltro => {
    setFiltro({
      AnoLetivo: valoresFiltro.anoLetivo,
      DreId: valoresFiltro.dreId,
      UeId: valoresFiltro.ueId,
      UsuarioRF: valoresFiltro.professorRf,
      professorNome: valoresFiltro?.professorNome,
      Historico: valoresFiltro.exibirHistorico,
    });
  };
  useEffect(() => {
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela[ROUTES.ATRIBUICAO_CJ_LISTA])
    );
  }, [permissoesTela]);

  useEffect(() => {
    async function buscaItens() {
      try {
        setCarregandoLista(true);
        const { data, status } = await AtribuicaoCJServico.buscarLista(filtro);
        if (status === 200 && data) {
          setItens(data.map(item => ({ ...item, key: shortid.generate() })));
        }
        setCarregandoLista(false);
      } catch (error) {
        erros(error);
        setCarregandoLista(false);
      }
    }
    if (filtro.DreId && filtro.UeId && filtro.UsuarioRF) {
      setItens([]);
      buscaItens();
    }
  }, [filtro]);

  return (
    <>
      <Loader loading={carregandoLista}>
        <Cabecalho pagina="Atribuição de CJ">
          <ButtonGroup
            somenteConsulta={somenteConsulta}
            permissoesTela={permissoesTela[ROUTES.ATRIBUICAO_CJ_LISTA]}
            temItemSelecionado={
              itensSelecionados && itensSelecionados.length >= 1
            }
            onClickVoltar={onClickVoltar}
            onClickBotaoPrincipal={onClickBotaoPrincipal}
            labelBotaoPrincipal="Novo"
            idBotaoPrincipal={SGP_BUTTON_NOVO}
            desabilitarBotaoPrincipal={
              !!filtro.DreId === false && !!filtro.UeId === false
            }
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <Filtro onFiltrar={onChangeFiltro} />
            <DataTable
              id="lista-atribuicoes-cj"
              idLinha="key"
              colunaChave="key"
              columns={colunas}
              dataSource={itens}
              onClickRow={onClickEditar}
              multiSelecao
              selecionarItems={onSelecionarItems}
            />
          </div>
        </Card>
      </Loader>
    </>
  );
}

export default AtribuicaoCJLista;
