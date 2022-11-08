/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import ServicoLocalizadorFuncionario from '~/componentes-sgp/LocalizadorFuncionario/services/ServicoLocalizadorFuncionario';
import { erros, ServicoOcorrencias } from '~/servicos';

const EnvolvidosNaOcorrencia = props => {
  const {
    form,
    listaUes,
    setListaServidoresSelecionados,
    listaServidoresSelecionados,
    setListaAlunosSelecionados,
    listaAlunosSelecionados,
  } = props;

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
            setListaAlunos(lista);
          }
        })
        .catch(e => erros(e))
        .finally(() => setCarregandoAlunos(false));
    } else {
      setListaAlunos([]);
      setListaAlunosSelecionados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId]);

  useEffect(() => {
    if (ueCodigo) {
      setCarregandoServidores(true);
      ServicoLocalizadorFuncionario.buscarPorNome({
        codigoUe: ueCodigo,
        limite: 999,
      })
        .then(resposta => {
          if (resposta?.data?.items?.length) {
            const lista = resposta.data.items.map(d => {
              return {
                ...d,
                nomeExibicao: `${d?.nomeServidor} - (${d?.codigoRf})`,
              };
            });
            if (lista?.length === 1) {
              setListaServidoresSelecionados(lista[0]?.codigoRf);
            }
            setListaServidores(lista);
          }
        })
        .catch(e => erros(e))
        .finally(() => setCarregandoServidores(false));
    } else {
      setListaServidores([]);
      setListaServidoresSelecionados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ueCodigo]);

  return (
    <>
      <Col sm={24} md={12}>
        <Loader loading={carregandoAlunos}>
          <SelectComponent
            maxHeightMultiple="100%"
            label="Criança(s)/Estudante(s) envolvido(s) na ocorrência"
            lista={listaAlunos}
            valueOption="codigoEOL"
            valueText="nomeExibicao"
            onChange={setListaAlunosSelecionados}
            valueSelect={listaAlunosSelecionados}
            multiple
            disalbed={!turmaId || listaAlunos?.length === 1}
          />
        </Loader>
      </Col>
      <Col sm={24} md={12}>
        <Loader loading={carregandoServidores}>
          <SelectComponent
            maxHeightMultiple="100%"
            label="Servidor(es) envolvido(s) na ocorrência"
            lista={listaServidores}
            valueOption="codigoRf"
            valueText="nomeExibicao"
            onChange={setListaServidoresSelecionados}
            valueSelect={listaServidoresSelecionados}
            disalbed={!ueCodigo || listaServidores?.length === 1}
            multiple
          />
        </Loader>
      </Col>
    </>
  );
};

export default EnvolvidosNaOcorrencia;
