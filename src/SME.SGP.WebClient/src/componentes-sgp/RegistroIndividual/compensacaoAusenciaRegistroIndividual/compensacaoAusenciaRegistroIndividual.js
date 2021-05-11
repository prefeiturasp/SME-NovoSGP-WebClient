import React, { useState } from 'react';
import CampoTexto from '~/componentes/campoTexto';
import Label from '~/componentes/label';
import SelectComponent from '~/componentes/select';

const CompensacaoAusenciaRegistroIndividual = () => {
  const [listaTipoContato] = useState([
    {
      valor: 1,
      desc: 'Contato telefônico',
    },
    {
      valor: 2,
      desc: 'Devolutivas das famílias nas Redes Sociais veiculadas pela UE',
    },
  ]);
  const [listaContatoRealizadoCom] = useState([
    {
      valor: 1,
      desc: 'Mãe',
    },
    {
      valor: 2,
      desc: 'Pai',
    },
    {
      valor: 3,
      desc: 'Responsável',
    },
    {
      valor: 4,
      desc: 'Outro',
    },
  ]);

  const [listaQuantidadeCompensacao] = useState([
    {
      valor: 1,
      desc: '1',
    },
    {
      valor: 2,
      desc: '2',
    },
  ]);

  const [tipoContato, setTipoContato] = useState();
  const [contatoRealizadoCom, setContatoRealizadoCom] = useState();
  const [nomeOuParentesco, setNomeOuParentesco] = useState();
  const [quantidadeCompensacao, setQuantidadeCompensacao] = useState();

  const onChangeTipoContato = valor => setTipoContato(valor);
  const onChangeContatoRealizadoCom = valor => setContatoRealizadoCom(valor);
  const onChangeNomeOuParentesco = valor => setNomeOuParentesco(valor);
  const onChangeQuantidadeCompensacao = valor =>
    setQuantidadeCompensacao(valor);

  return (
    <div className="row mt-4">
      <div className="col-md-12 mb-2" style={{ fontSize: 16, fontWeight: 700 }}>
        Somente para registros feitos a distância
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
        <SelectComponent
          id="tipo-contato"
          label="Tipo de contato"
          lista={listaTipoContato}
          valueOption="valor"
          valueText="desc"
          valueSelect={tipoContato}
          placeholder="Selecione uma das opções"
          onChange={onChangeTipoContato}
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
        <SelectComponent
          id="contato-realizado-com"
          label="Contato realizado com"
          lista={listaContatoRealizadoCom}
          valueOption="valor"
          valueText="desc"
          valueSelect={contatoRealizadoCom}
          placeholder="Selecione uma das opções"
          onChange={onChangeContatoRealizadoCom}
        />
      </div>
      <div className="col-md-12 mb-2">
        <CampoTexto
          id="nome-parentesco"
          label="Nome ou parentesco"
          maxLength={100}
          onChange={onChangeNomeOuParentesco}
          value={nomeOuParentesco}
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
        <Label
          text="Compensação de ausência "
          observacaoText="(Até 10 dias por registo)"
        />
        <SelectComponent
          id="compensacao-ausencia"
          lista={listaQuantidadeCompensacao}
          valueOption="valor"
          valueText="desc"
          valueSelect={quantidadeCompensacao}
          placeholder="Selecione uma das opções"
          onChange={onChangeQuantidadeCompensacao}
        />
      </div>
    </div>
  );
};

export default CompensacaoAusenciaRegistroIndividual;
