import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import { ModalidadeDTO } from '~/dtos';
import { setAlunosComunicados } from '~/redux/modulos/comunicados/actions';
import { erros, ServicoComunicados } from '~/servicos';

const SemestreComunicados = ({ form, onChangeCampos, desabilitar }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);

  const { anoLetivo, codigoUe, modalidades } = form.values;

  const temModalidadeEja = modalidades?.find(
    item => String(item) === String(ModalidadeDTO.EJA)
  );

  const dispatch = useDispatch();

  const nomeCampo = 'semestre';

  const obterSemestres = useCallback(async () => {
    setExibirLoader(true);
    // TODO: VERIFICAR SOBRE O CONSIDERA HISTÓRICO!
    const retorno = await ServicoComunicados.obterSemestres(
      false,
      ModalidadeDTO.EJA,
      anoLetivo,
      codigoUe
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => ({
        descricao: String(periodo),
        valor: String(periodo),
      }));
      setListaSemestres(lista);

      if (lista?.length === 1) {
        const { valor } = lista[0];
        form.setFieldValue(nomeCampo, valor);
      }
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaSemestres([]);
    }
  }, [anoLetivo, codigoUe]);

  useEffect(() => {
    if (modalidades?.length) {
      if (modalidades?.length && temModalidadeEja) {
        obterSemestres(ModalidadeDTO.EJA);
      }
    } else {
      form.setFieldValue(nomeCampo, undefined);
      setListaSemestres([]);
    }
  }, [modalidades, obterSemestres]);

  return (
    <Loader loading={exibirLoader} ignorarTip>
      <SelectComponent
        id="semestre"
        label="Semestre"
        lista={listaSemestres}
        valueOption="valor"
        valueText="descricao"
        disabled={
          !modalidades?.length ||
          listaSemestres?.length === 1 ||
          !temModalidadeEja ||
          desabilitar
        }
        placeholder="Semestre"
        showSearch
        name={nomeCampo}
        form={form}
        onChange={() => {
          onChangeCampos();
          form.setFieldValue('turmas', []);
          form.setFieldValue('alunoEspecifico', undefined);
          form.setFieldValue('alunos', []);
          form.setFieldValue('tipoCalendarioId', undefined);
          form.setFieldValue('eventoId', undefined);
          dispatch(setAlunosComunicados([]));
        }}
      />
    </Loader>
  );
};

SemestreComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

SemestreComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default SemestreComunicados;
