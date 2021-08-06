import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Card, Colors } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import { RotasDto } from '~/dtos';
import { verificaSomenteConsulta } from '~/servicos';
import ServicoComunicados from '~/servicos/Paginas/AcompanhamentoEscolar/Comunicados/ServicoComunicados';

import Filtros from './Filtros/filtros';

const CadastroComunicados = () => {
  const [filtros, setFiltros] = useState({});
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const permissoesTela = useSelector(store => store.usuario.permissoes);

  useEffect(() => {
    const ehSomenteConsulta = verificaSomenteConsulta(
      permissoesTela[RotasDto.ACOMPANHAMENTO_COMUNICADOS]
    );
    setSomenteConsulta(ehSomenteConsulta);
  }, [permissoesTela]);

  const aoClicarBotaoVoltar = () => {};

  const aoClicarBotaoCancelar = () => {};

  const aoClicarBotaoCadastrar = () => {};

  const converterData = valor =>
    valor ? moment(valor).format('MM-DD-YYYY') : '';

  const onChangeFiltros = valoresFiltro => {
    setFiltros(estadoAntigo => ({
      ...estadoAntigo,
      ...valoresFiltro,
      dataEnvio: converterData(valoresFiltro.dataEnvioInicio),
      dataExpiracao: converterData(valoresFiltro.dataExpiracaoInicio),
    }));
  };

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
                id="botao-cancelar"
                label="Cancelar"
                color={Colors.Azul}
                onClick={aoClicarBotaoCancelar}
                border
                className="mr-3"
                disabled={somenteConsulta}
              />
              <Button
                id="botao-cadastrar"
                label="Cadastrar"
                color={Colors.Roxo}
                onClick={aoClicarBotaoCadastrar}
              />
            </div>
          </div>
          <Filtros onChangeFiltros={onChangeFiltros} />
        </div>
      </Card>
    </>
  );
};

export default CadastroComunicados;
