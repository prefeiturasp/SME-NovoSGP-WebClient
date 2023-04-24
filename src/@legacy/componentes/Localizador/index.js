import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// Redux
import { useSelector } from 'react-redux';

// Componentes
import { Col } from 'antd';
import InputRF from './componentes/InputRF';
import InputNome from './componentes/InputNome';
import { Grid, Label } from '~/componentes';

// Services
import service from './services/LocalizadorService';
import { erro, erros } from '~/servicos/alertas';

// Funções
import { validaSeObjetoEhNuloOuVazio } from '~/utils/funcoes/gerais';

// Utils
import RFNaoEncontradoExcecao from '~/utils/excecoes/RFNãoEncontradoExcecao';
import { SGP_INPUT_NOME, SGP_INPUT_RF } from '~/constantes/ids/input';

function Localizador({
  onChange,
  showLabel,
  form,
  dreId,
  anoLetivo,
  desabilitado,
  rfEdicao,
  buscarOutrosCargos,
  buscandoDados,
  labelRF,
  placeholderRF,
  placeholderNome,
  labelNome,
  classesRF,
  limparCamposAposPesquisa,
  validaPerfilProfessor,
  mensagemErroConsultaRF,
  colunasNome,
  buscarCaracterPartir,
  ueId,
  buscarPorAbrangencia,
  labelRequired,
  buscarPorTodasDre,
  novaEstrutura,
}) {
  const usuario = useSelector(store => store.usuario);
  const [dataSource, setDataSource] = useState([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState({});
  const [desabilitarCampo, setDesabilitarCampo] = useState({
    rf: false,
    nome: false,
  });
  const { ehPerfilProfessor } = usuario;
  const usuarioRf = usuario?.rf;
  const [exibirLoader, setExibirLoader] = useState(false);

  const validacaoDesabilitaPerfilProfessor = () => {
    return validaPerfilProfessor && ehPerfilProfessor;
  };

  const onChangeInput = async valor => {
    if (valor.length === 0) {
      setPessoaSelecionada({
        professorRf: '',
        professorNome: '',
        usuarioId: '',
      });
      setTimeout(() => {
        setDesabilitarCampo(() => ({
          rf: false,
          nome: false,
        }));
      }, 200);
    }

    if (valor.length === 0) {
      setDataSource([]);
      return;
    }

    if (valor.length < buscarCaracterPartir) return;
    setDataSource([]);
    setExibirLoader(true);

    if (!anoLetivo) return;

    const { data: dados } = await service
      .buscarAutocomplete({
        nome: valor,
        dreId,
        anoLetivo,
        ueId,
      })
      .finally(() => setExibirLoader(false));

    if (dados && dados.length > 0) {
      setDataSource(
        dados.map(x => ({
          professorRf: x.codigoRF,
          professorNome: x.nome,
          usuarioId: x.usuarioId,
        }))
      );
    }
  };

  const onBuscarPorRF = useCallback(
    async ({ rf }) => {
      try {
        if (buscarPorAbrangencia && !ueId) return;

        if (!rf) {
          erro('O campo RF é obrigatório.');
          return;
        }

        if (!anoLetivo) return;

        buscandoDados(true);
        setExibirLoader(true);
        const { data: dados } = await service
          .buscarPorRf({
            rf,
            anoLetivo,
            buscarOutrosCargos,
            dreId,
            ueId,
            buscarPorAbrangencia,
            buscarPorTodasDre,
          })
          .finally(() => setExibirLoader(false));

        if (!dados) throw new RFNaoEncontradoExcecao();

        setPessoaSelecionada({
          professorRf: dados.codigoRF,
          professorNome: dados.nome,
          usuarioId: dados.usuarioId,
        });

        setDesabilitarCampo(estado => ({
          ...estado,
          nome: true,
        }));
        buscandoDados(false);
      } catch (error) {
        if (mensagemErroConsultaRF) {
          erro(mensagemErroConsultaRF);
        } else {
          erros(error);
        }
        buscandoDados(false);
        setPessoaSelecionada({
          professorRf: '',
          professorNome: '',
          usuarioId: '',
        });
      }
    },

    [anoLetivo, buscarOutrosCargos, mensagemErroConsultaRF, dreId, ueId]
  );

  const onChangeRF = valor => {
    if (valor.length === 0) {
      setPessoaSelecionada({
        professorRf: '',
        professorNome: '',
        usuarioId: '',
      });
      setDesabilitarCampo(estado => ({
        ...estado,
        nome: false,
      }));
    }
  };

  const onSelectPessoa = objeto => {
    setPessoaSelecionada({
      professorRf: parseInt(objeto.key, 10),
      professorNome: objeto.props.value,
      usuarioId: objeto.props?.usuarioId,
    });
    setDesabilitarCampo(estado => ({
      ...estado,
      rf: true,
    }));
  };

  useEffect(() => {
    if (rfEdicao && !pessoaSelecionada?.professorRf) {
      onBuscarPorRF({ rf: rfEdicao });
    } else if (!form && !rfEdicao) {
      setPessoaSelecionada({
        professorRf: '',
        professorNome: '',
        usuarioId: '',
      });
    }

  }, [rfEdicao]);

  useEffect(() => {
    onChange(pessoaSelecionada);
    if (form) {
      form.setValues({
        ...form.values,
        ...pessoaSelecionada,
      });
    }

  }, [pessoaSelecionada]);

  useEffect(() => {
    if (form) {
      if (validaSeObjetoEhNuloOuVazio(form.initialValues)) return;
      if (form.initialValues) {
        setPessoaSelecionada(form.initialValues);
      }
    }

  }, [form?.initialValues]);

  useEffect(() => {
    if (dreId && ueId && validacaoDesabilitaPerfilProfessor()) {
      onBuscarPorRF({ rf: usuarioRf });
    }

  }, [dreId, ueId, ehPerfilProfessor, usuarioRf, onBuscarPorRF]);

  useEffect(() => {
    if (form) {
      const { values: valores } = form;
      if (valores && !valores.professorRf && pessoaSelecionada.professorRf) {
        setPessoaSelecionada({
          professorRf: '',
          professorNome: '',
          usuarioId: '',
        });
        setDesabilitarCampo({
          rf: false,
          nome: false,
        });
        setDataSource([]);
      }
    }

  }, [form?.values]);

  useEffect(() => {
    if (Object.keys(pessoaSelecionada).length && limparCamposAposPesquisa) {
      setPessoaSelecionada({});
      setDesabilitarCampo({
        rf: false,
        nome: false,
      });
    }
  }, [pessoaSelecionada, limparCamposAposPesquisa]);

  if (novaEstrutura) {
    return (
      <>
        <Col sm={24} md={8}>
          {showLabel && (
            <Label
              text={labelRF}
              control="professorRf"
              isRequired={labelRequired}
            />
          )}
          <InputRF
            maxlength={11}
            id={SGP_INPUT_RF}
            pessoaSelecionada={pessoaSelecionada}
            onSelect={onBuscarPorRF}
            onChange={v => {
              if (v?.length === 0) {
                setDataSource([]);
              }
              onChangeRF(v);
            }}
            name="professorRf"
            placeholderRF={placeholderRF}
            form={form}
            desabilitado={
              desabilitado ||
              validacaoDesabilitaPerfilProfessor() ||
              desabilitarCampo.rf
            }
            exibirLoader={exibirLoader}
          />
        </Col>
        <Col sm={24} md={16}>
          {showLabel && (
            <Label
              text={labelNome}
              control="professorNome"
              isRequired={labelRequired}
            />
          )}
          <InputNome
            id={SGP_INPUT_NOME}
            dataSource={dataSource}
            onSelect={onSelectPessoa}
            onChange={onChangeInput}
            pessoaSelecionada={pessoaSelecionada}
            form={form}
            name="professorNome"
            placeholderNome={placeholderNome}
            desabilitado={
              desabilitado ||
              validacaoDesabilitaPerfilProfessor() ||
              desabilitarCampo.nome
            }
            exibirLoader={exibirLoader}
          />
        </Col>
      </>
    );
  }

  return (
    <>
      <Grid cols={4} className={classesRF}>
        {showLabel && (
          <Label
            text={labelRF}
            control="professorRf"
            isRequired={labelRequired}
          />
        )}
        <InputRF
          maxlength={11}
          id={SGP_INPUT_RF}
          pessoaSelecionada={pessoaSelecionada}
          onSelect={onBuscarPorRF}
          onChange={onChangeRF}
          name="professorRf"
          placeholderRF={placeholderRF}
          form={form}
          desabilitado={
            desabilitado ||
            validacaoDesabilitaPerfilProfessor() ||
            desabilitarCampo.rf
          }
          exibirLoader={exibirLoader}
        />
      </Grid>
      <Grid className="pr-0" cols={colunasNome}>
        {showLabel && (
          <Label
            text={labelNome}
            control="professorNome"
            isRequired={labelRequired}
          />
        )}
        <InputNome
          id={SGP_INPUT_NOME}
          dataSource={dataSource}
          onSelect={onSelectPessoa}
          onChange={onChangeInput}
          pessoaSelecionada={pessoaSelecionada}
          form={form}
          name="professorNome"
          placeholderNome={placeholderNome}
          desabilitado={
            desabilitado ||
            validacaoDesabilitaPerfilProfessor() ||
            desabilitarCampo.nome
          }
          exibirLoader={exibirLoader}
        />
      </Grid>
    </>
  );
}

Localizador.propTypes = {
  onChange: () => {},
  form: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.any,
  ]),
  showLabel: PropTypes.bool,
  dreId: PropTypes.string,
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  desabilitado: PropTypes.bool,
  rfEdicao: PropTypes.string,
  buscarOutrosCargos: PropTypes.bool,
  buscandoDados: PropTypes.func,
  labelRF: PropTypes.string,
  labelNome: PropTypes.string,
  placeholderRF: PropTypes.string,
  placeholderNome: PropTypes.string,
  classesRF: PropTypes.string,
  limparCamposAposPesquisa: PropTypes.bool,
  validaPerfilProfessor: PropTypes.bool,
  mensagemErroConsultaRF: PropTypes.string,
  colunasNome: PropTypes.string,
  buscarCaracterPartir: PropTypes.number,
  ueId: PropTypes.string,
  buscarPorAbrangencia: PropTypes.bool,
  labelRequired: PropTypes.bool,
  buscarPorTodasDre: PropTypes.bool,
  novaEstrutura: PropTypes.bool,
};

Localizador.defaultProps = {
  onChange: () => {},
  form: null,
  showLabel: false,
  dreId: null,
  anoLetivo: null,
  desabilitado: false,
  rfEdicao: '',
  buscarOutrosCargos: false,
  buscandoDados: () => {},
  labelRF: 'RF/CPF',
  labelNome: 'Nome',
  placeholderRF: 'Digite o RF/CPF',
  placeholderNome: 'Digite o nome da pessoa',
  classesRF: '',
  limparCamposAposPesquisa: false,
  validaPerfilProfessor: true,
  mensagemErroConsultaRF: '',
  colunasNome: '8',
  buscarCaracterPartir: 3,
  ueId: null,
  buscarPorAbrangencia: false,
  labelRequired: false,
  buscarPorTodasDre: false,
  novaEstrutura: false,
};

export default Localizador;
