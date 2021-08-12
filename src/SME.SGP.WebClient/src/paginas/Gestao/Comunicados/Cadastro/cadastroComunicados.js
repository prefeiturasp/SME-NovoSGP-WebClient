import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { RotasDto } from '~/dtos';
import { setBreadcrumbManual, verificaSomenteConsulta } from '~/servicos';
import BotoesAcoesCadastroComunicados from './botoesAcoesCadastroComunicados';
import FormCadastroComunicados from './Filtros/formCadastroComunicados';
import LoaderGeralComunicados from './loaderGeralComunicados';

const CadastroComunicados = ({ match }) => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_COMUNICADOS];

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  useEffect(() => {
    const ehSomenteConsulta = verificaSomenteConsulta(permissoesTela);
    setSomenteConsulta(ehSomenteConsulta);
  }, [permissoesTela]);

  useEffect(() => {
    setBreadcrumbManual(
      match.url,
      'Cadastro de comunicados',
      RotasDto.ACOMPANHAMENTO_COMUNICADOS
    );
  }, [match]);

  return (
    <>
      <Cabecalho pagina="Comunicação com pais ou responsáveis" classes="mb-2" />
      <LoaderGeralComunicados>
        <Card>
          <div className="col-md-12 p-0">
            <BotoesAcoesCadastroComunicados
              comunicadoId={match?.params?.id}
              somenteConsulta={somenteConsulta}
            />

            <FormCadastroComunicados
              comunicadoId={match?.params?.id}
              somenteConsulta={somenteConsulta}
            />
          </div>
        </Card>
      </LoaderGeralComunicados>
    </>
  );
};

CadastroComunicados.propTypes = {
  match: PropTypes.objectOf(PropTypes.object),
};

CadastroComunicados.defaultProps = {
  match: {},
};

export default CadastroComunicados;
