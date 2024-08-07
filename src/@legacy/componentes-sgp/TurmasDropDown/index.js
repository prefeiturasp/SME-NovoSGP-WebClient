import React, { useEffect, useState } from 'react';
import t from 'prop-types';

// Componentes
import { SelectComponent } from '~/componentes';

// Serviços
import AbrangenciaServico from '~/servicos/Abrangencia';

function TurmasDropDown({
  form,
  onChange,
  label,
  ueId,
  modalidadeId,
  valor,
  dados,
  allowClear,
  id,
}) {
  const [listaTurmas, setListaTurmas] = useState([]);

  useEffect(() => {
    async function buscaTurmas() {
      const { data } = await AbrangenciaServico.buscarTurmas(
        ueId,
        modalidadeId
      );
      if (data) {
        setListaTurmas(
          data.map(item => ({
            desc: item.nome,
            valor: item.codigo,
            nomeFiltro: item.nomeFiltro,
          }))
        );
      }
    }

    if (ueId && modalidadeId && !dados) {
      buscaTurmas();
    } else if (dados) {
      setListaTurmas(dados);
    } else {
      setListaTurmas([]);
    }
  }, [dados, modalidadeId, ueId]);

  useEffect(() => {
    if (listaTurmas.length === 1 && form) {
      form.setFieldValue('turmaId', listaTurmas[0].valor);
      onChange(listaTurmas[0].valor, listaTurmas[0].desc);
    }
  }, [form, listaTurmas, onChange]);

  const onChangeTurma = codigoTurma => {
    const turmaAtual = listaTurmas?.find(
      item => String(item?.valor) === String(codigoTurma)
    );
    let nomeTurma = '';
    if (turmaAtual) {
      nomeTurma = turmaAtual.desc;
    }
    onChange(codigoTurma, nomeTurma);
  };

  return (
    <SelectComponent
      id={id}
      form={form}
      name="turmaId"
      className="fonte-14"
      label={!label ? null : label}
      onChange={onChangeTurma}
      lista={listaTurmas}
      valueOption="valor"
      valueText="nomeFiltro"
      placeholder="Turma"
      valueSelect={valor}
      disabled={form && (listaTurmas.length === 0 || listaTurmas.length === 1)}
      allowClear={allowClear}
      showSearch
    />
  );
}

TurmasDropDown.propTypes = {
  onChange: t.func,
  form: t.oneOfType([t.objectOf(t.object), t.any]),
  label: t.string,
  ueId: t.string,
  modalidadeId: t.oneOfType([t.string, t.number]),
  valor: t.string,
  dados: t.oneOfType([t.object, t.array]),
  allowClear: t.bool,
  id: t.string,
};

TurmasDropDown.defaultProps = {
  onChange: () => {},
  form: null,
  label: null,
  ueId: null,
  modalidadeId: null,
  valor: '',
  dados: null,
  allowClear: true,
  id: '',
};

export default TurmasDropDown;
