import { Button } from 'antd';
import React from 'react';

const TesteESLint = () => {
  const varNaoUtilizada = 'Teste de variável não utilizada';

  const onClickSalvar = (valor) => {
    console.log(valor);
  };

  const indexMap = [].reduce(function (memo, item, index) {
    memo[item] = index;
  }, {});

  var varGlobalTeste = 'Variável global';

  const onClickSalvar = () => {};

  return (
    <>
      {varGlobalTeste}
      <Button onClick={() => onClickSalvar()}>Salvar</Button>
    </>
  );
};

export default TesteESLint;
