import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { ServicoCalendarios, erros } from '~/servicos';

const TipoCalendarioComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaCalendario, setListaCalendario] = useState([]);

  const { anoLetivo, codigoUe, modalidades, semestre } = form.values;

  const listaModalidadesComunicados = useSelector(
    store => store.comunicados?.listaModalidadesComunicados
  );

  const nomeCampo = 'tipoCalendarioId';
  const modalidadeId = 'modalidadeCalendarioId';

  const obterTiposCalendarios = useCallback(async () => {
    setExibirLoader(true);

    let modalidadesConsulta = modalidades;

    if (modalidades?.length === 1 && modalidades?.[0] === OPCAO_TODOS) {
      modalidadesConsulta = listaModalidadesComunicados
        .map(mod => mod?.valor)
        .filter(valor => valor !== OPCAO_TODOS);
    }

    const resposta =
      await ServicoCalendarios.obterTiposCalendarioPorAnoLetivoModalidade(
        anoLetivo,
        modalidadesConsulta,
        semestre
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data
        .filter(t => !!t.situacao)
        .filter(calendario => calendario.anoLetivo === Number(anoLetivo));

      setListaCalendario(lista);

      if (lista?.length === 1) {
        const { id } = lista[0];
        const modalidadeCalendarioId = [String(lista[0].modalidade)];
        form.setFieldValue(modalidadeId, modalidadeCalendarioId);
        form.setFieldValue(nomeCampo, String(id));
      }
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaCalendario([]);
    }
  }, [anoLetivo, modalidades, listaModalidadesComunicados, semestre]);

  useEffect(() => {
    if (modalidades?.length && listaModalidadesComunicados?.length) {
      const ehEja = modalidades.find(
        mod =>
          Number(mod) === ModalidadeEnum.EJA ||
          Number(mod) === ModalidadeEnum.CELP
      );
      if (ehEja && semestre) {
        obterTiposCalendarios();
      } else if (!ehEja && !semestre) {
        obterTiposCalendarios();
      }
    } else {
      setListaCalendario([]);
    }
  }, [
    modalidades,
    listaModalidadesComunicados,
    obterTiposCalendarios,
    semestre,
  ]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="tipo-calendario"
        label="Tipo de calendário"
        lista={listaCalendario}
        valueOption="id"
        valueText="nome"
        placeholder="Selecione um calendário"
        searchValue={false}
        disabled={
          desabilitar || !modalidades?.length || listaCalendario?.length === 1
        }
        showSearch
        name={nomeCampo}
        form={form}
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('eventoId', undefined);
        }}
        labelRequired={codigoUe && codigoUe !== OPCAO_TODOS}
      />
    </Loader>
  );
};

TipoCalendarioComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

TipoCalendarioComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default TipoCalendarioComunicados;
