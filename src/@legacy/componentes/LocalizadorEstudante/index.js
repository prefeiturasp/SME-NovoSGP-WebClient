import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import { Label } from '~/componentes';
import { erros, erro } from '~/servicos/alertas';
import InputCodigo from './componentes/InputCodigo';
import InputNome from './componentes/InputNome';
import service from './services/LocalizadorEstudanteService';
import { store } from '@/core/redux';
import { setAlunosCodigo } from '~/redux/modulos/localizadorEstudante/actions';
import { removerNumeros } from '~/utils/funcoes/gerais';
import { SGP_INPUT_CODIGO_EOL } from '~/constantes/ids/input';

const LocalizadorEstudante = props => {
  const {
    onChange,
    showLabel,
    desabilitado,
    ueId,
    anoLetivo,
    codigoTurma,
    exibirCodigoEOL,
    valorInicialAlunoCodigo,
    placeholder,
    semMargin,
    limparCamposAposPesquisa,
    labelAlunoNome,
    id,
    novaEstrutura,
  } = props;

  const classeCodigo = semMargin
    ? 'col-sm-12 col-md-6 col-lg-4 col-xl-4 p-0 pl-4'
    : 'col-sm-12 col-md-6 col-lg-4 col-xl-4';

  const [dataSource, setDataSource] = useState([]);
  const [pessoaSelecionada, setPessoaSelecionada] = useState({});
  const [desabilitarCampo, setDesabilitarCampo] = useState({
    codigo: false,
    nome: false,
  });
  const [timeoutBuscarPorCodigoNome, setTimeoutBuscarPorCodigoNome] =
    useState('');
  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    setPessoaSelecionada({
      alunoCodigo: '',
      alunoNome: '',
      codigoTurma: '',
      turmaId: '',
      nomeComModalidadeTurma: '',
      semestre: '',
      modalidadeCodigo: '',
    });
    setDesabilitarCampo({
      codigo: false,
      nome: false,
    });
    setDataSource([]);
  }, [ueId, codigoTurma]);

  useEffect(() => {
    if (Object.keys(pessoaSelecionada).length && limparCamposAposPesquisa) {
      setPessoaSelecionada({});
      setDesabilitarCampo({
        codigo: false,
        nome: false,
      });
    }
  }, [pessoaSelecionada, limparCamposAposPesquisa]);

  const limparDados = limpouDados => {
    onChange(undefined, limpouDados);
    setDataSource([]);
    setPessoaSelecionada({
      alunoCodigo: '',
      alunoNome: '',
      codigoTurma: '',
      turmaId: '',
      nomeComModalidadeTurma: '',
      semestre: '',
      modalidadeCodigo: '',
    });
    setTimeout(() => {
      setDesabilitarCampo(() => ({
        codigo: false,
        nome: false,
      }));
    }, 200);
  };

  const onChangeNome = async valor => {
    valor = removerNumeros(valor);
    if (valor.length === 0) {
      limparDados();
      return;
    }

    if (valor.length < 3) return;

    const params = {
      nome: valor,
      codigoUe: ueId,
      anoLetivo,
    };

    if (codigoTurma) {
      params.codigoTurma = codigoTurma;
    }
    setExibirLoader(true);
    const retorno = await service.buscarPorNome(params).catch(e => {
      if (e?.response?.status === 601) {
        erro('Estudante/Criança não encontrado no EOL');
      } else {
        erros(e);
      }
      setExibirLoader(false);
      limparDados(true);
    });
    setExibirLoader(false);
    if (retorno?.data?.items?.length > 0) {
      setDataSource([]);
      setDataSource(
        retorno.data.items.map(aluno => ({
          alunoCodigo: aluno.codigo,
          alunoNome: aluno.nome,
          codigoTurma: aluno.codigoTurma,
          turmaId: aluno.turmaId,
          nomeComModalidadeTurma: aluno.nomeComModalidadeTurma,
          semestre: aluno?.semestre,
          modalidadeCodigo: aluno?.modalidadeCodigo,
        }))
      );

      if (retorno?.data?.items?.length === 1) {
        const p = retorno.data.items[0];
        const pe = {
          alunoCodigo: parseInt(p.codigo, 10),
          alunoNome: p.nome,
          codigoTurma: p.codigoTurma,
          turmaId: p.turmaId,
          semestre: p?.semestre,
          modalidadeCodigo: p?.modalidadeCodigo,
        };
        setPessoaSelecionada(pe);
        setDesabilitarCampo(estado => ({
          ...estado,
          codigo: true,
        }));
        onChange(pe);
      }
    }
  };

  const onBuscarPorCodigo = async codigo => {
    if (!codigo.codigo) {
      limparDados();
      return;
    }
    const params = {
      codigo: codigo.codigo,
      codigoUe: ueId,
      anoLetivo,
    };

    if (codigoTurma) {
      params.codigoTurma = codigoTurma;
    }

    setExibirLoader(true);
    const retorno = await service.buscarPorCodigo(params).catch(e => {
      setExibirLoader(false);
      if (e?.response?.status === 601) {
        erro('Estudante/Criança não encontrado no EOL');
      } else {
        erros(e);
      }
      limparDados(true);
    });

    setExibirLoader(false);

    if (retorno?.data?.items?.length > 0) {
      const primeiroAluno = retorno.data.items[0];

      const {
        codigo: cAluno,
        nome,
        turmaId,
        nomeComModalidadeTurma,
      } = primeiroAluno;

      const semestre = primeiroAluno?.semestre;
      const modalidadeCodigo = primeiroAluno?.modalidadeCodigo;
      const alunoCodigoTurma = primeiroAluno?.codigoTurma;

      setDataSource(
        retorno.data.items.map(aluno => ({
          alunoCodigo: aluno.codigo,
          alunoNome: aluno.nome,
          codigoTurma: aluno.codigoTurma,
          turmaId: aluno.turmaId,
          nomeComModalidadeTurma: aluno.nomeComModalidadeTurma,
          semestre: aluno?.semestre,
          modalidadeCodigo: aluno?.modalidadeCodigo,
        }))
      );
      setPessoaSelecionada({
        alunoCodigo: parseInt(cAluno, 10),
        alunoNome: nome,
        codigoTurma: alunoCodigoTurma,
        turmaId,
        nomeComModalidadeTurma,
        semestre,
        modalidadeCodigo,
      });
      setDesabilitarCampo(estado => ({
        ...estado,
        nome: true,
      }));
      onChange({
        alunoCodigo: parseInt(cAluno, 10),
        alunoNome: nome,
        codigoTurma: alunoCodigoTurma,
        turmaId,
        nomeComModalidadeTurma,
        semestre,
        modalidadeCodigo,
      });
    }
  };

  const validaAntesBuscarPorCodigo = valor => {
    if (timeoutBuscarPorCodigoNome) {
      clearTimeout(timeoutBuscarPorCodigoNome);
    }

    if (ueId) {
      const timeout = setTimeout(() => {
        onBuscarPorCodigo(valor);
      }, 800);

      setTimeoutBuscarPorCodigoNome(timeout);
    }
  };

  const validaAntesBuscarPorNome = valor => {
    if (timeoutBuscarPorCodigoNome) {
      clearTimeout(timeoutBuscarPorCodigoNome);
    }

    if (ueId) {
      const timeout = setTimeout(() => {
        onChangeNome(valor);
      }, 800);

      setTimeoutBuscarPorCodigoNome(timeout);
    }
  };

  const onChangeCodigo = valor => {
    if (valor.length === 0) {
      limparDados();
    }
  };

  const onSelectPessoa = objeto => {
    const pessoa = {
      alunoCodigo: parseInt(objeto.key, 10),
      alunoNome: objeto.props.value,
      codigoTurma: objeto.props.codigoTurma,
      turmaId: objeto.props.turmaId,
      nomeComModalidadeTurma: objeto.props.nomeComModalidadeTurma,
      semestre: objeto?.props?.semestre,
      modalidadeCodigo: objeto?.props?.modalidadeCodigo,
    };
    setPessoaSelecionada(pessoa);
    onChange(pessoa);
    setDesabilitarCampo(estado => ({
      ...estado,
      codigo: true,
    }));
  };

  useEffect(() => {
    if (pessoaSelecionada && pessoaSelecionada.alunoCodigo) {
      const dados = [pessoaSelecionada.alunoCodigo];
      store.dispatch(setAlunosCodigo(dados));
    } else {
      store.dispatch(setAlunosCodigo([]));
    }
  }, [pessoaSelecionada]);

  useEffect(() => {
    if (
      valorInicialAlunoCodigo &&
      !pessoaSelecionada?.alunoCodigo &&
      !dataSource?.length
    ) {
      validaAntesBuscarPorCodigo({ codigo: valorInicialAlunoCodigo });
    }
  }, [valorInicialAlunoCodigo, dataSource, pessoaSelecionada]);

  return novaEstrutura ? (
    <>
      <Col sm={24} md={24} lg={exibirCodigoEOL ? 10 : 16}>
        {showLabel && <Label text={labelAlunoNome} control="alunoNome" />}

        <InputNome
          id={id}
          placeholder={placeholder}
          dataSource={dataSource}
          onSelect={onSelectPessoa}
          onChange={validaAntesBuscarPorNome}
          pessoaSelecionada={pessoaSelecionada}
          name="alunoNome"
          desabilitado={desabilitado || desabilitarCampo.nome}
          regexIgnore={/\d+/}
          exibirLoader={exibirLoader}
        />
      </Col>

      {exibirCodigoEOL && (
        <Col sm={24} md={24} lg={6}>
          {showLabel && <Label text="Código EOL" control="alunoCodigo" />}
          <InputCodigo
            id={SGP_INPUT_CODIGO_EOL}
            pessoaSelecionada={pessoaSelecionada}
            onSelect={validaAntesBuscarPorCodigo}
            onChange={onChangeCodigo}
            name="alunoCodigo"
            desabilitado={desabilitado || desabilitarCampo.codigo}
            exibirLoader={exibirLoader}
          />
        </Col>
      )}
    </>
  ) : (
    <React.Fragment>
      <div
        className={`${
          exibirCodigoEOL ? 'col-sm-12 col-md-6 col-lg-8 col-xl-8' : 'col-md-12'
        } `}
      >
        {showLabel && <Label text={labelAlunoNome} control="alunoNome" />}
        <InputNome
          id={id}
          placeholder={placeholder}
          dataSource={dataSource}
          onSelect={onSelectPessoa}
          onChange={validaAntesBuscarPorNome}
          pessoaSelecionada={pessoaSelecionada}
          name="alunoNome"
          desabilitado={desabilitado || desabilitarCampo.nome}
          regexIgnore={/\d+/}
          exibirLoader={exibirLoader}
        />
      </div>
      {exibirCodigoEOL ? (
        <div className={classeCodigo}>
          {showLabel && <Label text="Código EOL" control="alunoCodigo" />}
          <InputCodigo
            id={SGP_INPUT_CODIGO_EOL}
            pessoaSelecionada={pessoaSelecionada}
            onSelect={validaAntesBuscarPorCodigo}
            onChange={onChangeCodigo}
            name="alunoCodigo"
            desabilitado={desabilitado || desabilitarCampo.codigo}
            exibirLoader={exibirLoader}
          />
        </div>
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

LocalizadorEstudante.propTypes = {
  onChange: PropTypes.func,
  showLabel: PropTypes.bool,
  desabilitado: PropTypes.bool,
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoTurma: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  exibirCodigoEOL: PropTypes.bool,
  valorInicialAlunoCodigo: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  placeholder: PropTypes.string,
  semMargin: PropTypes.bool,
  limparCamposAposPesquisa: PropTypes.bool,
  labelAlunoNome: PropTypes.string,
  id: PropTypes.string,
  novaEstrutura: PropTypes.bool,
};

LocalizadorEstudante.defaultProps = {
  onChange: () => {},
  showLabel: false,
  desabilitado: false,
  ueId: '',
  anoLetivo: '',
  codigoTurma: '',
  exibirCodigoEOL: true,
  valorInicialAlunoCodigo: '',
  placeholder: '',
  semMargin: false,
  limparCamposAposPesquisa: false,
  labelAlunoNome: 'Nome',
  id: '',
  novaEstrutura: false,
};

export default LocalizadorEstudante;
