import React from 'react';
import * as moment from 'moment';
import { Divider } from 'antd';

import { Label } from '~/componentes';

const CampoMensagemInfantil = () => {
  const mural = [
    {
      dataPublicacao: '01-04-2021',
      email: 'mural_1@gmail',
      mensagem:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      tipo: 1,
    },
    {
      dataPublicacao: '01-04-2021',
      email: 'mural_2@gmail',
      mensagem:
        'Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      tipo: 1,
    },
    {
      dataPublicacao: '01-04-2021',
      email: 'mural_2@gmail',
      mensagem:
        'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
      tipo: 1,
    },
  ];
  const atividade = [
    {
      dataPublicacao: '01-04-2021',
      titulo: 'Brincadeira1',
      email: 'atividade_1@gmail',
      mensagem:
        'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      tipo: 2,
    },
    {
      dataPublicacao: '01-04-2021',
      titulo: 'Brincadeira2',
      email: 'atividade_1@gmail',
      mensagem:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
      tipo: 2,
    },
    {
      dataPublicacao: '01-04-2021',
      titulo: 'Brincadeira3',
      email: 'atividade_1@gmail',
      mensagem:
        'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
      tipo: 2,
    },
  ];

  const montarMural = () => {
    if (!mural?.length) {
      return 'Sem dados';
    }
    return mural.map(item => (
      <div className="mb-3">
        <div>
          {`${item.email} - ${
            item?.dataPublicacao
              ? moment(item.dataPublicacao).format('DD/MM/YYYY')
              : ''
          }`}
        </div>
        <div>{item.mensagem}</div>
      </div>
    ));
  };
  const montarAtividade = () => {
    if (!atividade?.length) {
      return 'Sem dados';
    }
    return atividade.map(item => (
      <div className="mb-3">
        <div>
          {`${item.email} - ${
            item?.dataPublicacao
              ? moment(item.dataPublicacao).format('DD/MM/YYYY')
              : ''
          }`}
        </div>
        <div>{item.titulo}</div>
        <div>{item.mensagem}</div>
      </div>
    ));
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-2">
        <Label text="Mural" />
        {montarMural()}

        <Divider />

        <Label text="Atividade" />
        {montarAtividade()}
      </div>
    </div>
  );
};

export default CampoMensagemInfantil;
