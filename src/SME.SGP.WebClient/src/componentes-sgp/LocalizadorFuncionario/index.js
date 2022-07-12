import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Label } from '~/componentes';
import { erro, erros } from '~/servicos/alertas';
import { removerNumeros } from '~/utils/funcoes/gerais';
import InputCodigo from './componentes/InputCodigo';
import InputNome from './componentes/InputNome';
import ServicoLocalizadorFuncionario from './services/ServicoLocalizadorFuncionario';

const LocalizadorFuncionario = props => {
  const {
    onChange,
    desabilitado,
    codigoUe,
    codigoDre,
    codigoTurma,
    exibirCampoRf,
    valorInicial,
    placeholder,
    url,
    limparCampos,
    mensagemErroConsultaRF,
    limparCamposAposPesquisa,
    dasativaCampoRf,
  } = props;

  const [dataSource, setDataSource] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState({});
  const [desabilitarCampo, setDesabilitarCampo] = useState({
    codigoRF: false,
    nomeServidor: false,
  });
  const [timeoutBuscarPorCodigoNome, setTimeoutBuscarPorCodigoNome] = useState(
    ''
  );
  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    setFuncionarioSelecionado({
      nomeServidor: '',
      codigoRF: '',
      usuarioId: null,
    });
    setDataSource([]);
  }, [codigoDre, codigoUe, codigoTurma]);

  const limparDados = useCallback(
    isOnChangeManual => {
      onChange(null, isOnChangeManual);
      setDataSource([]);
      setFuncionarioSelecionado({
        nomeServidor: '',
        codigoRF: '',
        usuarioId: null,
      });
      setTimeout(() => {
        setDesabilitarCampo(() => ({
          codigoRF: false,
          nomeServidor: false,
        }));
      }, 200);
    },
    [onChange]
  );

  const onChangeNome = async (valor, isOnChangeManual) => {
    valor = removerNumeros(valor);
    if (valor.length === 0) {
      limparDados(isOnChangeManual);
      return;
    }

    if (valor.length < 3) return;

    const params = {
      nome: valor,
    };

    if (codigoDre) {
      params.codigoDre = codigoDre;
    }
    if (codigoUe) {
      params.codigoUe = codigoUe;
    }
    if (codigoTurma) {
      params.codigoTurma = codigoTurma;
    }
    setExibirLoader(true);
    const retorno = await ServicoLocalizadorFuncionario.buscarPorNome(
      params,
      url
    )
      .catch(e => {
        erros(e);
        limparDados(isOnChangeManual);
      })
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.items?.length > 0) {
      setDataSource([]);
      setDataSource(
        retorno.data.items.map(funcionario => ({
          codigoRF: funcionario.codigoRf,
          nomeServidor: funcionario.nomeServidor,
          usuarioId: funcionario.usuarioId,
        }))
      );
    } else {
      setDataSource([]);
      setDesabilitarCampo(() => ({
        codigoRF: false,
        nomeServidor: false,
      }));
      setFuncionarioSelecionado({
        codigoRF: '',
        nomeServidor: valor,
      });
    }
  };

  const onBuscarPorCodigo = useCallback(
    async (valor, isOnChangeManual) => {
      if (!valor) {
        limparDados(isOnChangeManual);
        return;
      }
      const params = {
        codigoRF: valor,
      };

      if (codigoDre) {
        params.codigoDre = codigoDre;
      }
      if (codigoUe) {
        params.codigoUe = codigoUe;
      }
      if (codigoTurma) {
        params.codigoTurma = codigoTurma;
      }

      setExibirLoader(true);
      const retorno = await ServicoLocalizadorFuncionario.buscarPorCodigo(
        params,
        url
      )
        .catch(e => {
          if (mensagemErroConsultaRF) {
            erro(mensagemErroConsultaRF);
          } else {
            erros(e);
          }
          limparDados(isOnChangeManual);
        })
        .finally(() => setExibirLoader(false));

      if (retorno?.data?.items?.length > 0) {
        const { codigoRf, nomeServidor, usuarioId } = retorno.data.items[0];

        const funcionarioRetorno = {
          codigoRF: codigoRf,
          nomeServidor,
          usuarioId,
        };
        setDataSource(
          retorno.data.items.map(funcionario => ({
            codigoRF: funcionario.codigoRf,
            nomeServidor: funcionario.nomeServidor,
            usuarioId: funcionario.usuarioId,
          }))
        );
        setFuncionarioSelecionado(funcionarioRetorno);
        setDesabilitarCampo(estado => ({
          ...estado,
          nomeServidor: true,
        }));
        onChange(funcionarioRetorno, isOnChangeManual);
        if (limparCamposAposPesquisa) {
          limparDados(isOnChangeManual);
        }
      } else {
        if (!mensagemErroConsultaRF) {
          erro('Funcionário não encontrado');
        }
        setDataSource([]);
        setDesabilitarCampo(() => ({
          codigoRF: false,
          nomeServidor: false,
        }));
        setFuncionarioSelecionado({
          codigoRF: valor,
          nomeServidor: '',
        });
      }
    },
    [codigoDre, codigoTurma, codigoUe, limparDados, onChange]
  );

  const validaAntesBuscarPorCodigo = useCallback(
    (valor, isOnChangeManual) => {
      if (timeoutBuscarPorCodigoNome) {
        clearTimeout(timeoutBuscarPorCodigoNome);
      }

      const timeout = setTimeout(() => {
        onBuscarPorCodigo(valor, isOnChangeManual);
      }, 500);

      setTimeoutBuscarPorCodigoNome(timeout);
    },
    [onBuscarPorCodigo, timeoutBuscarPorCodigoNome]
  );

  const validaAntesBuscarPorNome = (valor, isOnChangeManual) => {
    if (timeoutBuscarPorCodigoNome) {
      clearTimeout(timeoutBuscarPorCodigoNome);
    }

    const timeout = setTimeout(() => {
      onChangeNome(valor, isOnChangeManual);
    }, 500);

    setTimeoutBuscarPorCodigoNome(timeout);
  };

  const onChangeCodigo = (valor, isOnChangeManual) => {
    if (valor.length === 0) {
      limparDados(isOnChangeManual);
    }
  };

  const onSelectFuncionario = (objeto, isOnChangeManual) => {
    const funcionario = {
      codigoRF: objeto.key,
      nomeServidor: objeto.props.value,
      usuarioId: objeto.props.usuarioId,
    };
    setFuncionarioSelecionado(funcionario);
    onChange(funcionario, isOnChangeManual);
    setDesabilitarCampo(estado => ({
      ...estado,
      codigoRF: true,
    }));
    if (limparCamposAposPesquisa) {
      limparDados(isOnChangeManual);
    }
  };

  useEffect(() => {
    if (
      valorInicial &&
      valorInicial?.codigoRF &&
      !funcionarioSelecionado?.codigoRF &&
      !dataSource?.length
    ) {
      if (valorInicial?.nomeServidor) {
        setFuncionarioSelecionado({
          codigoRF: valorInicial?.codigoRF,
          nomeServidor: valorInicial?.nomeServidor,
        });
      } else {
        validaAntesBuscarPorCodigo(valorInicial.codigoRF);
      }
    }
  }, [valorInicial, dataSource, funcionarioSelecionado]);

  useEffect(() => {
    if (limparCampos) {
      limparDados(true);
    }
  }, [limparCampos, limparDados]);

  return (
    <>
      <div
        className={`${
          exibirCampoRf ? 'col-sm-12 col-md-6 col-lg-8 col-xl-8' : 'col-md-12'
        } `}
      >
        <Label text="Nome" />
        <InputNome
          placeholder={placeholder}
          dataSource={dataSource}
          onSelect={valor => onSelectFuncionario(valor, true)}
          onChange={valor => validaAntesBuscarPorNome(valor, true)}
          funcionarioSelecionado={funcionarioSelecionado}
          name="nomeServidor"
          desabilitado={desabilitado || desabilitarCampo.nomeServidor}
          regexIgnore={/\d+/}
          exibirLoader={exibirLoader}
        />
      </div>
      {exibirCampoRf ? (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <Label text="RF" />
          <InputCodigo
            funcionarioSelecionado={funcionarioSelecionado}
            onSelect={valor => validaAntesBuscarPorCodigo(valor, true)}
            onChange={valor => onChangeCodigo(valor, true)}
            name="codigoRF"
            desabilitado={desabilitado || dasativaCampoRf}
            exibirLoader={exibirLoader}
          />
        </div>
      ) : (
        ''
      )}
    </>
  );
};

LocalizadorFuncionario.propTypes = {
  onChange: PropTypes.func,
  desabilitado: PropTypes.bool,
  codigoUe: PropTypes.oneOfType([PropTypes.any]),
  codigoDre: PropTypes.oneOfType([PropTypes.any]),
  codigoTurma: PropTypes.oneOfType([PropTypes.any]),
  exibirCampoRf: PropTypes.bool,
  valorInicial: PropTypes.oneOfType([PropTypes.any]),
  placeholder: PropTypes.string,
  url: PropTypes.string,
  limparCampos: PropTypes.bool,
  mensagemErroConsultaRF: PropTypes.string,
  limparCamposAposPesquisa: PropTypes.bool,
  dasativaCampoRf: PropTypes.bool,
};

LocalizadorFuncionario.defaultProps = {
  onChange: () => {},
  desabilitado: false,
  codigoUe: '',
  codigoDre: '',
  codigoTurma: '',
  exibirCampoRf: true,
  valorInicial: '',
  placeholder: '',
  url: '',
  limparCampos: false,
  mensagemErroConsultaRF: '',
  limparCamposAposPesquisa: false,
  dasativaCampoRf: false,
};

export default LocalizadorFuncionario;
