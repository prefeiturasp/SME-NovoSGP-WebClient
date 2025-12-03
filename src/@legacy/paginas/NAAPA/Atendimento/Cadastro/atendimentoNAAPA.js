import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Cabecalho } from '~/componentes-sgp';
import LocalizarEstudante from '~/componentes-sgp/LocalizarEstudante';
import { Card } from '~/componentes';
import CadastroAtendimentoNAAPABotoesAcao from './cadastroAtendimentoNAAPABotoesAcao';
import CadastroAtendimentoNAAPA from './cadastroAtendimentoNAAPA';
import { store } from '@/core/redux';
import LoaderEncaminhamentoNAAPA from './componentes/loaderEncaminhamentoNAAPA';
import { limparDadosLocalizarEstudante } from '~/redux/modulos/localizarEstudante/actions';
import { setLimparDadosEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { ROUTES } from '@/core/enum/routes';
import { verificaSomenteConsulta } from '~/servicos';
import { setLimparDadosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';

const AtendimentoNAAPA = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuario = useSelector(state => state.usuario);
  const permissoesTela = usuario.permissoes[ROUTES.ATENDIMENTO_NAAPA];

  const encaminhamentoId = id;

  const [mostrarBusca, setMostrarBusca] = useState(!encaminhamentoId);

  useEffect(() => {
    return () => {
      store.dispatch(limparDadosLocalizarEstudante());
      store.dispatch(setLimparDadosEncaminhamentoNAAPA());
      store.dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, []);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(permissoesTela);

    if (mostrarBusca && soConsulta) {
      navigate(ROUTES.ATENDIMENTO_NAAPA);
    }
  }, [permissoesTela, mostrarBusca]);

  return (
    <LoaderEncaminhamentoNAAPA>
      <Cabecalho pagina="Atendimento Individual">
        <CadastroAtendimentoNAAPABotoesAcao
          mostrarBusca={mostrarBusca}
          setMostrarBusca={setMostrarBusca}
        />
      </Cabecalho>

      <Card padding="24px 24px">
        {mostrarBusca ? (
          <LocalizarEstudante consideraNovasUEs />
        ) : (
          <CadastroAtendimentoNAAPA />
        )}
      </Card>
    </LoaderEncaminhamentoNAAPA>
  );
};

export default AtendimentoNAAPA;
