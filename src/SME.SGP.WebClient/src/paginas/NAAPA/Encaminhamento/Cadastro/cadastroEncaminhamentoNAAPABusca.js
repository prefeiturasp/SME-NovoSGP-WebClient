import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import LocalizarEstudante from '~/componentes-sgp/LocalizarEstudante';
import { RotasDto } from '~/dtos';
import { verificaSomenteConsulta } from '~/servicos';
import CadastroEncaminhamentoNAAPABotoesAcao from './cadastroEncaminhamentoNAAPABotoesAcao';

const CadastroEncaminhamentoNAAPABusca = () => {
  const usuario = useSelector(state => state.usuario);
  const { permissoes } = usuario;
  const { podeIncluir } = permissoes?.[RotasDto.OCORRENCIAS];

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(
      permissoes?.[RotasDto.ENCAMINHAMENTO_NAAPA]
    );

    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  return (
    <>
      <Cabecalho pagina="Novo encaminhamento">
        <CadastroEncaminhamentoNAAPABotoesAcao
          podeIncluir={podeIncluir}
          somenteConsulta={somenteConsulta}
        />
      </Cabecalho>

      <Card padding="24px 24px">
        <LocalizarEstudante />
      </Card>
    </>
  );
};

export default CadastroEncaminhamentoNAAPABusca;
