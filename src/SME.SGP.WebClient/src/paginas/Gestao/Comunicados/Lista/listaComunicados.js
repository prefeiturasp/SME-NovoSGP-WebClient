import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Card, Colors, ListaPaginada } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { ModalidadeDTO, RotasDto } from '~/dtos';
import {
  confirmar,
  erro,
  history,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import ServicoComunicados from '~/servicos/Paginas/AcompanhamentoEscolar/Comunicados/ServicoComunicados';

import Filtros from './Filtros/filtros';

const ListaComunicados = () => {
  const [filtros, setFiltros] = useState({});
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const permissoesTela = useSelector(store => store.usuario.permissoes);

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
    const ehSomenteConsulta = verificaSomenteConsulta(
      permissoesTela[RotasDto.ACOMPANHAMENTO_COMUNICADOS]
    );
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
    if (itensSelecionados && itensSelecionados.length >= 1) {
      const confirmado = await confirmar(
        'Atenção',
        'Você tem certeza que deseja excluir este(s) registro(s)?'
      );
      if (confirmado) {
        const exclusao = await ServicoComunicados.excluir(itensSelecionados);
        if (exclusao?.status === 200) {
          sucesso('Registro(s) excluído(s) com sucesso');
          setFiltros({ ...filtros });
        } else {
          erro(exclusao);
        }
      }
    }
  };

  const aoClicarBotaoNovo = () => {
    history.push(`${RotasDto.ACOMPANHAMENTO_COMUNICADOS}/novo`);
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

  console.log('filtros', filtros);

  return (
    <>
      <Cabecalho pagina="Comunicação com pais ou responsáveis" classes="mb-2" />
      <Card>
        <div className="col-md-12 p-0">
          <div className="row mb-2">
            <div className="col-sm-12 d-flex justify-content-end">
              <Button
                id="botao-voltar"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                onClick={aoClicarBotaoVoltar}
                border
                className="mr-3"
              />
              <Button
                id="botao-excluir"
                label="Excluir"
                color={Colors.Azul}
                onClick={aoClicarBotaoExcluir}
                border
                className="mr-3"
                disabled={somenteConsulta || itensSelecionados?.length < 1}
              />
              <Button
                id="botao-novo"
                label="Novo"
                color={Colors.Roxo}
                onClick={aoClicarBotaoNovo}
              />
            </div>
          </div>
          <Filtros
            onChangeFiltros={onChangeFiltros}
            temModalidadeEja={temModalidadeEja}
          />

          {filtroEhValido && (
            <div className="col-md-12 px-0" style={{ paddingTop: 38 }}>
              <ListaPaginada
                id="lista-comunicados"
                url="v1/comunicado"
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
    </>
  );
};

export default ListaComunicados;
