/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import {
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
} from '~/componentes-sgp/filtro/idsCampos';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';

const ModalidadeSemestreOcorrencia = props => {
  const {
    form,
    onChangeCampos,
    desabilitar,
    dreCodigo,
    ueCodigo,
    ocorrenciaId,
  } = props;

  const [listaModalidades, setListaModalidades] = useState(false);
  const [listaSemestres, setListaSemestres] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, modalidade } = form.values;

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const listaModalidadesEdicao = form?.initialValues?.modalidade
    ? [
        {
          valor: form?.initialValues?.modalidade || '',
          descricao: form?.initialValues?.modalidadeNome,
        },
      ]
    : [];

  const listaSemestresEdicao = form?.initialValues?.semestre
    ? [
        {
          valor: form?.initialValues?.semestre || '',
          descricao: form?.initialValues?.semestre,
        },
      ]
    : [];

  const obterModalidades = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await ServicoFiltroRelatorio.obterModalidades(
      ueCodigo,
      anoLetivo,
      false
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        const { valor } = lista[0];
        form.setFieldValue('modalidade', valor);
      }
      setListaModalidades(lista);
    } else {
      form.setFieldValue('modalidade', undefined);
      setListaModalidades([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, ueCodigo]);

  useEffect(() => {
    if (ocorrenciaId) return;

    if (ueCodigo) {
      obterModalidades();
    } else {
      form.setFieldValue('modalidade', undefined);
      setListaModalidades([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ueCodigo]);

  const obterSemestres = useCallback(async () => {
    const retorno = await AbrangenciaServico.obterSemestres(
      false,
      anoLetivo,
      modalidade,
      dreCodigo,
      ueCodigo
    ).catch(e => erros(e));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });
      if (lista?.length === 1) {
        form.setFieldValue('semestre', lista[0].valor);
      }
      setListaSemestres(lista);
    } else {
      setListaSemestres([]);
      form.setFieldValue('semestre', undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, modalidade, dreCodigo, ueCodigo]);

  useEffect(() => {
    if (ocorrenciaId) return;

    if (modalidade && ehEJA) {
      obterSemestres();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ehEJA, modalidade]);

  return (
    <>
      <Col sm={24} md={12} lg={ehEJA ? 8 : 12}>
        <Loader loading={exibirLoader} ignorarTip>
          <SelectComponent
            id={SGP_SELECT_MODALIDADE}
            label="Modalidade"
            lista={ocorrenciaId ? listaModalidadesEdicao : listaModalidades}
            valueOption="valor"
            valueText="descricao"
            disabled={
              !ueCodigo ||
              listaModalidades?.length === 1 ||
              desabilitar ||
              !!ocorrenciaId
            }
            placeholder="Modalidade"
            name="modalidade"
            form={form}
            onChange={() => {
              onChangeCampos();
              form.setFieldValue('semestre', undefined);
              form.setFieldValue('turmaId', null);
            }}
          />
        </Loader>
      </Col>
      {ehEJA ? (
        <Col sm={24} md={12} lg={8}>
          <SelectComponent
            id={SGP_SELECT_SEMESTRE}
            label="Semestre"
            lista={ocorrenciaId ? listaSemestresEdicao : listaSemestres}
            valueOption="valor"
            valueText="descricao"
            disabled={
              !modalidade || listaSemestres?.length === 1 || !!ocorrenciaId
            }
            placeholder="Semestre"
            name="semestre"
            form={form}
            onChange={() => {
              onChangeCampos();
              form.setFieldValue('turmaId', null);
            }}
          />
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalidadeSemestreOcorrencia;