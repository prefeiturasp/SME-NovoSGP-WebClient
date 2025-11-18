import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonGroup, ListaPaginada } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Card from '~/componentes/card';

import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import servicoTipoAvaliaco from '~/servicos/Paginas/TipoAvaliacao';
import { confirmar, erro, erros, sucesso } from '~/servicos/alertas';
import Filtro from './componentes/Filtro';

const TipoAvaliacaoLista = () => {
  const navigate = useNavigate();

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [somenteConsulta] = useState(false);
  const permissoesTela = useSelector(store => store.usuario.permissoes);

  const colunas = [
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      render: item => {
        return item.replace(/<[^>]*>?/gm, '');
      },
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      render: item => {
        return item ? 'Ativo' : 'Inativo';
      },
    },
  ];

  const onClickVoltar = () => navigate('/');

  const onClickBotaoPrincipal = () => {
    navigate(`tipo-avaliacao/novo`);
  };

  const onSelecionarItems = items => {
    setItensSelecionados(items);
  };

  const onClickExcluir = async () => {
    if (itensSelecionados && itensSelecionados.length > 0) {
      const confirmado = await confirmar(
        '',
        'Deseja realmente excluir estes itens?'
      );
      if (confirmado) {
        const idsDeletar = itensSelecionados.map(c => c.id);
        const excluir = await servicoTipoAvaliaco
          .deletarTipoAvaliacao(idsDeletar)
          .catch(e => erros(e));
        if (excluir?.status === 200) {
          sucesso('Tipos de avaliação excluídos com sucesso.');
        } else {
          erro('Erro ao excluir tipos de avaliação.');
        }
      }
    }
  };

  const onClickEditar = item => {
    navigate(`${ROUTES.TIPO_AVALIACAO}/editar/${item.id}`);
  };

  const onChangeFiltro = valoresFiltro => {
    if (valoresFiltro.nome === '') {
      delete valoresFiltro.nome;
    }
    if (valoresFiltro.descricao === '') {
      delete valoresFiltro.descricao;
    }
    if (valoresFiltro.situacao === '') {
      delete valoresFiltro.situacao;
    }

    setFiltro(valoresFiltro);
  };

  return (
    <>
      <Cabecalho pagina="Tipos de Avaliações">
        <ButtonGroup
          somenteConsulta={somenteConsulta}
          permissoesTela={permissoesTela[ROUTES.TIPO_AVALIACAO]}
          temItemSelecionado={itensSelecionados && itensSelecionados.length}
          onClickVoltar={onClickVoltar}
          onClickExcluir={onClickExcluir}
          onClickBotaoPrincipal={onClickBotaoPrincipal}
          labelBotaoPrincipal="Novo"
          idBotaoPrincipal={SGP_BUTTON_NOVO}
          desabilitarBotaoPrincipal={false}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <Filtro onFiltrar={onChangeFiltro} />
            <div className="col-md-12">
              <ListaPaginada
                url="/v1/atividade-avaliativa/tipos/listar"
                id="lista-tipo-avaliacao"
                colunaChave="id"
                colunas={colunas}
                filtro={filtro}
                onClick={onClickEditar}
                selecionarItems={onSelecionarItems}
                filtroEhValido
                multiSelecao
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TipoAvaliacaoLista;
