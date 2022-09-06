import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Colors, ListaPaginada, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import {
  SGP_BUTTON_EXCLUIR,
  SGP_BUTTON_NOVO,
  SGP_BUTTON_VOLTAR,
} from '~/componentes-sgp/filtro/idsCampos';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  history,
  ServicoComunicados,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import Filtros from './Filtros/filtros';

const ListaComunicados = () => {
  const [filtros, setFiltros] = useState({});
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_COMUNICADOS];

  const temModalidadeEja = !!filtros?.modalidades?.find(
    item => String(item) === String(ModalidadeDTO.EJA)
  );
  const temSemestre = temModalidadeEja ? filtros?.semestre : true;

  const filtroEhValido = !!(
    filtros?.anoLetivo &&
    filtros?.dreCodigo &&
    filtros?.ueCodigo &&
    filtros?.modalidades?.length &&
    temSemestre
  );

  useEffect(() => {
    const ehSomenteConsulta = verificaSomenteConsulta(permissoesTela);
    setSomenteConsulta(ehSomenteConsulta);
  }, [permissoesTela]);

  const colunas = [
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
    {
      title: 'Data de envio',
      dataIndex: 'dataEnvio',
      render: data => {
        return data && window.moment(data).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Data de expiração',
      dataIndex: 'dataExpiracao',
      render: data => {
        return data && window.moment(data).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Modalidade',
      dataIndex: 'modalidade',
    },
  ];

  const aoClicarBotaoVoltar = () => {
    history.push('/');
  };

  const aoClicarBotaoExcluir = async () => {
    if (itensSelecionados.length && permissoesTela.podeExcluir) {
      const msgConfirm = `Você tem certeza que deseja excluir ${
        itensSelecionados.length > 1 ? 'estes registros' : 'este registro'
      }?`;
      const confirmado = await confirmar('Atenção', msgConfirm);

      if (confirmado) {
        setExibirLoader(true);
        const resposta = await ServicoComunicados.excluir(itensSelecionados)
          .catch(e => erros(e))
          .finally(() => setExibirLoader(false));

        if (resposta?.status === 200) {
          const msgSucesso = `${
            itensSelecionados.length > 1
              ? 'Registros excluídos'
              : 'Registro excluído'
          } com sucesso`;

          sucesso(msgSucesso);
          setFiltros({ ...filtros });
        }
      }
    }
  };

  const aoClicarBotaoNovo = () => {
    if (permissoesTela.podeIncluir) {
      history.push(`${RotasDto.ACOMPANHAMENTO_COMUNICADOS}/novo`);
    }
  };

  const onClickEditar = comunicado => {
    history.push(
      `${RotasDto.ACOMPANHAMENTO_COMUNICADOS}/editar/${comunicado.id}`
    );
  };

  const onSelecionarItems = items => {
    setItensSelecionados([...items.map(item => String(item.id))]);
  };

  const converterData = valor =>
    valor ? moment(valor).format('MM-DD-YYYY') : '';

  const onChangeFiltros = valoresFiltro => {
    setFiltros(estadoAntigo => ({
      ...estadoAntigo,
      ...valoresFiltro,
      dataEnvioInicio: converterData(valoresFiltro.dataEnvioInicio),
      dataEnvioFim: converterData(valoresFiltro.dataEnvioFim),
      dataExpiracaoInicio: converterData(valoresFiltro.dataExpiracaoInicio),
      dataExpiracaoFim: converterData(valoresFiltro.dataExpiracaoFim),
    }));
  };

  return (
    <>
      <Cabecalho pagina="Comunicação com pais ou responsáveis">
        <div className="d-flex justify-content-end">
          <Button
            id={SGP_BUTTON_VOLTAR}
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            onClick={aoClicarBotaoVoltar}
            border
            className="mr-2"
          />
          <Button
            id={SGP_BUTTON_EXCLUIR}
            label="Excluir"
            color={Colors.Vermelho}
            onClick={aoClicarBotaoExcluir}
            border
            className="mr-2"
            disabled={
              somenteConsulta ||
              itensSelecionados?.length < 1 ||
              !permissoesTela.podeExcluir
            }
          />
          <Button
            id={SGP_BUTTON_NOVO}
            label="Novo"
            color={Colors.Roxo}
            onClick={aoClicarBotaoNovo}
            disabled={somenteConsulta || !permissoesTela.podeIncluir}
          />
        </div>
      </Cabecalho>
      <Loader loading={exibirLoader}>
        <Card>
          <div className="col-md-12 p-0">
            <Filtros
              onChangeFiltros={onChangeFiltros}
              temModalidadeEja={temModalidadeEja}
            />

            {filtroEhValido && (
              <div className="col-md-12 px-0" style={{ paddingTop: 38 }}>
                <ListaPaginada
                  id="lista-comunicados"
                  url="v1/comunicados"
                  idLinha="id"
                  colunaChave="id"
                  colunas={colunas}
                  onClick={onClickEditar}
                  multiSelecao
                  filtro={filtros}
                  paramArrayFormat="repeat"
                  selecionarItems={onSelecionarItems}
                  filtroEhValido={filtroEhValido}
                />
              </div>
            )}
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default ListaComunicados;
