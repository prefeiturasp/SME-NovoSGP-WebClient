import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Base, CampoTexto } from '~/componentes';
import InputNumberReadOnly from '~/componentes-sgp/camposSomenteLeitura/inputNumberReadOnly/inputNumberReadOnly';
import { arredondarNota, converterAcaoTecla } from '~/utils';
import LabelAusenteCellTable from './labelAusenteCellTable';

import { Container } from './style';

const Nota = props => {
  const {
    dadosNota,
    idCampo,
    desabilitar,
    onChangeNotaConceito,
    ehFechamento,
    mediaAprovacaoBimestre,
    dadosArredondamento,
  } = props;

  const [exibir, setExibir] = useState(false);
  const [notaValorAtual, setNotaValorAtual] = useState();
  const regexCaracteresInvalidos = /[^0-9,.]+/g;

  const removerCaracteresInvalidos = texto =>
    texto.replace(regexCaracteresInvalidos, '');

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

  const setarValorNovo = async valorNovo => {
    if (!desabilitar) {
      onChangeNotaConceito(valorNovo);
      setNotaValorAtual(valorNovo);
    }
  };

  const onBlur = valorNovo => {
    if (!desabilitar) {
      let notaArredondada = valorNovo;

      if (valorNovo && dadosArredondamento) {
        notaArredondada = arredondarNota(valorNovo, dadosArredondamento);
      }

      onChangeNotaConceito(notaArredondada);
      setNotaValorAtual(notaArredondada);
    }
  };

  const validarExibir = valor => {
    if (!desabilitar) {
      setExibir(valor);
    }
  };

  const apertarTecla = e => {
    const teclaEscolhida = converterAcaoTecla(e.keyCode);
    if (teclaEscolhida === 0 && !notaValorAtual) {
      setarValorNovo(0);
    }
  };

  const formataNota = newValue => newValue?.toString?.()?.replace?.('.', ',');

  const styleCampo = {};

  if (estaAbaixoDaMedia(notaValorAtual)) {
    styleCampo.border = `solid 2px ${Base.Vermelho}`;
  }

  const montarCampo = () => (
    <Container onFocus={() => validarExibir(true)}>
      {!desabilitar && exibir ? (
        <CampoTexto
          autoFocus
          addMaskNota
          id={idCampo}
          maxLength={3}
          allowClear={false}
          placeholder="Nota"
          onKeyUp={apertarTecla}
          desabilitado={desabilitar}
          value={formataNota(notaValorAtual)}
          onBlur={e => onBlur(e.target.value)}
          onChange={(_, novaNota) => {
            setarValorNovo(novaNota);
          }}
        />
      ) : (
        <InputNumberReadOnly
          id={idCampo}
          key={idCampo}
          placeholder="Nota"
          disabled={desabilitar}
          style={{ ...styleCampo }}
          value={formataNota(notaValorAtual)}
        />
      )}

      {dadosNota?.ausente && <LabelAusenteCellTable />}
    </Container>
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

Nota.propTypes = {
  dadosNota: PropTypes.oneOf([PropTypes.any]),
  idCampo: PropTypes.oneOf([PropTypes.any]),
  desabilitar: PropTypes.bool,
  onChangeNotaConceito: PropTypes.func,
  ehFechamento: PropTypes.bool,
  mediaAprovacaoBimestre: PropTypes.number,
  dadosArredondamento: PropTypes.oneOf([PropTypes.any]),
};

Nota.defaultProps = {
  dadosNota: {},
  idCampo: 'campo-nota-listao',
  desabilitar: false,
  onChangeNotaConceito: () => {},
  ehFechamento: false,
  mediaAprovacaoBimestre: null,
  dadosArredondamento: null,
};

export default Nota;
