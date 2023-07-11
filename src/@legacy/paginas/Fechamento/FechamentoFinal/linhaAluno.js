/* eslint-disable react/prop-types */
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MarcadorTriangulo } from '~/componentes';
import Nota from '~/componentes-sgp/inputs/nota';
import { moverFocoCampoNota } from '~/componentes-sgp/inputs/nota/funcoes';
import NomeEstudanteLista from '~/componentes-sgp/NomeEstudanteLista/nomeEstudanteLista';

import { setExpandirLinha } from '~/redux/modulos/notasConceitos/actions';
import { formatarFrequencia } from '~/utils';

import CampoConceitoFinal from './campoConceitoFinal';
import ColunaNotaFinalRegencia from './colunaNotaFinalRegencia';
import { Info } from './fechamentoFinal.css';
import LinhaConceitoFinal from './linhaConceitoFinal';

const LinhaAluno = ({
  dados,
  aluno,
  ehRegencia,
  ehNota,
  listaConceitos,
  disciplinaSelecionada,
  onChange,
  indexAluno,
  desabilitarCampo,
  ehSintese,
  registraFrequencia,
  dadosFechamentoFinal,
}) => {
  const notaMedia = dadosFechamentoFinal?.notaMedia;
  const dadosArredondamento = dadosFechamentoFinal?.dadosArredondamento;

  const expandirLinha = useSelector(
    store => store.notasConceitos.expandirLinha
  );
  const dispatch = useDispatch();

  const obterValorConceito = valor => {
    if (listaConceitos && listaConceitos.length) {
      const conceito = listaConceitos.find(
        item => Number(item.id) === Number(valor)
      );
      return conceito ? conceito.valor : '';
    }
    return '';
  };

  const montaLinhaNotasConceitos = () => {
    if (ehNota && ehRegencia) {
      return aluno.notasConceitoBimestre
        .filter(
          n => String(n.disciplinaCodigo) === String(disciplinaSelecionada)
        )
        .map(c => <div className="input-notas">{c.notaConceito}</div>);
    }

    if (ehNota && !ehRegencia) {
      return aluno.notasConceitoBimestre.map(c => (
        <div className="input-notas">{c.notaConceito}</div>
      ));
    }

    if (!ehNota && !ehRegencia) {
      return aluno.notasConceitoBimestre.map(c => (
        <div className="input-notas">{obterValorConceito(c.notaConceito)}</div>
      ));
    }

    return aluno.notasConceitoBimestre
      .filter(n => String(n.disciplinaCodigo) === String(disciplinaSelecionada))
      .map(c => (
        <div className="input-notas">{obterValorConceito(c.notaConceito)}</div>
      ));
  };

  const montaNotaFinal = (alunoConceito, indexNotaConceito) => {
    if (
      alunoConceito &&
      alunoConceito.notasConceitoFinal &&
      alunoConceito.notasConceitoFinal.length
    ) {
      if (ehRegencia) {
        return alunoConceito.notasConceitoFinal[indexNotaConceito];
      }
      return alunoConceito.notasConceitoFinal[0];
    }
    return '';
  };

  const onChangeNotaConceitoFinal = (notaBimestre, valorNovo) => {
    notaBimestre.notaConceito = valorNovo;
    onChange(aluno, valorNovo, notaBimestre.disciplinaCodigo);
  };

  const acaoExpandirLinha = (direcao, index) => {
    let novaLinha = [];
    const novoIndex = index + direcao;

    if (expandirLinha[novoIndex]) {
      expandirLinha[novoIndex] = false;
      novaLinha = expandirLinha;
    } else {
      novaLinha[novoIndex] = true;
    }
    dispatch(setExpandirLinha([...novaLinha]));
  };

  const onKeyDownNotaFinal = (e, alunoEscolhido, label) => {
    const qtdColunasSemCampoNota = ehRegencia ? 0 : 5;

    const params = {
      e,
      aluno: alunoEscolhido,
      alunos: dados,
      qtdColunasSemCampoNota,
      componenteCurricularNome: label,
      regencia: ehRegencia,
      chaveAluno: 'codigo',
      acaoExpandirLinha: direcao => acaoExpandirLinha(direcao, indexAluno),
    };

    moverFocoCampoNota(params);
  };

  const montarCampoNotaConceitoFinal = (
    alunoEscolhido,
    label,
    indexNotaConceito
  ) => {
    if (ehNota) {
      const dadosNota = montaNotaFinal(alunoEscolhido, indexNotaConceito);

      return (
        <Nota
          label={label}
          ehFechamento
          onKeyDown={e => onKeyDownNotaFinal(e, alunoEscolhido, label)}
          dadosNota={dadosNota}
          desabilitar={desabilitarCampo || !alunoEscolhido.podeEditar}
          id={`aluno${alunoEscolhido?.codigo}`}
          name={`aluno${alunoEscolhido?.codigo}`}
          dadosArredondamento={dadosArredondamento}
          mediaAprovacaoBimestre={notaMedia}
          onChangeNotaConceito={valorNovo =>
            onChangeNotaConceitoFinal(dadosNota, valorNovo)
          }
        />
      );
    }
    if (!ehNota) {
      return (
        <CampoConceitoFinal
          montaNotaConceitoFinal={() =>
            montaNotaFinal(aluno, indexNotaConceito)
          }
          onChangeNotaConceitoFinal={(nota, valor) =>
            onChangeNotaConceitoFinal(nota, valor)
          }
          desabilitarCampo={desabilitarCampo}
          podeEditar={aluno.podeEditar}
          listaTiposConceitos={listaConceitos}
          label={label}
        />
      );
    }
    return '';
  };

  return (
    <>
      <tr>
        <td className="col-numero-chamada">
          {aluno.informacao ? (
            <>
              <div className="linha-numero-chamada">{aluno.numeroChamada}</div>
              <Tooltip title={aluno.informacao} placement="top">
                <Info className="fas fa-circle" />
              </Tooltip>
            </>
          ) : (
            <div style={{ display: 'inline' }}>{aluno.numeroChamada}</div>
          )}
        </td>
        <td className="col-nome-aluno">
          <NomeEstudanteLista
            nome={aluno?.nome}
            ehAtendidoAEE={aluno?.ehAtendidoAEE}
            ehMatriculadoTurmaPAP={aluno?.ehMatriculadoTurmaPAP}
          />
        </td>
        {ehSintese ? (
          <td className="col-nota-conceito">{aluno.sintese}</td>
        ) : (
          <td className="col-nota-conceito">{montaLinhaNotasConceitos()}</td>
        )}
        <td>{aluno.totalFaltas}</td>
        <td>{aluno.totalAusenciasCompensadas}</td>
        {ehSintese ? (
          ''
        ) : (
          <td className="col-conceito-final position-relative">
            {ehRegencia ? (
              <ColunaNotaFinalRegencia indexLinha={indexAluno} />
            ) : (
              montarCampoNotaConceitoFinal(aluno)
            )}
            {aluno?.notasConceitoFinal?.length &&
              !!aluno.notasConceitoFinal?.find(n => n?.emAprovacao) && (
                <Tooltip title="Aguardando aprovação">
                  <MarcadorTriangulo />
                </Tooltip>
              )}
          </td>
        )}
        <td>{registraFrequencia && formatarFrequencia(aluno?.frequencia)}</td>
      </tr>
      <LinhaConceitoFinal
        indexLinha={indexAluno}
        aluno={aluno}
        montarCampoNotaConceitoFinal={(label, indexNotaConceito) =>
          montarCampoNotaConceitoFinal(aluno, label, indexNotaConceito)
        }
      />
    </>
  );
};

LinhaAluno.propTypes = {
  onChange: PropTypes.func,
  desabilitarCampo: PropTypes.bool,
  ehSintese: PropTypes.bool,
  aluno: PropTypes.oneOfType([PropTypes.any]),
  dadosFechamentoFinal: PropTypes.oneOfType([PropTypes.any]),
};

LinhaAluno.defaultProps = {
  onChange: () => {},
  desabilitarCampo: false,
  ehSintese: false,
  aluno: [],
  dadosFechamentoFinal: null,
};

export default LinhaAluno;
