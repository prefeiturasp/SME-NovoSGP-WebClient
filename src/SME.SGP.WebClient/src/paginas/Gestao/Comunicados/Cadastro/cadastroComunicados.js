import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Colors, Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { RotasDto } from '~/dtos';
import {
  confirmar,
  erros,
  history,
  ServicoComunicados,
  sucesso,
  verificaSomenteConsulta,
} from '~/servicos';
import Filtros from './Filtros/filtros';

const CadastroComunicados = ({ match }) => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_COMUNICADOS];

  const [filtros, setFiltros] = useState({});
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [resetarFiltros, setResetarFiltros] = useState(false);
  const [loaderSecao, setLoaderSecao] = useState(false);

  useEffect(() => {
    const ehSomenteConsulta = verificaSomenteConsulta(permissoesTela);
    setSomenteConsulta(ehSomenteConsulta);
  }, [permissoesTela]);

  const aoClicarBotaoExcluir = async () => {
    if (!somenteConsulta && match?.params?.id && permissoesTela.podeExcluir) {
      const confirmado = await confirmar(
        'Atenção',
        'Você tem certeza que deseja excluir este registro?'
      );
      if (confirmado) {
        setLoaderSecao(true);
        const resposta = await ServicoComunicados.excluir([match?.params?.id])
          .catch(e => erros(e))
          .finally(() => setLoaderSecao(false));

        if (resposta?.status === 200) {
          sucesso('Registro excluído com sucesso');
          history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
        }
      }
    }
  };

  const aoClicarBotaoCadastrar = async () => {
    if (
      !somenteConsulta &&
      (permissoesTela.podeIncluir || permissoesTela.podeAlterar)
    ) {
      const dadosSalvar = {
        anoLetivo: filtros?.anoLetivo,
        CodigoDre: filtros?.dreCodigo,
        CodigoUe: filtros?.ueCodigo,
        modalidades: filtros?.modalidades,
        semestre: filtros?.semestre || 0,
        tipoEscola: filtros?.tipoEscola,
        ano: filtros?.anoEscolares,
        turmas: filtros?.turmasCodigo,
        alunos: filtros?.alunosSelecionados,
        alunosEspecificados: filtros?.alunoEspecificado,
        seriesResumidas: '',
        tipoCalendarioId: filtros?.tipoCalendarioId,
        eventoId: filtros?.eventoId,
        dataEnvio: filtros?.dataEnvio,
        dataExpiracao: filtros?.dataExpiracao,
        titulo: filtros?.titulo,
        descricao: filtros?.descricaoComunicado,
      };

      console.log('dadosSalvar', dadosSalvar);

      setLoaderSecao(true);

      const resposta = await ServicoComunicados.salvar(dadosSalvar)
        .catch(e => erros(e))
        .finally(() => setLoaderSecao(false));

      if (resposta.status === 200) {
        history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
        sucesso(
          `Comunicado ${
            match?.params?.id ? 'alterado' : 'cadastrado'
          } com sucesso`
        );
      }
    }
  };

  const aoClicarBotaoVoltar = async () => {
    if (
      modoEdicao &&
      !somenteConsulta &&
      (permissoesTela.podeIncluir || permissoesTela.podeAlterar)
    ) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        aoClicarBotaoCadastrar();
      } else {
        history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
      }
    } else {
      history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
    }
  };

  const resetarTela = () => {
    setModoEdicao(false);
    setResetarFiltros(true);
  };

  const aoClicarBotaoCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) resetarTela();
    }
  };

  const converterData = valor =>
    valor ? moment(valor).format('MM-DD-YYYY') : '';

  const onChangeFiltros = valoresFiltro => {
    setFiltros(estadoAntigo => ({
      ...estadoAntigo,
      ...valoresFiltro,
      dataEnvio: converterData(valoresFiltro.dataEnvio),
      dataExpiracao: converterData(valoresFiltro.dataExpiracao),
    }));
  };

  console.log('filtros', filtros);

  return (
    <>
      <Cabecalho pagina="Comunicação com pais ou responsáveis" classes="mb-2" />

      <Loader loading={loaderSecao} ignorarTip>
        <Card>
          <div className="col-md-12 p-0">
            <div className="row mb-4">
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
                  disabled={
                    somenteConsulta ||
                    !modoEdicao ||
                    !permissoesTela.podeIncluir ||
                    !permissoesTela.podeAlterar
                  }
                />
                <Button
                  id="botao-excluir"
                  label="Excluir"
                  color={Colors.Vermelho}
                  onClick={aoClicarBotaoExcluir}
                  border
                  className="mr-3"
                  disabled={
                    somenteConsulta ||
                    !match?.params?.id ||
                    !permissoesTela.podeExcluir
                  }
                />
                {match?.params?.id ? (
                  <Button
                    id="botao-alterar"
                    label="Alterar"
                    color={Colors.Roxo}
                    onClick={aoClicarBotaoCadastrar}
                    disabled={somenteConsulta || !permissoesTela.podeAlterar}
                  />
                ) : (
                  <Button
                    id="botao-cadastrar"
                    label="Cadastrar"
                    color={Colors.Roxo}
                    onClick={aoClicarBotaoCadastrar}
                    disabled={somenteConsulta || !permissoesTela.podeIncluir}
                  />
                )}
              </div>
            </div>
            <Filtros onChangeFiltros={onChangeFiltros} />
          </div>
        </Card>
      </Loader>
    </>
  );
};

CadastroComunicados.propTypes = {
  match: PropTypes.objectOf(PropTypes.object),
};

CadastroComunicados.defaultProps = {
  match: {},
};

export default CadastroComunicados;
