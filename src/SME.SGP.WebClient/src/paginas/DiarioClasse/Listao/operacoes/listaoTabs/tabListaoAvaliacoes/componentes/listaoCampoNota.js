import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import InputNumberReadOnly from '~/componentes-sgp/camposSomenteLeitura/inputNumberReadOnly';
import CampoNumero from '~/componentes/campoNumero';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import { converterAcaoTecla } from '~/utils';

const ListaoCampoNota = props => {
  const { dadosNota, idCampo, desabilitar, onChangeNotaConceito } = props;

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

  useEffect(() => {
    setNotaValorAtual(dadosNota.notaConceito);
  }, [dadosNota.notaConceito, dadosNota.notaOriginal]);

  const setarValorNovo = async valorNovo => {
    if (!desabilitar && dadosNota.podeEditar) {
      setNotaValorAtual(valorNovo);
      const resto = valorNovo % 0.5;
      let notaArredondada = valorNovo;
      if (resto) {
        setNotaValorAtual(valorNovo);
        const retorno = await api
          .get(
            `v1/avaliacoes/${dadosNota.atividadeAvaliativaId}/notas/${Number(
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

  const validarExibir = valor => {
    if (!desabilitar) {
      setExibir(valor);
    }
  };

  const formataNota = newValue => newValue?.toString?.()?.replace?.('.', ',');

  return (
    <div
      onFocus={() => validarExibir(true)}
      onMouseEnter={() => validarExibir(true)}
      onMouseLeave={() => validarExibir(false)}
    >
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
        />
      ) : (
        <InputNumberReadOnly
          key={idCampo}
          id={idCampo}
          value={formataNota(notaValorAtual)}
          disabled={desabilitar}
          placeholder="Nota"
        />
      )}
    </div>
  );
};

ListaoCampoNota.propTypes = {
  dadosNota: PropTypes.oneOf(PropTypes.any),
  idCampo: PropTypes.oneOf(PropTypes.any),
  desabilitar: PropTypes.bool,
  onChangeNotaConceito: PropTypes.func,
};

ListaoCampoNota.defaultProps = {
  dadosNota: {},
  idCampo: 'campo-nota-listao',
  desabilitar: false,
  onChangeNotaConceito: () => {},
};

export default ListaoCampoNota;
