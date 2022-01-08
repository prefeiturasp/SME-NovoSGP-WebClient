import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import CampoNumero from '~/componentes/campoNumero';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import { converterAcaoTecla } from '~/utils';

const ListaoCampoNota = props => {
  const { nota, onChangeNotaConceito, desabilitarCampo, name } = props;

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

  useEffect(() => {
    setNotaValorAtual(nota.notaConceito);
  }, [nota.notaConceito, nota.notaOriginal]);

  const setarValorNovo = async valorNovo => {
    if (!desabilitarCampo && nota.podeEditar) {
      setNotaValorAtual(valorNovo);
      const resto = valorNovo % 0.5;
      let notaArredondada = valorNovo;
      if (resto) {
        setNotaValorAtual(valorNovo);
        const retorno = await api
          .get(
            `v1/avaliacoes/${nota.atividadeAvaliativaId}/notas/${Number(
              valorNovo
            )}/arredondamento`
          )
          .catch(e => erros(e));

        if (retorno && retorno.data) {
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

  return (
    <CampoNumero
      styleContainer={{ height: 38 }}
      esconderSetas
      onKeyUp={apertarTecla}
      name={name}
      onChange={valorNovo => onChangeNota(valorNovo)}
      value={notaValorAtual}
      min={0}
      max={10}
      step={0}
      placeholder="Nota"
      disabled={desabilitarCampo}
    />
  );
};

ListaoCampoNota.defaultProps = {
  nota: {},
  onChangeNotaConceito: () => {},
  desabilitarCampo: false,
  name: '',
};

ListaoCampoNota.propTypes = {
  nota: PropTypes.oneOf(PropTypes.any),
  onChangeNotaConceito: PropTypes.func,
  desabilitarCampo: PropTypes.bool,
  name: PropTypes.string,
};

export default ListaoCampoNota;
