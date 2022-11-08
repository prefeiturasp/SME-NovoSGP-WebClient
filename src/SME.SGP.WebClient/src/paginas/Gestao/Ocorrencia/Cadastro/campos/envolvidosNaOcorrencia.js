/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { api, erros, ServicoOcorrencias } from '~/servicos';

const EnvolvidosNaOcorrencia = props => {
  const { form, listaUes, onChangeCampos, desabilitar } = props;

  const { ueId, turmaId } = form?.values;

  const ueCodigo = listaUes?.find(d => d?.id === Number(ueId))?.codigo;

  const [listaAlunos, setListaAlunos] = useState([]);
  const [carregandoAlunos, setCarregandoAlunos] = useState(false);
  const [carregandoServidores, setCarregandoServidores] = useState(false);

  const [listaServidores, setListaServidores] = useState([]);

  useEffect(() => {
    if (turmaId) {
      setCarregandoAlunos(true);
      ServicoOcorrencias.buscarCriancas(turmaId)
        .then(resposta => {
          if (resposta?.data?.length) {
            const lista = resposta.data.map(d => {
              return { ...d, nomeExibicao: `${d?.nome} - (${d?.codigoEOL})` };
            });
            if (lista?.length === 1) {
              form.setFieldValue('codigosAlunos', [
                lista[0]?.codigoEOL?.toString(),
              ]);
            }
            setListaAlunos(lista);
          }
        })
        .catch(e => erros(e))
        .finally(() => setCarregandoAlunos(false));
    } else {
      setListaAlunos([]);
      form.setFieldValue('codigosAlunos', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId]);

  useEffect(() => {
    if (ueCodigo) {
      setCarregandoServidores(true);
      api
        .get(`v1/funcionarios/codigoUe/${ueCodigo}`)
        .then(resposta => {
          if (resposta?.data?.length) {
            const lista = resposta.data.map(d => {
              return {
                ...d,
                nomeExibicao: `${d?.nomeServidor} - (${d?.codigoRf})`,
              };
            });
            if (lista?.length === 1) {
              form.setFieldValue('codigosServidores', [
                lista[0]?.codigoRf?.toString(),
              ]);
            }
            setListaServidores(lista);
          }
        })
        .catch(e => erros(e))
        .finally(() => setCarregandoServidores(false));
    } else {
      setListaServidores([]);
      form.setFieldValue('codigosServidores', []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ueCodigo]);

  return (
    <>
      <Col sm={24} md={12}>
        <Loader loading={carregandoAlunos}>
          <SelectComponent
            form={form}
            name="codigosAlunos"
            maxHeightMultiple="100%"
            label="Criança(s)/Estudante(s) envolvido(s) na ocorrência"
            lista={listaAlunos}
            valueOption="codigoEOL"
            valueText="nomeExibicao"
            onChange={() => onChangeCampos()}
            multiple
            disalbed={!turmaId || listaAlunos?.length === 1 || desabilitar}
          />
        </Loader>
      </Col>
      <Col sm={24} md={12}>
        <Loader loading={carregandoServidores}>
          <SelectComponent
            form={form}
            name="codigosServidores"
            maxHeightMultiple="100%"
            label="Servidor(es) envolvido(s) na ocorrência"
            lista={listaServidores}
            valueOption="codigoRf"
            valueText="nomeExibicao"
            onChange={() => onChangeCampos()}
            disalbed={!ueCodigo || listaServidores?.length === 1 || desabilitar}
            multiple
          />
        </Loader>
      </Col>
    </>
  );
};

export default EnvolvidosNaOcorrencia;
