import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Base } from '~/componentes';
import InputNumberReadOnly from '~/componentes-sgp/camposSomenteLeitura/inputNumberReadOnly';
import CampoNumero from '~/componentes/campoNumero';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import { converterAcaoTecla } from '~/utils';

const ListaoCampoNota = props => {
  const {
    dadosNota,
    idCampo,
    desabilitar,
    onChangeNotaConceito,
    ehFechamento,
    periodoFim,
    mediaAprovacaoBimestre,
  } = props;

  const [exibir, setExibir] = useState(false);
  const [notaValorAtual, setNotaValorAtual] = useState();
  const regexCaracteresInvalidos = /[^0-9,.]+/g;

  const removerCaracteresInvalidos = texto =>
    texto.replace(regexCaracteresInvalidos, '');

  const editouCampo = (notaOriginal, notaNova) => {
    notaOriginal = removerCaracteresInvalidos(String(notaOriginal));
    notaNova = removerCaracteresInvalidos(String(notaNova));
    if (notaOriginal === '' && notaNova === '') {
      return false;
    }
    return notaOriginal !== notaNova;
  };

  const estaAbaixoDaMedia = valorAtual => {
    if (!ehFechamento) return false;

    valorAtual = removerCaracteresInvalidos(String(valorAtual));
    return valorAtual && valorAtual < mediaAprovacaoBimestre;
  };

  const notaAlterada = nota => {
    if (nota === 0) return nota;
    const notaConceitoParseada = String(nota);
    const notaConceitoAlterada = notaConceitoParseada.replace(',', '.');
    const notaModificada = Number(notaConceitoAlterada);
    return notaModificada;
  };

  useEffect(() => {
    if (dadosNota?.notaConceito || dadosNota?.notaConceito === 0) {
      const nota = notaAlterada(dadosNota.notaConceito);
      setNotaValorAtual(nota);
    }
  }, [dadosNota]);

  const arredondamentoNota = valorValidar =>
    api.get(
      `v1/avaliacoes/${dadosNota?.atividadeAvaliativaId}/notas/${Number(
        valorValidar
      )}/arredondamento`
    );

  const arredondamentoNotaFinal = valorValidar => {
    return api.get(
      `v1/avaliacoes/notas/${Number(
        valorValidar
      )}/arredondamento?data=${periodoFim}`
    );
  };

  const validarArredondamento = valorValidar => {
    if (ehFechamento) {
      return arredondamentoNotaFinal(valorValidar);
    }
    return arredondamentoNota(valorValidar);
  };

  const setarValorNovo = async valorNovo => {
    if (!desabilitar) {
      setNotaValorAtual(valorNovo);
      const resto = valorNovo % 0.5;
      let notaArredondada = valorNovo;
      if (resto) {
        setNotaValorAtual(valorNovo);
        const retorno = await validarArredondamento(valorNovo).catch(e =>
          erros(e)
        );

        if (retorno?.data) {
          notaArredondada = retorno.data;
        }
      }

      onChangeNotaConceito(notaArredondada);
      setNotaValorAtual(notaArredondada);
    }
  };

  const valorInvalido = valorNovo =>
    regexCaracteresInvalidos.test(String(valorNovo));

  const onChangeNota = valorNovo => {
    let valorEnviado = null;
    if (valorNovo) {
      const invalido = valorInvalido(valorNovo);
      if (!invalido && editouCampo(notaValorAtual, valorNovo)) {
        valorEnviado = valorNovo;
      }
    }
    const valorCampo = valorNovo > 0 ? valorNovo : null;
    setarValorNovo(valorEnviado || valorCampo);
  };

  const apertarTecla = e => {
    const teclaEscolhida = converterAcaoTecla(e.keyCode);
    if (teclaEscolhida === 0 && !notaValorAtual) {
      setarValorNovo(0);
    }
  };

  const validarExibir = valor => {
    if (!desabilitar) {
      setExibir(valor);
    }
  };

  const formataNota = newValue => newValue?.toString?.()?.replace?.('.', ',');

  const styleCampo = {};

  if (estaAbaixoDaMedia(notaValorAtual)) {
    styleCampo.border = `solid 2px ${Base.Vermelho}`;
  }
  console.log('notaValorAtual', notaValorAtual);

  const montarCampo = () => (
    <div onFocus={() => validarExibir(true)}>
      {!desabilitar && exibir ? (
        <CampoNumero
          styleContainer={{ height: 38 }}
          esconderSetas
          onKeyUp={apertarTecla}
          name={idCampo}
          id={idCampo}
          onChange={valorNovo => onChangeNota(valorNovo)}
          value={notaValorAtual}
          min={0}
          max={10}
          step={0}
          placeholder="Nota"
          disabled={desabilitar}
          styleCampo={{ ...styleCampo }}
          maxlength={3}
          autoFocus
        />
      ) : (
        <InputNumberReadOnly
          key={idCampo}
          id={idCampo}
          value={formataNota(notaValorAtual)}
          disabled={desabilitar}
          placeholder="Nota"
          style={{ ...styleCampo }}
        />
      )}
    </div>
  );

  return ehFechamento ? (
    <Tooltip
      placement="top"
      title={estaAbaixoDaMedia(notaValorAtual) ? 'Abaixo da Média' : ''}
    >
      {montarCampo()}
    </Tooltip>
  ) : (
    montarCampo()
  );
};

ListaoCampoNota.propTypes = {
  dadosNota: PropTypes.oneOf(PropTypes.any),
  idCampo: PropTypes.oneOf(PropTypes.any),
  desabilitar: PropTypes.bool,
  onChangeNotaConceito: PropTypes.func,
  ehFechamento: PropTypes.bool,
  periodoFim: PropTypes.string,
  mediaAprovacaoBimestre: PropTypes.number,
};

ListaoCampoNota.defaultProps = {
  dadosNota: {},
  idCampo: 'campo-nota-listao',
  desabilitar: false,
  onChangeNotaConceito: () => {},
  ehFechamento: false,
  periodoFim: '',
  mediaAprovacaoBimestre: null,
};

export default ListaoCampoNota;
