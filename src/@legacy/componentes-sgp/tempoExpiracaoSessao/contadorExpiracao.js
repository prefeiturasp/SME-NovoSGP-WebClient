import React, { useCallback, useEffect, useState } from 'react';

const ContadorExpiracao = props => {
  const { dataHoraExpiracao, deslogarDoUsuario } = props;

  const calcularTempoExpiracao = useCallback(() => {
    const diferenca = +new Date(dataHoraExpiracao) - +new Date();
    let tempoParaExpirar = {
      horas: 0,
      minutos: 0,
      segundos: 0,
    };

    if (diferenca > 0) {
      const totalSegundos = Math.floor(diferenca / 1000);

      tempoParaExpirar = {
        horas: Math.floor(totalSegundos / 3600),
        minutos: Math.floor((totalSegundos / 60) % 60),
        segundos: totalSegundos % 60,
      };
    }

    if (diferenca < 1) {
      deslogarDoUsuario();
    }

    return tempoParaExpirar;
  }, [dataHoraExpiracao, deslogarDoUsuario]);

  const [tempoParaExpirar, setTempoParaExpirar] = useState(
    calcularTempoExpiracao()
  );

  useEffect(() => {
    const calculo = setInterval(() => {
      setTempoParaExpirar(calcularTempoExpiracao());
    }, 1000);
    return () => clearInterval(calculo);
  }, [calcularTempoExpiracao]);

  const montarExibicaoTempo = tempo => {
    if (tempo < 10) {
      tempo = '0' + tempo;
    }
    return tempo;
  };

  const montarContadorExpiracao = ({ horas, minutos, segundos }) => {
    const exibicaoMinutos = montarExibicaoTempo(minutos);
    const exibicaoSegundos = montarExibicaoTempo(segundos);

    if (horas === 0) {
      return `${exibicaoMinutos}:${exibicaoSegundos}`;
    }

    return `${montarExibicaoTempo(
      horas
    )}:${exibicaoMinutos}:${exibicaoSegundos}`;
  };

  return <>{montarContadorExpiracao(tempoParaExpirar)}</>;
};

export default ContadorExpiracao;
