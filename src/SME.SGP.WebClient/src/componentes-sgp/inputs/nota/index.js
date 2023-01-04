import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Base, CampoTexto, Label } from '~/componentes';
import InputNumberReadOnly from '~/componentes-sgp/camposSomenteLeitura/inputNumberReadOnly/inputNumberReadOnly';
import { arredondarNota } from '~/utils';
import LabelAusenteCellTable from './labelAusenteCellTable';

import { Container } from './style';

const Nota = props => {
  const {
    dadosNota,
    idCampo,
    desabilitar,
    onChangeNotaConceito,
    onChangeValorAtualExibicao,
    ehFechamento,
    mediaAprovacaoBimestre,
    dadosArredondamento,
    onKeyDown,
    label,
    validaAbaixoMedia,
    notaValorInicial,
    styleContainer,
    style,
  } = props;

  const [exibir, setExibir] = useState(false);
  const [notaValorAtual, setNotaValorAtual] = useState();
  const [notaValorAtualExibicao, setNotaValorAtualExibicao] = useState();

  const regexCaracteresInvalidos = /[^0-9,.]+/g;

  const removerCaracteresInvalidos = texto =>
    texto?.replace?.(regexCaracteresInvalidos, '');

  const estaAbaixoDaMedia = valorAtual => {
    if (!ehFechamento) return false;

    valorAtual = removerCaracteresInvalidos(String(valorAtual));
    return valorAtual && valorAtual < mediaAprovacaoBimestre;
  };

  const notaAlterada = nota => {
    if (nota === 0) return nota;
    const notaConceitoParseada = String(nota);
    const notaConceitoAlterada = notaConceitoParseada?.replace?.(',', '.');
    const notaModificada = Number(notaConceitoAlterada);
    return notaModificada;
  };

  useEffect(() => {
    if (dadosNota?.notaConceito || dadosNota?.notaConceito === 0) {
      const nota = notaAlterada(dadosNota.notaConceito);
      setNotaValorAtual(nota);
      setNotaValorAtualExibicao(nota);
    }
  }, [dadosNota]);

  const formatarNotaValida = nota => {
    let notaFormatada = nota;
    if (nota.includes(',') || nota.includes('.')) {
      if (nota.length === 2 || nota.length === 1) {
        notaFormatada = nota.replace(',', '');
      }
    }
    return notaFormatada;
  };

  const editouCampo = notaNova => {
    const notaValidar = notaValorInicial || notaValorAtual;
    const notaOriginal = removerCaracteresInvalidos(
      notaValidar?.toString()?.replace?.(',', '.')
    );
    notaNova = removerCaracteresInvalidos(
      notaNova?.toString()?.replace?.(',', '.')
    );
    if (notaOriginal === '' && notaNova === '') {
      return false;
    }
    return notaOriginal !== notaNova;
  };

  const setarValorExibicao = async valorNovo => {
    if (!desabilitar) {
      setNotaValorAtualExibicao(valorNovo);
      onChangeValorAtualExibicao(valorNovo);
    }
  };

  const onBlur = valorNovo => {
    if (!desabilitar) {
      const editou = editouCampo(valorNovo);
      if (!editou) return;

      let notaArredondada = formatarNotaValida(valorNovo);

      if (valorNovo) {
        notaArredondada = arredondarNota(valorNovo, dadosArredondamento);
      }

      onChangeNotaConceito(notaArredondada);
      setNotaValorAtual(notaArredondada);
      setNotaValorAtualExibicao(notaArredondada);
    }
  };

  const validarExibir = valor => {
    if (!desabilitar) {
      setExibir(valor);
    }
  };

  const formataNotaExibicao = newValue => {
    if (
      newValue?.toString?.()?.includes?.(',') ||
      newValue?.toString?.()?.includes?.('.')
    ) {
      if (newValue?.length === 1) {
        return '';
      }
      if (newValue?.toString?.()?.length > 1) {
        return newValue?.toString?.()?.replace?.('.', ',');
      }
    }
    return newValue;
  };

  const styleCampo = { ...style };

  if (ehFechamento && validaAbaixoMedia && estaAbaixoDaMedia(notaValorAtual)) {
    styleCampo.border = `solid 2px ${Base.Vermelho}`;
  }

  const montarCampo = () => (
    <Container
      onFocus={() => validarExibir(true)}
      style={{ ...styleContainer }}
    >
      {label ? <Label text={label} /> : <></>}
      {!desabilitar && exibir ? (
        <CampoTexto
          autoFocus
          addMaskNota
          id={idCampo}
          name={idCampo}
          maxLength={3}
          allowClear={false}
          placeholder="Nota"
          onKeyDown={onKeyDown}
          desabilitado={desabilitar}
          value={formataNotaExibicao(notaValorAtualExibicao)}
          onBlur={e => onBlur(e.target.value)}
          onChange={(_, novaNota) => {
            setarValorExibicao(novaNota);
          }}
          style={{ ...styleCampo }}
        />
      ) : (
        <InputNumberReadOnly
          name={idCampo}
          id={idCampo}
          key={idCampo}
          placeholder="Nota"
          disabled={desabilitar}
          style={{ ...styleCampo }}
          value={formataNotaExibicao(notaValorAtualExibicao)}
        />
      )}

      {dadosNota?.ausente && <LabelAusenteCellTable />}
    </Container>
  );

  if (ehFechamento && validaAbaixoMedia) {
    return (
      <Tooltip
        placement="top"
        title={estaAbaixoDaMedia(notaValorAtual) ? 'Abaixo da Média' : ''}
      >
        {montarCampo()}
      </Tooltip>
    );
  }

  return montarCampo();
};

Nota.propTypes = {
  dadosNota: PropTypes.oneOf([PropTypes.any]),
  idCampo: PropTypes.oneOf([PropTypes.any]),
  desabilitar: PropTypes.bool,
  onChangeNotaConceito: PropTypes.func,
  onChangeValorAtualExibicao: PropTypes.func,
  ehFechamento: PropTypes.bool,
  mediaAprovacaoBimestre: PropTypes.number,
  dadosArredondamento: PropTypes.oneOf([PropTypes.any]),
  onKeyDown: PropTypes.oneOf([PropTypes.any]),
  label: PropTypes.oneOf([PropTypes.any]),
  validaAbaixoMedia: PropTypes.bool,
  styleContainer: PropTypes.oneOf([PropTypes.any]),
  style: PropTypes.oneOf([PropTypes.any]),
};

Nota.defaultProps = {
  dadosNota: {},
  idCampo: 'campo-nota-listao',
  desabilitar: false,
  onChangeNotaConceito: () => {},
  onChangeValorAtualExibicao: () => {},
  ehFechamento: false,
  mediaAprovacaoBimestre: null,
  dadosArredondamento: null,
  onKeyDown: () => {},
  label: null,
  validaAbaixoMedia: true,
  styleContainer: {},
  style: {},
};

export default Nota;
