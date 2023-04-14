import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Card } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import { RotasDto } from '~/dtos';
import { setBreadcrumbManual, verificaSomenteConsulta } from '~/servicos';
import BotoesAcoesCadastroComunicados from './botoesAcoesCadastroComunicados';
import FormCadastroComunicados from './Filtros/formCadastroComunicados';
import LoaderGeralComunicados from './loaderGeralComunicados';

const CadastroComunicados = () => {
  const location = useLocation();
  const paramsRoute = useParams();

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
      location.pathname,
      'Cadastro de comunicados',
      RotasDto.ACOMPANHAMENTO_COMUNICADOS
    );
  }, [location]);

  return (
    <>
      <LoaderGeralComunicados>
        <Cabecalho pagina="Cadastro de comunicados">
          <BotoesAcoesCadastroComunicados
            comunicadoId={paramsRoute?.id}
            somenteConsulta={somenteConsulta}
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <FormCadastroComunicados
              comunicadoId={paramsRoute?.id}
              somenteConsulta={somenteConsulta}
            />
          </div>
        </Card>
      </LoaderGeralComunicados>
    </>
  );
};

export default CadastroComunicados;
