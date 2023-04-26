import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Colors, ListaPaginada, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import { ModalidadeDTO, RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  ServicoComunicados,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import Filtros from './Filtros/filtros';

const ListaComunicados = () => {
  const navigate = useNavigate();

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
    navigate('/');
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
      navigate(`${RotasDto.ACOMPANHAMENTO_COMUNICADOS}/novo`);
    }
  };

  const onClickEditar = comunicado => {
    navigate(`${RotasDto.ACOMPANHAMENTO_COMUNICADOS}/editar/${comunicado.id}`);
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
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => aoClicarBotaoVoltar()} />
          </Col>
          <Col>
            <BotaoExcluirPadrao
              onClick={aoClicarBotaoExcluir}
              disabled={
                somenteConsulta ||
                itensSelecionados?.length < 1 ||
                !permissoesTela.podeExcluir
              }
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_NOVO}
              label="Novo"
              color={Colors.Roxo}
              onClick={aoClicarBotaoNovo}
              disabled={somenteConsulta || !permissoesTela.podeIncluir}
            />
          </Col>
        </Row>
      </Cabecalho>
      <Loader loading={exibirLoader}>
        <Card>
          <div className="col-md-12">
            <Filtros
              onChangeFiltros={onChangeFiltros}
              temModalidadeEja={temModalidadeEja}
            />

            {filtroEhValido && (
              <div className="col-md-12" style={{ paddingTop: 38 }}>
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
